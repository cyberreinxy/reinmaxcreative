/**
 * selection-script.js
 * Handles client-side interactivity for the course selection page.
 * This script is standardized with the login/signup pages.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Mobile Menu Functionality
     */
    const header = document.querySelector('header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (header && mobileMenuButton && mobileMenu && menuOverlay) {
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.toggle('active');
            
            // Calculate header height to position menu directly below it
            const headerHeight = header.offsetHeight;
            mobileMenu.style.top = `${headerHeight}px`;
            mobileMenu.style.height = `calc(100vh - ${headerHeight}px)`;

            // Prevent body scroll when menu is open
            document.body.classList.toggle('overflow-hidden', isOpen);
            menuOverlay.classList.toggle('hidden', !isOpen);
        };
        
        mobileMenuButton.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);
    }
});