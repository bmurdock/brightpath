# BrightPath Accounting website

A static website for BrightPath Accounting's bookkeeping and accounting services. The homepage and two service pages share `styles.css` and `script.js`. There is no build step or application server.

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. GitHub Pages is configured to publish the root of the `master` branch using the domain in `CNAME`. Local edits do not update the deployed site.

## Contact email

All three contact forms use a native HTTPS POST to FormSubmit, addressed to `Hollie@brightpathaccounting.com`. They submit the visitor's name, email, optional phone number, and message with the subject `New BrightPath Accounting inquiry`. FormSubmit handles the next page and CAPTCHA. The site does not display a simulated success message or clear the form on a timer. Submission also works without JavaScript.

This integration is implemented locally, but recipient activation and actual inbox delivery have **not been verified**. Before treating the form as operational:

1. Publish the reviewed changes.
2. Submit a clearly identified test inquiry from the deployed site and complete the provider's CAPTCHA.
3. Have Hollie open the FormSubmit activation email and confirm the recipient. The [FormSubmit setup instructions](https://formsubmit.co/) describe this first-submission activation step.
4. Submit another test inquiry after activation.
5. Confirm that Hollie receives the message, all four fields are intact, and replying addresses the visitor. Check spam if the message is missing.
6. Verify each service page and the homepage. Record receipt separately from a successful browser submission.

The form identifies FormSubmit as the processor and offers a direct email link. No email or messaging credentials belong in this public repository. Do not disable the provider's default CAPTCHA as a workaround for delivery problems.

Automated checks intercept requests before they reach FormSubmit. They verify the request destination, POST method, payload, validation, and behavior with JavaScript disabled. They do not activate the recipient or prove email delivery.

## SMS notifications

Automatic notifications to `801-706-4092` are not implemented. They require an SMS provider and a private backend or managed automation, with credentials kept outside this static site. No provider account, sender, or backend has been configured for this project. Select and configure those before adding SMS; do not present email delivery as SMS delivery.

## Verification

The regression script uses Node's test runner and Playwright with Chromium. The site itself has no new runtime dependencies. Use an existing Playwright installation, or install test tooling outside the repository:

```sh
npm install --prefix /tmp/brightpath-test-tools playwright
/tmp/brightpath-test-tools/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/brightpath-test-tools/node_modules node --test tests/site.test.cjs
node --check script.js
git diff --check
```

The tests start a temporary local server and close it afterward. External requests are intercepted; no real email or SMS is sent. They cover desktop and mobile navigation, keyboard disclosure controls, contact form POSTs with and without JavaScript, removed directions, and contact prompt color.

Also inspect the three pages visually at mobile and desktop widths. Real provider activation, email receipt, and production deployment remain separate acceptance checks.
