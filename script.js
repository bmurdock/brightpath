// Mobile hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('is-active');
        });
    }

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const btnCaption = submitBtn.querySelector('.btn-contact-caption');
            const loadingSpinner = submitBtn.querySelector('.lds-dual-ring');
            
            // Show loading state
            submitBtn.classList.add('is-loading');
            loadingSpinner.classList.add('is-active');
            btnCaption.style.opacity = '0';
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Reset loading state
                submitBtn.classList.remove('is-loading');
                loadingSpinner.classList.remove('is-active');
                btnCaption.style.opacity = '1';
                
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                
                // Reset form
                contactForm.reset();
            }, 2000);
        });
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

    // Add animation to FAQ items on scroll
    const faqItems = document.querySelectorAll('.faq-item');
    
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
    
    faqItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});