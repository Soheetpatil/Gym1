// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate login process
            const loginBtn = document.querySelector('.login-btn');
            const originalText = loginBtn.innerHTML;
            
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            loginBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // In a real app, you would send this to your server
                console.log('Login attempt:', { email, password, remember });
                
                // Simulate successful login
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                alert('Login successful! Welcome to EliteFit Gym!');
                
                // Reset button
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
                
                // Redirect to home page
                window.location.href = 'home.html';
            }, 2000);
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google login would be implemented here');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            alert('Facebook login would be implemented here');
        });
    }
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Demo credentials helper
document.addEventListener('DOMContentLoaded', function() {
    // Add demo credentials info
    const loginBody = document.querySelector('.login-body');
    if (loginBody) {
        const demoInfo = document.createElement('div');
        demoInfo.style.cssText = `
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            text-align: center;
        `;
        demoInfo.innerHTML = `
            <strong>Demo Credentials:</strong><br>
            Email: demo@elitefitgym.com<br>
            Password: demo123
        `;
        
        const form = document.getElementById('loginForm');
        form.parentNode.insertBefore(demoInfo, form);
    }
});