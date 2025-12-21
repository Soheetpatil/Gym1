// Signup Page JavaScript

let dbReady = false;

// Initialize database when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await EliteFitDB.init();
        dbReady = true;
        console.log('Database initialized for signup');
    } catch (error) {
        console.error('Database initialization failed:', error);
        alert('Database initialization failed. Registration may not work properly.');
    }

    const signupForm = document.getElementById('signupForm');
    
    // Handle form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!dbReady) {
                alert('Database not ready. Please wait and try again.');
                return;
            }
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            if (!fullName || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (fullName.length < 2) {
                alert('Full name must be at least 2 characters long');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!terms) {
                alert('Please accept the Terms & Conditions');
                return;
            }
            
            // Show loading state
            const signupBtn = document.querySelector('.login-btn');
            const originalText = signupBtn.innerHTML;
            
            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            signupBtn.disabled = true;
            
            try {
                // Register user
                const result = await EliteFitDB.registerUser({
                    fullName: fullName.trim(),
                    email: email.trim(),
                    password: password
                });
                
                if (result.success) {
                    alert(`Account created successfully for ${fullName}! You can now login with your credentials.`);
                    
                    // Redirect to login page
                    window.location.href = 'login.html';
                } else {
                    alert(result.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                if (error.message && error.message.includes('Email already exists')) {
                    alert('This email is already registered. Please use a different email or login with your existing account.');
                } else {
                    alert('Registration failed. Please try again.');
                }
            } finally {
                // Reset button
                signupBtn.innerHTML = originalText;
                signupBtn.disabled = false;
            }
        });
    }
    
    // Social signup buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google signup integration would be implemented here with OAuth 2.0');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            alert('Facebook signup integration would be implemented here with Facebook SDK');
        });
    }
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = getPasswordStrength(password);
            showPasswordStrength(strength);
        });
    }
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', async function() {
            const email = this.value.trim();
            if (email && isValidEmail(email) && dbReady) {
                // Check if email already exists
                try {
                    const users = await EliteFitDB.getAllUsers();
                    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                    
                    if (existingUser) {
                        this.style.borderColor = '#dc3545';
                        showEmailError('This email is already registered');
                    } else {
                        this.style.borderColor = '#28a745';
                        hideEmailError();
                    }
                } catch (error) {
                    console.error('Email check failed:', error);
                }
            }
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

// Password strength checker
function getPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

function showPasswordStrength(strength) {
    // Remove existing strength indicator
    const existingIndicator = document.querySelector('.password-strength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const passwordGroup = document.getElementById('password').closest('.form-group');
    const indicator = document.createElement('div');
    indicator.className = 'password-strength';
    indicator.style.cssText = `
        margin-top: 0.5rem;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    let strengthText = '';
    let strengthColor = '';
    
    if (strength < 3) {
        strengthText = 'Weak';
        strengthColor = '#dc3545';
    } else if (strength < 5) {
        strengthText = 'Medium';
        strengthColor = '#ffc107';
    } else {
        strengthText = 'Strong';
        strengthColor = '#28a745';
    }
    
    indicator.innerHTML = `
        <div style="flex: 1; height: 4px; background: #e1e5e9; border-radius: 2px; overflow: hidden;">
            <div style="width: ${(strength / 6) * 100}%; height: 100%; background: ${strengthColor}; transition: all 0.3s ease;"></div>
        </div>
        <span style="color: ${strengthColor}; font-weight: 500;">${strengthText}</span>
    `;
    
    passwordGroup.appendChild(indicator);
}

// Show email error
function showEmailError(message) {
    hideEmailError(); // Remove existing error
    
    const emailInput = document.getElementById('email');
    const errorDiv = document.createElement('div');
    errorDiv.id = 'email-error';
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    emailInput.parentNode.appendChild(errorDiv);
}

// Hide email error
function hideEmailError() {
    const existingError = document.getElementById('email-error');
    if (existingError) {
        existingError.remove();
    }
}