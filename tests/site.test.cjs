const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const root = process.env.SITE_ROOT || path.resolve(__dirname, '..');
const routes = ['index.html', 'services/expert-bookkeeping.html', 'services/trustworthy-accounting-services.html'];
let server;
let browser;
let origin;

before(async () => {
    server = createServer(async (request, response) => {
        const pathname = new URL(request.url, 'http://localhost').pathname;
        const filename = path.join(root, pathname === '/' ? 'index.html' : pathname);
        try {
            const data = await readFile(filename);
            const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg' };
            response.writeHead(200, { 'Content-Type': type[path.extname(filename)] || 'application/octet-stream' });
            response.end(data);
        } catch {
            response.writeHead(404);
            response.end();
        }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    origin = 'http://127.0.0.1:' + server.address().port;
    browser = await chromium.launch();
});

after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
});

for (const route of routes) {
    for (const width of [390, 1280]) {
        test(route + ' navigation and content at ' + width + 'px', async () => {
            const page = await browser.newPage({ viewport: { width, height: 900 } });
            page.setDefaultTimeout(5000);
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            try {
                await page.route('**/*', intercepted => {
                    if (intercepted.request().url().startsWith(origin)) return intercepted.continue();
                    return intercepted.fulfill({ status: 200, body: '' });
                });
                await page.goto(origin + '/' + route);
                assert.equal(await page.locator('a[href*="maps.google"], .service-location').count(), 0);
                if (route.startsWith('services/')) {
                    assert.equal(await page.locator('.service-contact-info .contact-form-text').evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
                }
                const menu = page.locator('.service-menu');
                if (width < 1200) {
                    const button = page.getByRole('button', { name: 'Toggle navigation' });
                    assert.equal(await button.count(), 1, 'Navigation must use a named button');
                    await button.focus();
                    await page.keyboard.press('Enter');
                    assert.equal(await button.getAttribute('aria-expanded'), 'true');
                    assert.equal(await page.locator('#nav').isVisible(), true);
                }
                assert.equal(await menu.count(), 1, 'Services must use a native disclosure');
                const summary = menu.locator('summary');
                await summary.focus();
                await page.keyboard.press('Enter');
                assert.equal(await menu.evaluate(element => element.open), true);
                await page.keyboard.press('Tab');
                assert.equal(await page.locator('.dropdown-link').first().evaluate(element => element === document.activeElement), true);
                assert.equal(await page.locator('.dropdown-link').first().isVisible(), true);
                await page.keyboard.press('Escape');
                assert.equal(await menu.evaluate(element => element.open), false);
                assert.equal(await summary.evaluate(element => element === document.activeElement), true);
                await page.keyboard.press('Space');
                assert.equal(await menu.evaluate(element => element.open), true);
                await page.locator('.dropdown-link').first().click();
                await page.waitForURL('**/services/expert-bookkeeping.html');
                assert.equal(await page.locator('a[href*="maps.google"]').count(), 0);
                assert.equal(await page.locator('.service-location').count(), 0);
                const color = await page.locator('.service-contact-info .contact-form-text').evaluate(element => getComputedStyle(element).color);
                assert.equal(color, 'rgb(255, 255, 255)');
                if (width < 1200) {
                    await page.getByRole('button', { name: 'Toggle navigation' }).click();
                    await page.locator('summary').click();
                    assert.equal(await page.locator('#nav').isVisible(), true, 'Services must not close the mobile navigation');
                    await page.mouse.click(5, 850);
                    assert.equal(await page.getByRole('button', { name: 'Toggle navigation' }).getAttribute('aria-expanded'), 'false');
                }
                assert.deepEqual(errors, []);
            } finally {
                await page.close();
            }
        });
    }
}

for (const route of routes) {
    for (const javaScriptEnabled of [true, false]) {
        test(route + ' sends a POST with JavaScript ' + javaScriptEnabled, async () => {
            const context = await browser.newContext({ javaScriptEnabled });
            const page = await context.newPage();
            page.setDefaultTimeout(5000);
            let submission;
            let alerts = 0;
            page.on('dialog', async dialog => { alerts++; await dialog.dismiss(); });
            await context.route('**/*', async intercepted => {
                const request = intercepted.request();
                if (request.url().startsWith(origin)) return intercepted.continue();
                if (request.url().startsWith('https://formsubmit.co/')) {
                    submission = { url: request.url(), method: request.method(), data: request.postData() };
                    return intercepted.fulfill({ contentType: 'text/html', body: '<p>Intercepted test submission</p>' });
                }
                return intercepted.fulfill({ status: 200, body: '' });
            });
            try {
                await page.goto(origin + '/' + route);
                const form = page.locator('#contactForm');
                assert.equal(await form.getAttribute('method'), 'POST');
                assert.equal(await form.getAttribute('action'), 'https://formsubmit.co/Hollie@brightpathaccounting.com');
                await page.getByRole('button', { name: /^(Send|Send Message)$/ }).click();
                assert.equal(submission, undefined, 'Empty required fields must block submission');
                await page.locator('[name="name"]').fill('Test Sender');
                await page.locator('[name="email"]').fill('sender@example.com');
                await page.locator('[name="phone"]').fill('5555550100');
                await page.locator('[name="message"]').fill('Regression check & special characters = preserved');
                await Promise.all([
                    page.waitForURL('https://formsubmit.co/**'),
                    page.getByRole('button', { name: /^(Send|Send Message)$/ }).click()
                ]);
                assert.equal(submission.method, 'POST');
                assert.equal(new URL(submission.url).search, '');
                const data = new URLSearchParams(submission.data);
                assert.equal(data.get('name'), 'Test Sender');
                assert.equal(data.get('email'), 'sender@example.com');
                assert.equal(data.get('phone'), '5555550100');
                assert.equal(data.get('message'), 'Regression check & special characters = preserved');
                assert.equal(data.get('_subject'), 'New BrightPath Accounting inquiry');
                assert.equal(alerts, 0, 'The site must not claim success before delivery');
            } finally {
                await context.close();
            }
        });
    }
}
