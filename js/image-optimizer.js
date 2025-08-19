// Image optimization and lazy loading utility
class ImageOptimizer {
    constructor() {
        this.imageObserver = null;
        this.initializeObserver();
    }

    initializeObserver() {
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Create a temporary image to check loading
        const tempImage = new Image();
        
        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('loading');
        };

        tempImage.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            // Load a placeholder image or show error state
            img.src = 'images/placeholder.jpg';
        };

        img.classList.add('loading');
        tempImage.src = src;
    }

    observe(img) {
        if (!img.dataset.src) {
            img.dataset.src = img.src;
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Tiny transparent placeholder
        }
        this.imageObserver.observe(img);
    }

    // Initialize lazy loading for all images in a container
    initContainer(container) {
        const images = container.querySelectorAll('img[data-src]');
        images.forEach(img => this.observe(img));
    }
}

// Export the optimizer
export const imageOptimizer = new ImageOptimizer();
