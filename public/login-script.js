document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const loginForm = document.getElementById('login-form');
    const notification = document.getElementById('notification');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    // --- Login Form Submission with Shake Validation ---
    if (loginForm && notification) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // --- **NEW** Validation Check ---
            const isEmailEmpty = emailInput.value.trim() === '';
            const isPasswordEmpty = passwordInput.value.trim() === '';

            // Reset previous errors
            notification.className = 'hidden';
            emailInput.classList.remove('error');
            passwordInput.classList.remove('error');

            if (isEmailEmpty || isPasswordEmpty) {
                loginForm.classList.add('shake');
                notification.textContent = 'Please fill in all required fields.';
                notification.className = 'block text-center p-3 mb-4 rounded-md text-sm bg-red-100 text-red-800';
                
                if (isEmailEmpty) emailInput.classList.add('error');
                if (isPasswordEmpty) passwordInput.classList.add('error');

                // Remove shake class after animation finishes
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
                return; // Stop the submission
            }

            // --- API Call Logic (if validation passes) ---
            submitButton.disabled = true;
            submitButton.textContent = 'Signing In...';

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value, password: passwordInput.value }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'An unknown error occurred.');
                
                localStorage.setItem('authToken', data.token);
                notification.textContent = 'Login successful! Redirecting...';
                notification.className = 'block text-center p-3 mb-4 rounded-md text-sm bg-green-100 text-green-800';
                setTimeout(() => { window.location.href = '/dashboard.html'; }, 1000);

            } catch (error) {
                notification.textContent = error.message;
                notification.className = 'block text-center p-3 mb-4 rounded-md text-sm bg-red-100 text-red-800';
                loginForm.classList.add('shake'); // Shake on server error too
                setTimeout(() => { loginForm.classList.remove('shake'); }, 500);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Sign In';
            }
        });

        // --- **NEW** Remove error highlight on input ---
        emailInput.addEventListener('input', () => emailInput.classList.remove('error'));
        passwordInput.addEventListener('input', () => passwordInput.classList.remove('error'));
    }

    // --- Static Image, Other UI Logic (No changes) ---
    const slideshowContainer = document.getElementById('slideshow-container');
    if (slideshowContainer) { const imageUrl = 'https://mkt.cdnpk.net/web-app/media/freepik-21-2000.webp'; const imgDiv = document.createElement('div'); imgDiv.className = 'slideshow-image'; imgDiv.style.backgroundImage = `url('${imageUrl}')`; slideshowContainer.appendChild(imgDiv); }
    const roleSelector = document.querySelector('.role-selector');
    if (roleSelector) { const highlight = roleSelector.querySelector('.highlight'); const handleRoleChange = () => { const checkedInput = roleSelector.querySelector('input[name="role"]:checked'); if (!checkedInput || !highlight) return; const targetLabel = checkedInput.parentElement; highlight.style.width = `${targetLabel.offsetWidth}px`; highlight.style.transform = `translateX(${targetLabel.offsetLeft}px)`; }; setTimeout(handleRoleChange, 50); roleSelector.addEventListener('change', handleRoleChange); window.addEventListener('resize', handleRoleChange); }
    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle && passwordInput) { const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`; const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`; passwordToggle.innerHTML = eyeOffIcon; passwordToggle.addEventListener('click', () => { const isPassword = passwordInput.type === 'password'; passwordInput.type = isPassword ? 'text' : 'password'; passwordToggle.innerHTML = isPassword ? eyeIcon : eyeOffIcon; }); }
    const modal = document.getElementById('forgot-password-modal');
    const openModalLink = document.getElementById('forgot-password-link');
    const closeModalButton = document.getElementById('close-modal-button');
    if (modal && openModalLink && closeModalButton) { openModalLink.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('visible'); }); closeModalButton.addEventListener('click', () => modal.classList.remove('visible')); modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('visible'); }); }
});
