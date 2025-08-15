document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.toggle('open');
        const headerHeight = header.offsetHeight;
        mobileMenu.style.top = `0px`; // Position from the top
        mobileMenu.style.height = `100vh`;
        
        document.body.classList.toggle('overflow-hidden');
        menuOverlay.classList.toggle('hidden', !isOpen);
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }

    // --- MOBILE MENU LINK HANDLING ---
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if the link is an on-page anchor link
            if (href && href.startsWith('#')) {
                e.preventDefault();
                // Since this page has no sections to scroll to, we just close the menu
                if (mobileMenu.classList.contains('open')) {
                    toggleMenu();
                }
            }
            // For external links (like login.html), the default action proceeds.
        });
    });
});
