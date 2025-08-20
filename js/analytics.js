// Google Analytics 4 Implementation
function initializeAnalytics() {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 Measurement ID

    // Track custom events
    trackCustomEvents();
}

function trackCustomEvents() {
    // Track portfolio item clicks
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const category = item.getAttribute('data-category');
            gtag('event', 'view_portfolio_item', {
                'category': category,
                'title': item.querySelector('h3').textContent
            });
        });
    });

    // Track contact form submissions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            gtag('event', 'form_submission', {
                'form_name': 'contact_form'
            });
        });
    }

    // Track scroll depth
    let scrollDepthTriggered = {
        25: false,
        50: false,
        75: false,
        100: false
    };

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
        
        Object.keys(scrollDepthTriggered).forEach(depth => {
            if (scrollPercent >= depth && !scrollDepthTriggered[depth]) {
                scrollDepthTriggered[depth] = true;
                gtag('event', 'scroll_depth', {
                    'depth': depth + '%'
                });
            }
        });
    });
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnalytics);
