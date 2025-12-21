// Signup Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    // Handle form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            
            // Simulate signup process
            const signupBtn = document.querySelector('.login-btn');
            const originalText = signupBtn.innerHTML;
            
            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            signupBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Store user credentials in localStorage (in real app, send to server)
                const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                
                // Check if email already exists
                const existingUser = storedUsers.find(u => u.email === email);
                if (existingUser) {
                    alert('Email already registered. Please use a different email or login with existing account.');
                    signupBtn.innerHTML = originalText;
                    signupBtn.disabled = false;
                    return;
                }
                
                // Add new user
                const newUser = {
                    fullName,
                    email,
                    password,
                    registrationDate: new Date().toISOString()
                };
                
                storedUsers.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
                
                console.log('Signup successful:', { fullName, email });
                
                // Simulate successful signup
                alert(`Account created successfully for ${fullName}! You can now login with your credentials.`);
                
                // Reset button
                signupBtn.innerHTML = originalText;
                signupBtn.disabled = false;
                
                // Redirect to login page
                window.location.href = 'login.html';
            }, 2000);
        });
    }
    
    // Social signup buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google signup would be implemented here');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            alert('Facebook signup would be implemented here');
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