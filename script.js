// Navigation is visible by default; only collapse it when JavaScript is available.
document.documentElement.classList.add('js');

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const serviceMenu = document.querySelector('.service-menu');

if (hamburger && nav) {
    const closeNavigation = function() {
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-active');
        if (serviceMenu) serviceMenu.open = false;
    };

    hamburger.addEventListener('click', function() {
        const expanded = hamburger.getAttribute('aria-expanded') !== 'true';
        hamburger.classList.toggle('is-active', expanded);
        hamburger.setAttribute('aria-expanded', String(expanded));
        nav.classList.toggle('is-active', expanded);
        if (!expanded && serviceMenu) serviceMenu.open = false;
    });

    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
            closeNavigation();
        }
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNavigation);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key !== 'Escape') return;
        if (serviceMenu && serviceMenu.open) {
            serviceMenu.open = false;
            serviceMenu.querySelector('summary').focus();
        } else if (nav.classList.contains('is-active')) {
            closeNavigation();
            hamburger.focus();
        }
    });

    if (serviceMenu) {
        serviceMenu.addEventListener('focusout', function(event) {
            if (!serviceMenu.contains(event.relatedTarget)) serviceMenu.open = false;
        });
    }

    window.matchMedia('(min-width: 960px)').addEventListener('change', closeNavigation);
}

// Native hash navigation preserves history and CSS handles header offset and motion.
// Move keyboard focus along with the visitor when following a local section link.
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function() {
        const target = document.getElementById(link.hash.slice(1));
        if (target && target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    });
});
