// Main JavaScript for Portfolio Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all main features
    initNavigation();
    initScrollEffects();
    initGeneralAnimations();
    
    console.log('Portfolio website initialized successfully!');
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link (starts with #)
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active state
                    updateActiveNavLink(this);
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateNavOnScroll);
}

// Update active navigation link
function updateActiveNavLink(clickedLink) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    if (clickedLink) {
        clickedLink.classList.add('active');
    }
}

// Update navigation based on scroll position
function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for header
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (navLink) {
                updateActiveNavLink(navLink);
            }
        }
    });
}

// Scroll effects
function initScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                header.style.padding = '0.5rem 0';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                header.style.padding = '1rem 0';
            }
        });
    }
    
    // Scroll to top button
    createScrollToTopButton();
}

// Create scroll to top button
function createScrollToTopButton() {
    // Create button element
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTop';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Style the button
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 999;
    `;
    
    // Add to document
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// General animations
function initGeneralAnimations() {
    // Fade in animation for elements
    const fadeElements = document.querySelectorAll('[data-aos]');
    
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.getAttribute('data-aos');
                    
                    // Apply animation
                    element.style.transition = 'all 0.6s ease';
                    
                    switch(animation) {
                        case 'fade-up':
                            element.style.opacity = '0';
                            element.style.transform = 'translateY(30px)';
                            setTimeout(() => {
                                element.style.opacity = '1';
                                element.style.transform = 'translateY(0)';
                            }, 100);
                            break;
                        case 'fade-down':
                            element.style.opacity = '0';
                            element.style.transform = 'translateY(-30px)';
                            setTimeout(() => {
                                element.style.opacity = '1';
                                element.style.transform = 'translateY(0)';
                            }, 100);
                            break;
                        case 'fade-left':
                            element.style.opacity = '0';
                            element.style.transform = 'translateX(30px)';
                            setTimeout(() => {
                                element.style.opacity = '1';
                                element.style.transform = 'translateX(0)';
                            }, 100);
                            break;
                        case 'fade-right':
                            element.style.opacity = '0';
                            element.style.transform = 'translateX(-30px)';
                            setTimeout(() => {
                                element.style.opacity = '1';
                                element.style.transform = 'translateX(0)';
                            }, 100);
                            break;
                        default:
                            element.style.opacity = '0';
                            setTimeout(() => {
                                element.style.opacity = '1';
                            }, 100);
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.2 });
        
        fadeElements.forEach(element => observer.observe(element));
    }
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utility functions
window.portfolioUtils = {
    isInViewport,
    debounce,
    updateActiveNavLink
};
