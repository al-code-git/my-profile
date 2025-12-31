// Ensure page starts at top on load/refresh
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Scroll to top function
function scrollToTop(event) {
    event.preventDefault();
    
    // Close the mobile menu if it's open
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.click();
        }
    }
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Profile Page Interactive Features

// Language Selector
const languageSelector = document.getElementById('languageSelector');
if (languageSelector) {
    languageSelector.addEventListener('change', function() {
        if (this.value === 'pt') {
            window.location.href = '/pt/index.html';
        } else {
            window.location.href = '/index.html';
        }
    });
}


// Set active navigation link and close mobile menu
function setActive(event) {
    event.preventDefault();
    
    // Remove active class from all nav links
    document.querySelectorAll('.navbar-custom .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    event.target.classList.add('active');
    
    // Get the target section
    const targetId = event.target.getAttribute('href');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    // Function to perform the scroll
    function performScroll() {
        // Small delay to ensure DOM is fully settled after collapse animation
        requestAnimationFrame(() => {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbar = document.querySelector('.navbar-custom');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                
                const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight - 50;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Check if mobile menu is open
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        // Wait for Bootstrap's collapse animation to complete
        navbarCollapse.addEventListener('hidden.bs.collapse', performScroll, { once: true });
        
        // Trigger the collapse
        if (navbarToggler) {
            navbarToggler.click();
        }
    } else {
        // Menu is already closed, scroll immediately
        performScroll();
    }
}

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
});

// Add smooth scrolling behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just '#' (handled by scrollToTop function)
        if (href === '#') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
