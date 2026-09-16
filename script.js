// Mobile hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
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

        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                closeNavigation();
            }
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNavigation);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key !== 'Escape') return;
            if (serviceMenu && serviceMenu.open) {
                serviceMenu.open = false;
                serviceMenu.querySelector('summary').focus();
            } else if (nav.classList.contains('is-active')) {
                closeNavigation();
                hamburger.focus();
            }
        });

        if (serviceMenu) {
            serviceMenu.addEventListener('focusout', function(e) {
                if (!serviceMenu.contains(e.relatedTarget)) serviceMenu.open = false;
            });
        }

        window.matchMedia('(min-width: 1200px)').addEventListener('change', closeNavigation);
    }

    // Smooth scrolling for phone links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow default phone call behavior
            // This is just for any additional tracking or analytics
            console.log('Phone link clicked:', this.href);
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - could add hide header logic here if needed
        } else {
            // Scrolling up - could add show header logic here if needed
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to various elements on scroll
    const animatedElements = document.querySelectorAll(
        '.faq-item, .service-card, .benefit-card, .testimonial-card, .gallery-item, .faq-item-service'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Gallery image lazy loading and hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });

    // Service cards hover tracking
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add scroll-to-top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #01497b;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(1, 73, 123, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Enhanced testimonial interactions
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const stars = this.querySelectorAll('.star');
            stars.forEach((star, index) => {
                setTimeout(() => {
                    star.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        star.style.transform = 'scale(1)';
                    }, 150);
                }, index * 100);
            });
        });
    });
});