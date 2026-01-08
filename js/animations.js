// Enhanced Animations JavaScript
// This file adds dynamic animations and interactive effects

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupScrollAnimations();
    setupInteractiveAnimations();
    setupFormAnimations();
});

// Initialize all animations
function initializeAnimations() {
    // Add entrance animations to elements
    addEntranceAnimations();
    
    // Setup intersection observer for scroll-triggered animations
    setupIntersectionObserver();
    
    // Add hover effects to interactive elements
    addHoverEffects();
    
    console.log('🎬 Animations initialized successfully!');
}

// Add entrance animations to page elements
function addEntranceAnimations() {
    // Stagger animation for cards
    const cards = document.querySelectorAll('.card, .feature-card, .class-card, .trainer-card, .settings-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
    
    // Animate navigation items
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in-down');
    });
    
    // Animate form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('fade-in-left');
    });
}

// Setup scroll-triggered animations
function setupScrollAnimations() {
    const animateOnScroll = document.querySelectorAll('section, .card, h1, h2, h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add specific animations based on element type
                if (entry.target.tagName === 'SECTION') {
                    entry.target.style.animation = 'sectionFadeIn 0.8s ease-out';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateOnScroll.forEach(el => observer.observe(el));
}

// Setup intersection observer for advanced animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add different animations based on data attributes
                const animationType = element.dataset.animation || 'fadeInUp';
                const delay = element.dataset.delay || '0';
                
                setTimeout(() => {
                    element.classList.add(animationType);
                }, parseInt(delay));
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation data attributes
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(el => observer.observe(el));
}

// Add interactive hover effects
function addHoverEffects() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
        
        button.addEventListener('click', function() {
            this.classList.add('click-effect');
            setTimeout(() => {
                this.classList.remove('click-effect');
            }, 300);
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.card, .settings-card, .feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Setup form animations
function setupFormAnimations() {
    // Input focus animations
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
            this.classList.add('glow');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            this.classList.remove('glow');
        });
        
        // Typing animation for inputs
        input.addEventListener('input', function() {
            this.classList.add('typing-effect');
            setTimeout(() => {
                this.classList.remove('typing-effect');
            }, 300);
        });
    });
    
    // Form submission animation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
                submitBtn.disabled = true;
            }
        });
    });
}

// Eye icon toggle animation
function animateEyeToggle(iconElement) {
    iconElement.style.transform = 'scale(0.8) rotate(180deg)';
    iconElement.style.opacity = '0.5';
    
    setTimeout(() => {
        iconElement.style.transform = 'scale(1) rotate(360deg)';
        iconElement.style.opacity = '1';
    }, 200);
    
    setTimeout(() => {
        iconElement.style.transform = '';
    }, 400);
}

// Success message animation
function showSuccessMessage(message, duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message animated-message';
    messageDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        animation: messageSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.5s ease-in-out';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 500);
    }, duration);
}

// Error message animation
function showErrorMessage(message, duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message animated-message shake';
    messageDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        animation: messageSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.5s ease-in-out';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 500);
    }, duration);
}

// Loading animation
function showLoadingAnimation(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `<span class="loading-spinner"></span> ${text}`;
    element.disabled = true;
    
    return function hideLoading() {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// Particle effect for special occasions
function createParticleEffect(x, y, color = '#000') {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 2 + Math.random() * 3;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += Math.cos(angle) * velocity;
            posY += Math.sin(angle) * velocity + 0.5; // gravity
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Smooth scroll with animation
function smoothScrollTo(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Add CSS for additional animations
const additionalStyles = `
    @keyframes messageSlideOut {
        from {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateX(100%) scale(0.8);
        }
    }
    
    .hover-effect {
        transform: scale(1.05) !important;
        transition: all 0.3s ease !important;
    }
    
    .click-effect {
        transform: scale(0.95) !important;
        transition: all 0.1s ease !important;
    }
    
    .typing-effect {
        animation: typingPulse 0.3s ease-in-out !important;
    }
    
    @keyframes typingPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    .input-focused {
        animation: inputFocusGlow 0.6s ease-out !important;
    }
    
    @keyframes inputFocusGlow {
        0% { box-shadow: 0 0 0 0px rgba(0,0,0,0.1); }
        50% { box-shadow: 0 0 0 5px rgba(0,0,0,0.1); }
        100% { box-shadow: 0 0 0 3px rgba(0,0,0,0.1); }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export functions for global use
window.animateEyeToggle = animateEyeToggle;
window.showSuccessMessage = showSuccessMessage;
window.showErrorMessage = showErrorMessage;
window.showLoadingAnimation = showLoadingAnimation;
window.createParticleEffect = createParticleEffect;
window.smoothScrollTo = smoothScrollTo;