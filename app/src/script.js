// Profile Page Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll animation for sections
    const sections = document.querySelectorAll('.profile-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        sectionObserver.observe(section);
    });
    
    // Skill badges interactive effects
    const skillBadges = document.querySelectorAll('.skill-badge');
    
    skillBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
    
    // Contact link tooltips enhancement
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const title = this.getAttribute('title');
            if (title) {
                console.log(`Opening: ${title}`);
            }
        });
    });
    
    // Profile image loading effect
    const profileImage = document.querySelector('.profile-image');
    
    if (profileImage) {
        profileImage.addEventListener('load', function() {
            this.style.animation = 'fadeInUp 1s ease-out';
        });
    }
    
    // Add pulse animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Profile page loaded successfully!');
});

// Add smooth scrolling behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
