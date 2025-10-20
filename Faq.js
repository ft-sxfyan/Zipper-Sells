  // Slider functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const totalSlides = slides.length;

        function showSlide(index) {
            if (index < 0 || index >= totalSlides) return;
            
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.style.transform = 'translateX(0)';
                    slide.style.opacity = '1';
                    slide.style.zIndex = '1';
                } else {
                    const offset = i < index ? -100 : 100;
                    slide.style.transform = `translateX(${offset}%)`;
                    slide.style.opacity = '0';
                    slide.style.zIndex = '0';
                }
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(prevIndex);
        }

        function goToSlide(index) {
            showSlide(index);
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Set initial positions
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${i * 100}%)`;
            });
            showSlide(0);
            // Auto-advance every 5 seconds
            setInterval(nextSlide, 5000);
        });

        // Filter functionality
        function filterCategory(element, category) {
            const items = document.querySelectorAll('.product-card');
            const allCategories = document.querySelectorAll('.category-item');

            allCategories.forEach(item => {
                item.classList.remove('active');
            });
            element.classList.add('active');

            items.forEach(item => {
                if (category === 'all' || item.classList.contains(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Modal functionality
        function openModal(modalId) {
            const modal = document.getElementById(modalId + 'Modal');
            modal.classList.add('active');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId + 'Modal');
            modal.classList.remove('active');
        }

        // Add to Cart functionality (mock)
        function addToCart(productName, price) {
            alert(`Added ${productName} - $${price} to cart!`);
        }

        function removeFromCart(gameName) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.name !== gameName);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
        // Example usage for Remove button:
        // <button onclick="removeFromCart('Game Name')">Remove</button>

        function addToCart(gameName, price) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Check if game already exists in cart
            const existing = cart.find(item => item.name === gameName);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name: gameName, price: price, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
        }

        function updateCartBadge() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const badge = document.querySelector('.cart-badge');
            if (badge) {
                badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
                badge.classList.add('cart-badge-pop');
                setTimeout(() => badge.classList.remove('cart-badge-pop'), 400);
            }
        }

        function addToWishlist(gameName, price, image, category) {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const existing = wishlist.find(item => item.name === gameName);
            if (!existing) {
                wishlist.push({ name: gameName, price: price, image: image, category: category });
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                updateWishlistBadge();
            }
        }

        function removeFromWishlist(gameName) {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            wishlist = wishlist.filter(item => item.name !== gameName);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistBadge();
            // Optionally, update UI or reload if you have a wishlist section on this page
        }

        function updateWishlistBadge() {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const badge = document.querySelector('.wishlist-badge');
            if (badge) {
                badge.textContent = wishlist.length;
                badge.classList.add('cart-badge-pop');
                setTimeout(() => badge.classList.remove('cart-badge-pop'), 400);
            }
        }

        window.onload = function() {
            updateCartBadge();
            updateWishlistBadge();
        };
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
