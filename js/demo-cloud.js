// Demo Cross-Device Login System
// Uses localStorage with sync simulation for demonstration

class DemoCloudDB {
    constructor() {
        this.storageKey = 'eliteFitCloudUsers';
        this.syncKey = 'eliteFitLastSync';
        this.isDemo = true;
    }

    async init() {
        console.log('🌐 Demo Cloud Database initialized');
        console.log('📱 This simulates cross-device login using localStorage');
        
        // Initialize demo data if none exists
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
            localStorage.setItem(this.syncKey, new Date().toISOString());
        }
        
        return true;
    }

    // Hash password for security
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'EliteFitDemoSalt2023');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Get users from "cloud" (localStorage)
    getCloudUsers() {
        try {
            const users = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            return users;
        } catch (error) {
            console.error('Error reading cloud users:', error);
            return [];
        }
    }

    // Save users to "cloud" (localStorage)
    saveCloudUsers(users) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(users));
            localStorage.setItem(this.syncKey, new Date().toISOString());
            console.log('💾 Data synced to "cloud" (localStorage)');
            return true;
        } catch (error) {
            console.error('Error saving to cloud:', error);
            return false;
        }
    }

    // Register new user
    async registerUser(userData) {
        try {
            const hashedPassword = await this.hashPassword(userData.password);
            
            const newUser = {
                id: Date.now(),
                fullName: userData.fullName,
                email: userData.email.toLowerCase(),
                password: hashedPassword,
                registrationDate: new Date().toISOString(),
                lastLogin: null,
                isActive: true,
                loginAttempts: 0,
                lockedUntil: null,
                membershipType: 'basic',
                profilePicture: null,
                deviceInfo: {
                    userAgent: navigator.userAgent.substring(0, 100),
                    platform: navigator.platform,
                    registeredAt: new Date().toISOString()
                }
            };

            const users = this.getCloudUsers();
            
            // Check if email already exists
            const existingUser = users.find(u => u.email === newUser.email);
            if (existingUser) {
                return { success: false, message: 'Email already exists' };
            }

            users.push(newUser);
            this.saveCloudUsers(users);

            console.log('✅ User registered in demo cloud system');
            return { success: true, userId: newUser.id, user: newUser };

        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed: ' + error.message };
        }
    }

    // Authenticate user
    async authenticateUser(email, password) {
        try {
            const hashedPassword = await this.hashPassword(password);
            const users = this.getCloudUsers();
            const userIndex = users.findIndex(u => u.email === email.toLowerCase());

            if (userIndex === -1) {
                return { success: false, message: 'User not found' };
            }

            const user = users[userIndex];

            // Check if account is locked
            if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
                return { 
                    success: false, 
                    message: 'Account temporarily locked. Try again later.' 
                };
            }

            // Check password
            if (user.password === hashedPassword) {
                // Update login info
                user.loginAttempts = 0;
                user.lockedUntil = null;
                user.lastLogin = new Date().toISOString();
                user.deviceInfo.lastLoginDevice = navigator.userAgent.substring(0, 100);
                user.deviceInfo.lastLoginPlatform = navigator.platform;
                
                users[userIndex] = user;
                this.saveCloudUsers(users);

                console.log('🎉 Cross-device login successful!');
                return { 
                    success: true, 
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        membershipType: user.membershipType,
                        lastLogin: user.lastLogin
                    }
                };
            } else {
                // Handle failed login
                user.loginAttempts = (user.loginAttempts || 0) + 1;
                
                if (user.loginAttempts >= 5) {
                    user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
                }
                
                users[userIndex] = user;
                this.saveCloudUsers(users);
                
                return { 
                    success: false, 
                    message: `Invalid password. ${5 - user.loginAttempts} attempts remaining.` 
                };
            }

        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Authentication failed: ' + error.message };
        }
    }

    // Get all users for display
    async getAllUsers() {
        const users = this.getCloudUsers();
        return users.map(user => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            registrationDate: user.registrationDate,
            lastLogin: user.lastLogin,
            membershipType: user.membershipType,
            isActive: user.isActive,
            deviceInfo: user.deviceInfo
        }));
    }

    // Show cross-device status
    showCrossDeviceStatus() {
        const users = this.getCloudUsers();
        const lastSync = localStorage.getItem(this.syncKey);
        
        console.log('🌐 Demo Cross-Device Status:');
        console.log(`📊 Total Users: ${users.length}`);
        console.log(`🕒 Last Sync: ${lastSync}`);
        console.log('💡 This demo uses localStorage to simulate cloud storage');
        console.log('🔄 In production, this would sync across actual devices');
        
        return {
            totalUsers: users.length,
            lastSync: lastSync,
            isDemo: true
        };
    }

    // Simulate device sync
    simulateDeviceSync() {
        const status = this.showCrossDeviceStatus();
        
        // Show demo message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            z-index: 10000;
            font-size: 0.9rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            max-width: 300px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        message.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <i class="fas fa-cloud-upload-alt" style="margin-right: 8px;"></i>
                <strong>Demo Cloud Sync</strong>
            </div>
            <div style="font-size: 0.85rem; opacity: 0.9;">
                📱 ${status.totalUsers} users synced<br>
                🕒 Last sync: just now<br>
                💡 Ready for cross-device login!
            </div>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(message);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            message.style.animation = 'slideInRight 0.5s ease-out reverse';
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 500);
        }, 4000);
    }

    // Check if ready for cross-device
    isReady() {
        return true;
    }
}

// Initialize demo cloud database
const demoCloudDB = new DemoCloudDB();

// Export for use
window.DemoCloudDB = demoCloudDB;

// Auto-initialize
document.addEventListener('DOMContentLoaded', async () => {
    await demoCloudDB.init();
    
    // Create a test user if none exist
    const users = demoCloudDB.getCloudUsers();
    if (users.length === 0) {
        console.log('🔧 Creating test user for demo...');
        const testResult = await demoCloudDB.registerUser({
            fullName: 'Test User',
            email: 'test@demo.com',
            password: 'test123'
        });
        
        if (testResult.success) {
            console.log('✅ Test user created: test@demo.com / test123');
        }
    }
    
    // Show status after 2 seconds
    setTimeout(() => {
        demoCloudDB.simulateDeviceSync();
    }, 2000);
});