// Authentication handling functions
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const remember = form.remember.checked;

    // Reset error messages
    clearErrors();

    // Validate inputs
    let isValid = true;
    if (!validateEmail(email)) {
        showError('loginEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    if (!validatePassword(password)) {
        showError('loginPasswordError', 'Password must be at least 8 characters');
        isValid = false;
    }

    if (isValid) {
        AuthService.login(email, password)
            .then(response => {
                if (remember) {
                    // Set remember me cookie
                    document.cookie = `remember_token=${response.token}; max-age=2592000`; // 30 days
                }
                window.location.reload();
            })
            .catch(error => {
                showError('loginEmailError', error.message);
            });
    }
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 8;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
}

function clearErrors() {
    const errorElements = document.getElementsByClassName('error-message');
    Array.from(errorElements).forEach(element => {
        element.textContent = '';
        element.classList.remove('visible');
    });
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

function socialLogin(provider) {
    // Implement social login logic here
    console.log(`Social login with ${provider}`);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check for authentication status
    if (AuthService.isAuthenticated()) {
        updateUIForAuthenticatedUser();
    }
});
// Add these functions to your existing auth.js file

function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    
    // Reset previous errors
    clearErrors();
    
    // Validate form fields
    const validationResults = validateSignupForm(form);
    
    if (validationResults.isValid) {
        // Prepare user data
        const userData = {
            fullName: form.fullName.value,
            username: form.username.value,
            email: form.email.value,
            password: form.password.value,
            newsletter: form.newsletter.checked
        };
        
        // Call signup service
        signupUser(userData)
            .then(response => {
                // Show success message
                showSuccessModal('Account created successfully! Please check your email for verification.');
                // Close signup modal
                closeModal('signup');
                // Optional: Auto-login user
                return AuthService.login(userData.email, userData.password);
            })
            .then(() => {
                window.location.reload();
            })
            .catch(error => {
                showError('emailError', error.message);
            });
    }
}

function validateSignupForm(form) {
    let isValid = true;
    const errors = {};

    // Validate full name
    if (form.fullName.value.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters long';
        isValid = false;
    }

    // Validate username
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(form.username.value)) {
        errors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
        isValid = false;
    }

    // Validate email
    if (!validateEmail(form.email.value)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Validate password
    const passwordStrength = checkPasswordStrength(form.password.value);
    if (passwordStrength === 'weak') {
        errors.password = 'Password is too weak. Please include at least 8 characters with numbers and special characters';
        isValid = false;
    }

    // Validate password confirmation
    if (form.password.value !== form.confirmPassword.value) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
    }

    // Show errors if any
    Object.keys(errors).forEach(field => {
        showError(`${field}Error`, errors[field]);
    });

    return { isValid, errors };
}

function checkPasswordStrength(password) {
    const strengthDiv = document.getElementById('passwordStrength');
    
    // Remove previous strength classes
    strengthDiv.classList.remove('weak', 'medium', 'strong');
    
    if (password.length < 8) {
        strengthDiv.classList.add('weak');
        return 'weak';
    }
    
    let strength = 0;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;
    
    if (strength < 3) {
        strengthDiv.classList.add('weak');
        return 'weak';
    } else if (strength === 3) {
        strengthDiv.classList.add('medium');
        return 'medium';
    } else {
        strengthDiv.classList.add('strong');
        return 'strong';
    }
}

function showSuccessModal(message) {
    // Create and show a success modal
    const modal = document.createElement('div');
    modal.className = 'modal success-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>✅ Success!</h2>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="this.closest('.modal').remove()">OK</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function socialSignup(provider) {
    // Implement social signup logic here
    console.log(`Social signup with ${provider}`);
    // You would typically redirect to your OAuth provider here
}

// Add event listener for password strength checking
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            checkPasswordStrength(passwordInput.value);
        });
    }
});
