/**
 * login-script.js
 * Handles all client-side interactivity for the Reinmax Creative login page.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Mobile Menu Functionality
     */
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (mobileMenuButton && mobileMenu && menuOverlay) {
        const toggleMenu = () => {
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('hidden');
        };
        mobileMenuButton.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);
    }

    /**
     * Role Selector Animation & Background Effect
     */
    const roleSelector = document.querySelector('.role-selector');
    const loginSection = document.getElementById('login'); // Get the main section for the effect

    if (roleSelector && loginSection) {
        const highlight = roleSelector.querySelector('.highlight');

        // This single function handles both the highlight position and the background zoom
        const handleRoleChange = () => {
            const checkedInput = roleSelector.querySelector('input[name="role"]:checked');
            if (!checkedInput || !highlight) return;
            
            // 1. Update highlight position
            const targetLabel = checkedInput.parentElement;
            highlight.style.width = `${targetLabel.offsetWidth}px`;
            highlight.style.transform = `translateX(${targetLabel.offsetLeft}px)`;

            // 2. Update background zoom effect
            if (checkedInput.value === 'admin') {
                loginSection.classList.add('instructor-view');
            } else {
                loginSection.classList.remove('instructor-view');
            }
        };

        // Set initial state on load and add event listeners
        setTimeout(handleRoleChange, 50);
        roleSelector.addEventListener('change', handleRoleChange);
        window.addEventListener('resize', handleRoleChange); // Recalculates highlight on resize
    }

    /**
     * Password Visibility Toggle
     */
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    if (passwordToggle && passwordInput) {
        const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
        
        passwordToggle.innerHTML = eyeOffIcon; // Start with password hidden

        passwordToggle.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.innerHTML = eyeIcon;
            } else {
                passwordInput.type = 'password';
                passwordToggle.innerHTML = eyeOffIcon;
            }
        });
    }

    /**
     * Login Form Submission
     */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const role = formData.get('role');
            const email = formData.get('email');
            
            console.log('Attempting to sign in...');
            console.log(`- Role: ${role}`);
            console.log(`- Email: ${email}`);
            
            // TODO: Add Firebase authentication logic here.
        });
    }

    /**
     * Forgot Password Modal Functionality
     */
    const modal = document.getElementById('forgot-password-modal');
    const openModalLink = document.getElementById('forgot-password-link');
    const closeModalButton = document.getElementById('close-modal-button');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    if (modal && openModalLink && closeModalButton && forgotPasswordForm) {
        const openModal = (event) => {
            event.preventDefault();
            modal.classList.add('visible');
        };
        const closeModal = () => {
            modal.classList.remove('visible');
        };

        openModalLink.addEventListener('click', openModal);
        closeModalButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });

        forgotPasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const resetEmail = document.getElementById('reset-email').value;
            console.log(`Password reset requested for: ${resetEmail}`);
            // TODO: Add Firebase password reset logic here.
            alert('If an account exists for that email, a reset link has been sent.');
            closeModal();
        });
    }
});
