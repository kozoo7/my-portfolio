// Optimized Masonry grid initialization and management
class MasonryOptimizer {
    constructor(gridElement, options = {}) {
        this.grid = gridElement;
        this.options = {
            itemSelector: '.project-item',
            columnWidth: '.project-item',
            percentPosition: true,
            gutter: 20,
            transitionDuration: '0.3s',
            initLayout: false, // Prevent automatic layout on init
            ...options
        };
        this.masonry = null;
        this.debouncedLayout = this.debounce(this.layout.bind(this), 150);
        this.pendingItems = new Set();
        this.layoutTimeout = null;
    }

    init() {
        if (!this.grid) return;
        
        // Initialize Masonry instance
        this.masonry = new Masonry(this.grid, this.options);
        
        // Wait for all images to load before initial layout
        this.waitForImages()
            .then(() => this.layout())
            .catch(console.error);

        // Add resize listener with debounce
        window.addEventListener('resize', this.debouncedLayout);
        
        // Observe grid for new items
        this.observeGrid();
    }

    waitForImages() {
        const images = Array.from(this.grid.getElementsByTagName('img'));
        const videos = Array.from(this.grid.getElementsByTagName('video'));
        
        const imagePromises = images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve; // Resolve on error to prevent hanging
            });
        });

        const videoPromises = videos.map(video => {
            if (video.readyState >= 3) return Promise.resolve();
            return new Promise(resolve => {
                video.oncanplay = resolve;
                video.onerror = resolve;
            });
        });

        return Promise.all([...imagePromises, ...videoPromises]);
    }

    observeGrid() {
        const observer = new MutationObserver(mutations => {
            let shouldLayout = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.matches && node.matches(this.options.itemSelector)) {
                            this.pendingItems.add(node);
                            shouldLayout = true;
                        }
                    });
                }
            });

            if (shouldLayout) {
                this.scheduleLayout();
            }
        });

        observer.observe(this.grid, {
            childList: true,
            subtree: true
        });
    }

    scheduleLayout() {
        if (this.layoutTimeout) {
            clearTimeout(this.layoutTimeout);
        }

        this.layoutTimeout = setTimeout(() => {
            this.layoutPendingItems();
        }, 100);
    }

    layoutPendingItems() {
        if (!this.masonry || this.pendingItems.size === 0) return;

        const itemsArray = Array.from(this.pendingItems);
        this.pendingItems.clear();

        // Wait for new items' images to load
        Promise.all(
            itemsArray.map(item => {
                const images = Array.from(item.getElementsByTagName('img'));
                const videos = Array.from(item.getElementsByTagName('video'));
                return Promise.all([
                    ...images.map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise(resolve => {
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    }),
                    ...videos.map(video => {
                        if (video.readyState >= 3) return Promise.resolve();
                        return new Promise(resolve => {
                            video.oncanplay = resolve;
                            video.onerror = resolve;
                        });
                    })
                ]);
            })
        ).then(() => {
            this.masonry.appended(itemsArray);
            this.layout();
        });
    }

    layout() {
        if (!this.masonry) return;
        
        requestAnimationFrame(() => {
            this.masonry.layout();
        });
    }

    destroy() {
        if (this.masonry) {
            this.masonry.destroy();
            this.masonry = null;
        }
        window.removeEventListener('resize', this.debouncedLayout);
    }

    debounce(func, wait) {
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
}

export default MasonryOptimizer;
