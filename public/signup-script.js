document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const signupForm = document.getElementById('signup-form');
    const notification = document.getElementById('notification');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const hasPaidCheckbox = document.getElementById('has-paid');
    const refNumberInput = document.getElementById('refNumber');
    const submitButton = signupForm.querySelector('button[type="submit"]');

    // --- Eye Toggle Logic ---
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
    
    const setupPasswordToggle = (inputId, toggleId) => {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (toggle && input) {
            toggle.innerHTML = eyeOffIcon;
            toggle.addEventListener('click', () => {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                toggle.innerHTML = isPassword ? eyeIcon : eyeOffIcon;
            });
        }
    };
    setupPasswordToggle('password', 'password-toggle');
    setupPasswordToggle('confirmPassword', 'confirm-password-toggle');

    // --- Conditional Field Logic ---
    hasPaidCheckbox.addEventListener('change', () => {
        refNumberInput.disabled = !hasPaidCheckbox.checked;
        if (!hasPaidCheckbox.checked) {
            refNumberInput.value = ''; // Clear the field when disabled
        }
    });

    // --- Form Submission with Validation ---
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const inputsToValidate = [fullNameInput, emailInput, passwordInput, confirmPasswordInput];
        let isValid = true;

        notification.className = 'hidden';
        inputsToValidate.forEach(input => input.classList.remove('error'));
        refNumberInput.classList.remove('error');

        inputsToValidate.forEach(input => {
            if (input.value.trim() === '') {
                input.classList.add('error');
                isValid = false;
            }
        });

        if (hasPaidCheckbox.checked && refNumberInput.value.trim() === '') {
            refNumberInput.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            notification.textContent = 'Please fill in all required fields.';
            notification.className = 'block text-center p-3 rounded-md text-sm bg-red-100 text-red-800';
            signupForm.classList.add('shake');
            setTimeout(() => signupForm.classList.remove('shake'), 500);
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            notification.textContent = 'Passwords do not match.';
            notification.className = 'block text-center p-3 rounded-md text-sm bg-red-100 text-red-800';
            passwordInput.classList.add('error');
            confirmPasswordInput.classList.add('error');
            signupForm.classList.add('shake');
            setTimeout(() => signupForm.classList.remove('shake'), 500);
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';

        const registrationData = {
            email: emailInput.value,
            password: passwordInput.value,
            role: 'user'
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An unknown error occurred.');

            localStorage.setItem('authToken', data.token);
            notification.textContent = 'Account created! Redirecting...';
            notification.className = 'block text-center p-3 rounded-md text-sm bg-green-100 text-green-800';
            setTimeout(() => { window.location.href = '/dashboard.html'; }, 1000);

        } catch (error) {
            notification.textContent = error.message;
            notification.className = 'block text-center p-3 rounded-md text-sm bg-red-100 text-red-800';
            signupForm.classList.add('shake');
            setTimeout(() => signupForm.classList.remove('shake'), 500);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';
        }
    });

    const allInputs = [fullNameInput, emailInput, passwordInput, confirmPasswordInput, refNumberInput];
    allInputs.forEach(input => {
        input.addEventListener('input', () => input.classList.remove('error'));
    });
});
