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
                
                // Check stored user credentials first
                const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const user = storedUsers.find(u => u.email === email && u.password === password);
                
                // Check demo credentials or registered user
                if ((email === 'demo@elitefitgym.com' && password === 'demo123') || user) {
                    // Simulate successful login
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userName', user ? user.fullName : 'Demo User');
                    
                    alert(`Login successful! Welcome ${user ? user.fullName : 'Demo User'}!`);
                    
                    // Reset button
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                    
                    // Redirect to home page
                    window.location.href = 'home.html';
                } else {
                    // Login failed
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                    
                    alert('Invalid email or password. Please try again or sign up for a new account.');
                }
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
            <strong><i class="fas fa-info-circle"></i> Demo Login Credentials:</strong><br>
            <div style="margin-top: 0.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left;">
                <div>
                    <strong>Email:</strong><br>
                    <code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85rem;">demo@elitefitgym.com</code>
                </div>
                <div>
                    <strong>Password:</strong><br>
                    <code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85rem;">demo123</code>
                </div>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.8;">
                <i class="fas fa-mouse-pointer"></i> Click to auto-fill credentials
            </div>
        `;
        
        const form = document.getElementById('loginForm');
        form.parentNode.insertBefore(demoInfo, form);
    }
});
        
        // Add click functionality to auto-fill demo credentials
        demoInfo.style.cursor = 'pointer';
        demoInfo.addEventListener('click', function() {
            document.getElementById('email').value = 'demo@elitefitgym.com';
            document.getElementById('password').value = 'demo123';
            
            // Add visual feedback
            demoInfo.style.background = '#d4edda';
            demoInfo.style.borderColor = '#c3e6cb';
            
            setTimeout(() => {
                demoInfo.style.background = '#e7f3ff';
                demoInfo.style.borderColor = '#b3d9ff';
            }, 1000);
        });
    // Auto-fill button functionality
    const autoFillBtn = document.getElementById('autoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', function() {
            document.getElementById('email').value = 'demo@elitefitgym.com';
            document.getElementById('password').value = 'demo123';
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i> Filled!';
            this.style.background = '#218838';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-magic"></i> Auto Fill';
                this.style.background = '#28a745';
            }, 2000);
            
            // Focus on login button
            document.querySelector('.login-btn').focus();
        });
    }
    
    // Show/Hide registered users functionality
    const showUsersBtn = document.getElementById('showUsersBtn');
    const registeredUsersSection = document.getElementById('registeredUsersSection');
    const usersList = document.getElementById('usersList');
    
    if (showUsersBtn && registeredUsersSection) {
        showUsersBtn.addEventListener('click', function() {
            const isVisible = registeredUsersSection.style.display !== 'none';
            
            if (isVisible) {
                registeredUsersSection.style.display = 'none';
                this.innerHTML = '<i class="fas fa-users"></i> Show Registered Users';
            } else {
                displayRegisteredUsers();
                registeredUsersSection.style.display = 'block';
                this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Registered Users';
            }
        });
    }
    
    function displayRegisteredUsers() {
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        if (storedUsers.length === 0) {
            usersList.innerHTML = '<p style="margin: 0; font-size: 0.85rem; color: #666; text-align: center;">No registered users yet. <a href="signup.html" style="color: var(--primary);">Sign up</a> to create an account!</p>';
            return;
        }
        
        usersList.innerHTML = storedUsers.map(user => `
            <div class="user-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; margin-bottom: 0.5rem; background: white; border-radius: 4px; cursor: pointer; border: 1px solid #e0e0e0;" 
                 onclick="fillUserCredentials('${user.email}', '${user.password}', '${user.fullName}')">
                <div>
                    <strong style="font-size: 0.85rem;">${user.fullName}</strong><br>
                    <small style="color: #666; font-size: 0.75rem;">${user.email}</small>
                </div>
                <div style="font-size: 0.7rem; color: #999;">
                    <i class="fas fa-mouse-pointer"></i> Click to login
                </div>
            </div>
        `).join('');
    }
    
    // Global function to fill user credentials
    window.fillUserCredentials = function(email, password, fullName) {
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        
        // Visual feedback
        const userItems = document.querySelectorAll('.user-item');
        userItems.forEach(item => {
            if (item.textContent.includes(email)) {
                item.style.background = '#d4edda';
                item.style.borderColor = '#c3e6cb';
                
                setTimeout(() => {
                    item.style.background = 'white';
                    item.style.borderColor = '#e0e0e0';
                }, 1500);
            }
        });
        
        // Show success message
        const tempMsg = document.createElement('div');
        tempMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999; font-size: 0.9rem;';
        tempMsg.innerHTML = `<i class="fas fa-check"></i> Credentials filled for ${fullName}`;
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            document.body.removeChild(tempMsg);
        }, 2000);
        
        // Focus on login button
        document.querySelector('.login-btn').focus();
    };
    
    // Load registered users count on page load
    document.addEventListener('DOMContentLoaded', function() {
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (storedUsers.length > 0 && showUsersBtn) {
            showUsersBtn.innerHTML = `<i class="fas fa-users"></i> Show Registered Users (${storedUsers.length})`;
        }
    });