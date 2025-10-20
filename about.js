      // Simple account persistence using localStorage
        (function () {
            const ACCOUNT_KEY = 'user';

            function showAccountUI() {
                const user = JSON.parse(localStorage.getItem(ACCOUNT_KEY));
                const authArea = document.getElementById('auth-area');
                const accountArea = document.getElementById('account-area');
                const accountName = document.getElementById('account-name');
                if (!authArea || !accountArea || !accountName) return;
                if (user && user.name) {
                    authArea.style.display = 'none';
                    accountName.textContent = user.name;
                    accountArea.style.display = 'flex';
                } else {
                    authArea.style.display = 'flex';
                    accountArea.style.display = 'none';
                }
            }

            // Signup form: store name and email
            const signupForm = document.getElementById('signupForm');
            if (signupForm) {
                signupForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const nameInput = signupForm.querySelector('input[type="text"]');
                    const emailInput = signupForm.querySelector('input[type="email"]');
                    const name = (nameInput && nameInput.value.trim()) || 'User';
                    const email = (emailInput && emailInput.value.trim()) || '';
                    const user = { name: name, email: email };
                    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(user));
                    closeModal('signup');
                    showAccountUI();
                });
            }

            // Login form: simulate login by email
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const emailInput = loginForm.querySelector('input[type="email"]');
                    const email = (emailInput && emailInput.value.trim()) || '';
                    const name = email ? email.split('@')[0] : 'User';
                    const user = { name: name, email: email };
                    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(user));
                    closeModal('login');
                    showAccountUI();
                });
            }

            // Logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function () {
                    localStorage.removeItem(ACCOUNT_KEY);
                    showAccountUI();
                });
            }

            // Initialize
            document.addEventListener('DOMContentLoaded', showAccountUI);
        })();
    // Preloader Handler
    document.addEventListener('DOMContentLoaded', function() {
        const preloader = document.querySelector('.preloader');
        
        // Hide preloader after page loads
        window.addEventListener('load', function() {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });

        // Show preloader before page unload
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                // Only handle internal links
                if (this.href && this.href.startsWith(window.location.origin)) {
                    e.preventDefault();
                    preloader.style.display = 'flex';
                    preloader.classList.remove('fade-out');
                    setTimeout(() => {
                        window.location = this.href;
                    }, 500);
                }
            });
        });
    });