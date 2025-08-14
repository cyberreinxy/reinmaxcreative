document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.toggle('open');
        const headerHeight = header.offsetHeight;
        mobileMenu.style.top = `${headerHeight}px`;
        mobileMenu.style.height = `calc(100vh - ${headerHeight}px)`;
        
        document.body.classList.toggle('overflow-hidden');
        menuOverlay.classList.toggle('hidden', !isOpen);
    }

    mobileMenuButton.addEventListener('click', toggleMenu);

    // --- CORRECTED MOBILE MENU LINK HANDLING ---
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if the link is an on-page anchor link (starts with #)
            if (href && href.startsWith('#')) {
                // If it is, prevent the default jump and scroll smoothly
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
            // For any other link (like "login.html"), the default browser action will proceed.

            // Close the menu after any link is clicked
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
    
    menuOverlay.addEventListener('click', toggleMenu);

    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const contactSection = document.getElementById('contact');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                whatsappBtn.classList.add('visible');
            } else {
                whatsappBtn.classList.remove('visible');
            }
        });
    }, { threshold: 0.5 });

    if(contactSection) {
        contactObserver.observe(contactSection);
    }

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 70) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
