
        // Load cart items from localStorage
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        function renderCart() {
            const cartContainer = document.getElementById('cart-items');
            cartContainer.innerHTML = '';
            cartItems.forEach((item, index) => {
                cartContainer.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p class="cart-item-category">${item.category}</p>
                            <div class="quantity-control">
                                <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                                <span class="quantity-display" id="quantity-${index}">${item.quantity}</span>
                                <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="cart-item-price" id="price-${index}">$${(item.price * item.quantity).toFixed(2)}</div>
                            <button class="remove-btn" onclick="removeItem(${index})">🗑️ Remove</button>
                        </div>
                    </div>
                `;
            });
        }

        function increaseQuantity(index) {
            cartItems[index].quantity++;
            document.getElementById(`quantity-${index}`).textContent = cartItems[index].quantity;
            updatePrice(index);
            updateSummary();
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }

        function decreaseQuantity(index) {
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
                document.getElementById(`quantity-${index}`).textContent = cartItems[index].quantity;
                updatePrice(index);
                updateSummary();
                localStorage.setItem('cart', JSON.stringify(cartItems));
            }
        }

        function updatePrice(index) {
            const totalPrice = (cartItems[index].price * cartItems[index].quantity).toFixed(2);
            document.getElementById(`price-${index}`).textContent = `$${totalPrice}`;
        }

        function removeItem(index) {
            cartItems.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
            updateSummary();
        }

        function updateSummary() {
            let subtotal = 0;
            cartItems.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        }

        function applyCoupon() {
            const code = document.getElementById('couponCode').value.toUpperCase();
            if (code === 'SAVE10') {
                alert('Coupon applied! 10% discount added.');
                const currentSubtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
                const discount = currentSubtotal * 0.1;
                document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
                updateSummary();
            } else {
                alert('Invalid coupon code!');
            }
        }

        function proceedToCheckout() {
            alert('Proceeding to secure checkout... (Checkout page will be created next)');
            window.location.href = 'checkout.html';
        }

        // Initialize
        renderCart();
        updateSummary();
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
