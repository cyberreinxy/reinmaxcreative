document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Security Check ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/public/login.html';
        return;
    }

    // --- 2. Element Selectors ---
    const userEmailEls = [document.getElementById('user-email'), document.getElementById('settings-email')];
    const userRoleEl = document.getElementById('user-role');
    const logoutButton = document.getElementById('logout-button');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('menu-button');

    // --- 3. Fetch and Populate User Data ---
    const fetchUserProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Session expired. Please log in again.');
            
            const user = await response.json();
            userEmailEls.forEach(el => el.textContent = user.email);
            userRoleEl.textContent = user.role;
        } catch (error) {
            localStorage.removeItem('authToken');
            alert(error.message);
            window.location.href = '/public/login.html';
        }
    };

    // --- 4. Navigation Logic (SPA-like behavior) ---
    const handleNavClick = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.dataset.target;

        // Update active link
        navLinks.forEach(link => link.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Show target content, hide others
        contentSections.forEach(section => {
            section.classList.toggle('hidden', section.id !== targetId);
        });
        
        // Close mobile sidebar on navigation
        if (window.innerWidth < 768) {
            sidebar.classList.add('-translate-x-full');
        }
    };

    navLinks.forEach(link => {
        if (link.id !== 'logout-button') {
            link.addEventListener('click', handleNavClick);
        }
    });

    // --- 5. Logout Functionality ---
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = '/public/login.html';
    });

    // --- 6. Mobile Menu Toggle ---
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });

    // --- 7. Initial Load ---
    fetchUserProfile();
});
