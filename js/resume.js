// Resume Section Interactive JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize resume functionality
    initResumeFeatures();
});

function initResumeFeatures() {
    // Download Resume Button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadResume);
    }

    // Toggle View Button
    const toggleViewBtn = document.getElementById('toggleViewBtn');
    if (toggleViewBtn) {
        toggleViewBtn.addEventListener('click', handleToggleView);
    }

    // Animate skill bars on scroll
    animateSkillBars();

    // Add hover effects to resume cards
    addResumeCardEffects();

    // Initialize timeline animations
    initTimelineAnimations();
}

// Download Resume Functionality
function handleDownloadResume() {
    // Create a simple text version of the resume
    const resumeContent = generateResumeText();
    
    // Create blob and download link
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.txt';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Resume downloaded successfully!', 'success');
}

// Generate Resume Text Content
function generateResumeText() {
    let content = '===== RESUME =====\n\n';
    
    // Education Section
    const educationItems = document.querySelectorAll('[data-category="education"] .timeline-item');
    if (educationItems.length > 0) {
        content += '\nEDUCATION\n---------\n';
        educationItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent || '';
            const institution = item.querySelector('.institution')?.textContent || '';
            const duration = item.querySelector('.duration')?.textContent || '';
            const description = item.querySelector('.description')?.textContent || '';
            content += `${title}\n${institution}\n${duration}\n${description}\n\n`;
        });
    }
    
    // Experience Section
    const experienceItems = document.querySelectorAll('[data-category="experience"] .timeline-item');
    if (experienceItems.length > 0) {
        content += '\nEXPERIENCE\n----------\n';
        experienceItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent || '';
            const institution = item.querySelector('.institution')?.textContent || '';
            const duration = item.querySelector('.duration')?.textContent || '';
            const description = item.querySelector('.description')?.textContent || '';
            content += `${title}\n${institution}\n${duration}\n${description}\n\n`;
        });
    }
    
    // Skills Section
    const skillItems = document.querySelectorAll('.skill-item');
    if (skillItems.length > 0) {
        content += '\nSKILLS\n------\n';
        skillItems.forEach(item => {
            const skillName = item.querySelector('.skill-header span:first-child')?.textContent || '';
            const skillLevel = item.querySelector('.skill-percentage')?.textContent || '';
            content += `${skillName}: ${skillLevel}\n`;
        });
    }
    
    return content;
}

// Toggle View Functionality
let isCompactView = false;

function handleToggleView() {
    isCompactView = !isCompactView;
    const resumeCards = document.querySelectorAll('.resume-card');
    const toggleBtn = document.getElementById('toggleViewBtn');
    
    resumeCards.forEach(card => {
        if (isCompactView) {
            card.style.padding = '15px';
            card.style.marginBottom = '15px';
            
            // Hide descriptions in compact view
            const descriptions = card.querySelectorAll('.description');
            descriptions.forEach(desc => {
                desc.style.display = 'none';
            });
        } else {
            card.style.padding = '30px';
            card.style.marginBottom = '30px';
            
            // Show descriptions in full view
            const descriptions = card.querySelectorAll('.description');
            descriptions.forEach(desc => {
                desc.style.display = 'block';
            });
        }
    });
    
    // Update button text
    if (toggleBtn) {
        const iconSpan = toggleBtn.querySelector('.icon');
        toggleBtn.textContent = isCompactView ? ' Expand View' : ' Toggle View';
        if (iconSpan) {
            toggleBtn.insertBefore(iconSpan, toggleBtn.firstChild);
        }
    }
    
    showNotification(isCompactView ? 'Compact view enabled' : 'Full view enabled', 'info');
}

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Add Resume Card Effects
function addResumeCardEffects() {
    const resumeCards = document.querySelectorAll('.resume-card');
    
    resumeCards.forEach(card => {
        // Add click to expand/collapse functionality
        const cardTitle = card.querySelector('.card-title');
        if (cardTitle) {
            cardTitle.style.cursor = 'pointer';
            cardTitle.addEventListener('click', function() {
                const content = card.querySelector('.timeline, .skills-grid, .cert-list');
                if (content) {
                    const isHidden = content.style.display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';
                    
                    // Add visual indicator
                    cardTitle.style.opacity = isHidden ? '1' : '0.7';
                }
            });
        }
    });
}

// Initialize Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => observer.observe(item));
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts if needed
window.resumeFeatures = {
    handleDownloadResume,
    handleToggleView,
    showNotification
};
