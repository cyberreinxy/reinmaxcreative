/**
 * signup-script.js
 * Handles all client-side interactivity for the Reinmax Creative signup page.
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
     * Role Selector Animation
     */
    const roleSelector = document.querySelector('.role-selector');
    if (roleSelector) {
        const highlight = roleSelector.querySelector('.highlight');
        const setHighlightProperties = () => {
            const checkedInput = roleSelector.querySelector('input[name="role"]:checked');
            if (!checkedInput || !highlight) return;
            const targetLabel = checkedInput.parentElement;
            highlight.style.width = `${targetLabel.offsetWidth}px`;
            highlight.style.transform = `translateX(${targetLabel.offsetLeft}px)`;
        };
        setTimeout(setHighlightProperties, 50);
        roleSelector.addEventListener('change', setHighlightProperties);
        window.addEventListener('resize', setHighlightProperties);
    }

    /**
     * Password Visibility Toggle Functionality
     */
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;

    const setupPasswordToggle = (inputId, toggleId) => {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (toggle && input) {
            toggle.innerHTML = eyeOffIcon;
            toggle.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggle.innerHTML = eyeIcon;
                } else {
                    input.type = 'password';
                    toggle.innerHTML = eyeOffIcon;
                }
            });
        }
    };
    
    setupPasswordToggle('password', 'password-toggle');
    setupPasswordToggle('confirmPassword', 'confirm-password-toggle');


    /**
     * Form Validation & Conditional Field Logic
     */
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordErrorMsg = document.getElementById('password-error');
        const instructorRefContainer = document.getElementById('instructor-ref-container');
        const refNumberInput = document.getElementById('refNumber');

        const handleRoleChange = () => {
            const selectedRole = signupForm.querySelector('input[name="role"]:checked').value;
            if (selectedRole === 'admin') {
                instructorRefContainer.classList.add('visible');
                refNumberInput.setAttribute('required', 'true');
            } else {
                instructorRefContainer.classList.remove('visible');
                refNumberInput.removeAttribute('required');
                refNumberInput.value = '';
            }
        };

        const validatePasswords = () => {
            const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
            passwordErrorMsg.classList.toggle('hidden', passwordsMatch);
            confirmPasswordInput.classList.toggle('input-error', !passwordsMatch);
            return passwordsMatch;
        };

        if (passwordInput && confirmPasswordInput) {
            passwordInput.addEventListener('keyup', validatePasswords);
            confirmPasswordInput.addEventListener('keyup', validatePasswords);
        }
        if (roleSelector && instructorRefContainer) {
            roleSelector.addEventListener('change', handleRoleChange);
            handleRoleChange();
        }

        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!validatePasswords()) {
                console.error('Signup failed: Passwords do not match.');
                confirmPasswordInput.focus();
                return;
            }
            const formData = new FormData(signupForm);
            console.log('Form is valid. Submitting...');
            for (let [key, value] of formData.entries()) {
                console.log(`- ${key}: ${value}`);
            }
            // TODO: Integrate Firebase or other backend logic here.
        });
    }
});
