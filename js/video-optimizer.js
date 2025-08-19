// Video optimization and lazy loading utility
class VideoOptimizer {
    constructor() {
        this.videoObserver = null;
        this.initializeObserver();
    }

    initializeObserver() {
        this.videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    this.loadVideo(video);
                    observer.unobserve(video);
                } else {
                    // Pause video when out of view
                    if (entry.target.tagName === 'VIDEO') {
                        entry.target.pause();
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }

    loadVideo(video) {
        if (!video.dataset.src) return;

        // Set the actual source
        const source = video.querySelector('source');
        if (source) {
            source.src = video.dataset.src;
        } else {
            video.src = video.dataset.src;
        }

        // Load video
        video.load();

        // Add loaded class for styling
        video.classList.add('loaded');
        video.classList.remove('loading');

        // Autoplay if specified
        if (video.hasAttribute('autoplay')) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay was prevented, show play button
                    this.showPlayButton(video);
                });
            }
        }
    }

    showPlayButton(video) {
        const playButton = document.createElement('button');
        playButton.className = 'video-play-btn';
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        playButton.onclick = () => {
            video.play();
            playButton.style.display = 'none';
        };

        // Add play button next to video
        video.parentElement.appendChild(playButton);
    }

    observe(video) {
        if (!video.dataset.src) {
            // Store the original source
            const source = video.querySelector('source');
            video.dataset.src = source ? source.src : video.src;
            
            // Clear the source
            if (source) {
                source.src = '';
            } else {
                video.src = '';
            }

            // Add loading class
            video.classList.add('loading');
        }
        this.videoObserver.observe(video);
    }

    // Initialize lazy loading for all videos in a container
    initContainer(container) {
        const videos = container.querySelectorAll('video[data-src], video:not([data-src])');
        videos.forEach(video => {
            // If video doesn't have data-src, create it from the current src
            if (!video.dataset.src) {
                const source = video.querySelector('source');
                video.dataset.src = source ? source.src : video.src;
            }
            this.observe(video);
        });
    }
}

// Export the optimizer
export const videoOptimizer = new VideoOptimizer();
