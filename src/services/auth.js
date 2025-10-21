class AuthService {
    static #AUTH_TOKEN_KEY = 'auth_token';
    static #USER_KEY = 'user_data';
    static #API_URL = '/api/auth'; // Replace with your actual API URL if different

    static async login(email, password) {
        try {
            const response = await fetch(`${this.#API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem(this.#AUTH_TOKEN_KEY, data.token);
                localStorage.setItem(this.#USER_KEY, JSON.stringify(data.user));
                return data;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            throw error;
        }
    }

    static async signupUser(userData) {
        try {
            // For testing purposes, simulate API call
            const response = await fetch(`${this.#API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (response.ok) {
                // Don't automatically log in after signup
                // Wait for email verification if implemented
                return data;
            } else {
                throw new Error(data.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            // For development: handle network errors gracefully
            if (!error.message.includes('failed')) {
                throw new Error('Network error. Please try again later.');
            }
            throw error;
        }
    }

    static isAuthenticated() {
        return !!localStorage.getItem(this.#AUTH_TOKEN_KEY);
    }

    static getToken() {
        return localStorage.getItem(this.#AUTH_TOKEN_KEY);
    }

    static getUser() {
        const userData = localStorage.getItem(this.#USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    static logout() {
        localStorage.removeItem(this.#AUTH_TOKEN_KEY);
        localStorage.removeItem(this.#USER_KEY);
        window.location.href = '/';
    }
}

// For development/testing purposes
if (typeof window !== 'undefined') {
    window.AuthService = AuthService;
}

export default AuthService;