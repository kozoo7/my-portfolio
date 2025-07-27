// Remove old mobile menu code and start with back to top functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show button when user scrolls down 300px
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Progress Bars Animation
const progressBars = document.querySelectorAll('.progress-bar');
const animateProgress = () => {
    progressBars.forEach(progress => {
        progress.style.setProperty('--progress', `${progress.dataset.progress}%`);
    });
};

// Intersection Observer for Progress Bars
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgress();
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => progressObserver.observe(bar));

// Form Handling
const contactForm = document.getElementById('contact-form');
const formGroups = document.querySelectorAll('.form-group');

if (contactForm) {
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (input) {
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    group.classList.remove('focused');
                }
            });
        }
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Basic form validation
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        if (!isValidEmail(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Here you would typically send the form data to a server
        // For demo purposes, we'll just log it and show a success message
        console.log('Form submitted:', formData);
        alert('Message sent successfully!');
        contactForm.reset();
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll-based animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.portfolio-item, .section-title, .about-text');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
    animateOnScroll();
});

// Initialize animations
animateOnScroll();

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Dynamic Typing Effect
const typingText = document.querySelector('.animate-text');
if (typingText) {
    const words = ['Designer', 'Creator', 'Artist', 'Innovator'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        
        typingText.innerHTML = `Creative <span class="highlight">${currentChar}</span>`;
        
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeEffect, 200);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, 100);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(typeEffect, 1000);
        }
    }

    typeEffect();
}

// Enhanced Scroll Animation
const scrollElements = document.querySelectorAll('.portfolio-item, .skill-item, .section-title');

const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= 
        ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    });
};

window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Portfolio Item Tilt Effect
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Enhanced Form Interaction
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
if (formInputs.length > 0) {
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focus');
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focus');
            }
        });
    });
}

// Smooth Reveal Animation for Sections
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
});

// Particle Background Effect
const createParticles = () => {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--x', `${Math.random() * 100}vw`);
        particle.style.setProperty('--y', `${Math.random() * 100}vh`);
        particle.style.setProperty('--duration', `${Math.random() * 20 + 10}s`);
        particle.style.setProperty('--delay', `${Math.random() * 5}s`);
        particlesContainer.appendChild(particle);
    }
};

createParticles();

// Enhanced Progress Bars
const updateProgressBars = () => {
    progressBars.forEach(progress => {
        const value = progress.dataset.progress;
        progress.style.setProperty('--progress', value);
        
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = `${value}%`;
        
        if (!progress.querySelector('.progress-text')) {
            progress.appendChild(progressText);
        }
    });
};

updateProgressBars();

// Smooth scroll for Explore More link
document.addEventListener('DOMContentLoaded', function() {
    // Get the explore link
    const exploreLink = document.querySelector('.explore-link');
    const portfolioSection = document.querySelector('#portfolio');

    if (exploreLink && portfolioSection) {
        exploreLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Smooth scroll to portfolio section
            portfolioSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}); 

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Video Loading Handler
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Add loading class
        video.parentElement.classList.add('loading');
        
        // Handle successful loading
        video.addEventListener('loadeddata', () => {
            video.parentElement.classList.remove('loading');
            video.parentElement.classList.add('loaded');
        }, { once: true });
        
        // Handle loading errors
        video.addEventListener('error', () => {
            video.parentElement.classList.remove('loading');
            video.parentElement.classList.add('error');
            console.log('Error loading video:', video.querySelector('source').src);
        }, { once: true });

        // Cleanup resources when video is not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }, { threshold: 0.1 });

        observer.observe(video);
    });
}); 

// Content Protection
document.addEventListener('contextmenu', function(e) {
    // Allow right-click only on elements with class 'allow-download'
    if (!e.target.closest('.allow-download')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('keydown', function(e) {
    // Prevent Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12
    if (
        (e.ctrlKey && e.keyCode == 83) || // Ctrl+S
        (e.ctrlKey && e.keyCode == 85) || // Ctrl+U
        (e.ctrlKey && e.shiftKey && e.keyCode == 73) || // Ctrl+Shift+I
        e.keyCode == 123 // F12
    ) {
        e.preventDefault();
        return false;
    }
});

// Prevent dragging of images
document.addEventListener('dragstart', function(e) {
    if (!e.target.closest('.allow-download')) {
        e.preventDefault();
        return false;
    }
});

// Add protection to videos
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('contextmenu', e => e.preventDefault());
        video.controlsList = "nodownload";
    });
}); 

// Journey Modal Functions
function openJourneyModal() {
    const modal = document.getElementById('journeyModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeJourneyModal() {
    const modal = document.getElementById('journeyModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('journeyModal');
    if (event.target === modal) {
        closeJourneyModal();
    }
}

// Close modal on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeJourneyModal();
    }
}); 