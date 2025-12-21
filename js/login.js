// Login Page JavaScript

let dbReady = false;

// Initialize database when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await EliteFitDB.init();
        dbReady = true;
        console.log('Database initialized successfully');
        
        // Load registered users count
        loadRegisteredUsersCount();
        
        // Clean expired sessions
        EliteFitDB.cleanExpiredSessions();
        
    } catch (error) {
        console.error('Database initialization failed:', error);
        alert('Database initialization failed. Some features may not work properly.');
    }

    const loginForm = document.getElementById('loginForm');
    
    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!dbReady) {
                alert('Database not ready. Please wait and try again.');
                return;
            }
            
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
            
            // Show loading state
            const loginBtn = document.querySelector('.login-btn');
            const originalText = loginBtn.innerHTML;
            
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            loginBtn.disabled = true;
            
            try {
                // Authenticate user
                const result = await EliteFitDB.authenticateUser(email, password);
                
                if (result.success) {
                    // Create session
                    const sessionResult = await EliteFitDB.createSession(result.user.id);
                    
                    if (sessionResult.success) {
                        // Store user data
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userEmail', result.user.email);
                        localStorage.setItem('userName', result.user.fullName);
                        localStorage.setItem('userId', result.user.id);
                        localStorage.setItem('membershipType', result.user.membershipType);
                        
                        alert(`Login successful! Welcome back, ${result.user.fullName}!`);
                        
                        // Redirect to home page
                        window.location.href = 'home.html';
                    } else {
                        throw new Error('Session creation failed');
                    }
                } else {
                    alert(result.message || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            } finally {
                // Reset button
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
            }
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google login integration would be implemented here with OAuth 2.0');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            alert('Facebook login integration would be implemented here with Facebook SDK');
        });
    }
    
    // Show/Hide registered users functionality
    const showUsersBtn = document.getElementById('showUsersBtn');
    const registeredUsersSection = document.getElementById('registeredUsersSection');
    
    if (showUsersBtn && registeredUsersSection) {
        showUsersBtn.addEventListener('click', async function() {
            const isVisible = registeredUsersSection.style.display !== 'none';
            
            if (isVisible) {
                registeredUsersSection.style.display = 'none';
                this.innerHTML = '<i class="fas fa-users"></i> Show Registered Users';
            } else {
                await displayRegisteredUsers();
                registeredUsersSection.style.display = 'block';
                this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Registered Users';
            }
        });
    }
});

// Display registered users
async function displayRegisteredUsers() {
    if (!dbReady) return;
    
    const usersList = document.getElementById('usersList');
    
    try {
        const users = await EliteFitDB.getAllUsers();
        
        if (users.length === 0) {
            usersList.innerHTML = '<p style="margin: 0; font-size: 0.85rem; color: #666; text-align: center;">No registered users yet. <a href="signup.html" style="color: var(--primary);">Sign up</a> to create an account!</p>';
            return;
        }
        
        usersList.innerHTML = users.map(user => `
            <div class="user-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; margin-bottom: 0.5rem; background: white; border-radius: 6px; cursor: pointer; border: 1px solid #e0e0e0; transition: all 0.2s ease;" 
                 onclick="fillUserCredentials('${user.email}', '${user.fullName}', '${user.membershipType}')"
                 onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'; this.style.transform='translateY(-1px)'"
                 onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
                <div>
                    <strong style="font-size: 0.9rem; color: var(--primary);">${user.fullName}</strong>
                    <div style="font-size: 0.75rem; color: #666; margin-top: 2px;">${user.email}</div>
                    <div style="font-size: 0.7rem; color: #999; margin-top: 2px;">
                        <i class="fas fa-crown" style="color: #ffd700;"></i> ${user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)} Member
                        ${user.lastLogin ? `• Last login: ${new Date(user.lastLogin).toLocaleDateString()}` : '• Never logged in'}
                    </div>
                </div>
                <div style="font-size: 0.7rem; color: #999; text-align: right;">
                    <i class="fas fa-mouse-pointer"></i><br>
                    <span>Click to login</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        usersList.innerHTML = '<p style="margin: 0; font-size: 0.85rem; color: #dc3545; text-align: center;">Error loading users. Please try again.</p>';
    }
}

// Fill user credentials (only email, password is hashed)
window.fillUserCredentials = function(email, fullName, membershipType) {
    document.getElementById('email').value = email;
    document.getElementById('password').focus();
    
    // Visual feedback
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        if (item.textContent.includes(email)) {
            item.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
            item.style.borderColor = '#28a745';
            item.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                item.style.background = 'white';
                item.style.borderColor = '#e0e0e0';
                item.style.transform = 'scale(1)';
            }, 2000);
        }
    });
    
    // Show success message
    const tempMsg = document.createElement('div');
    tempMsg.style.cssText = `
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
        color: white; 
        padding: 12px 20px; 
        border-radius: 8px; 
        z-index: 9999; 
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        animation: slideIn 0.3s ease;
    `;
    tempMsg.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        Email filled for <strong>${fullName}</strong><br>
        <small>Please enter your password</small>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(tempMsg);
    
    setTimeout(() => {
        if (document.body.contains(tempMsg)) {
            tempMsg.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => document.body.removeChild(tempMsg), 300);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 3000);
};

// Load registered users count
async function loadRegisteredUsersCount() {
    if (!dbReady) return;
    
    try {
        const users = await EliteFitDB.getAllUsers();
        const showUsersBtn = document.getElementById('showUsersBtn');
        if (showUsersBtn && users.length > 0) {
            showUsersBtn.innerHTML = `<i class="fas fa-users"></i> Show Registered Users (${users.length})`;
        }
    } catch (error) {
        console.error('Error loading user count:', error);
    }
}

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