document.addEventListener('DOMContentLoaded', () => {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const wrapper = entry.target;
            const video = wrapper.querySelector('video');
            
            if (entry.isIntersecting && video && !video.src) {
                // Load video only when it comes into view
                video.src = video.dataset.src;
                video.load();
                observer.unobserve(wrapper);
            }
        });
    }, options);

    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        if (!video) return;

        // Store original source and remove it
        video.dataset.src = video.src;
        video.removeAttribute('src');

        // Add loading class initially
        wrapper.classList.add('loading');

        // Handle successful video loading
        const handleLoad = () => {
            wrapper.classList.remove('loading');
            wrapper.classList.add('loaded');
        };

        // Handle video loading error
        const handleError = () => {
            wrapper.classList.remove('loading');
            wrapper.classList.add('error');
            const errorMsg = wrapper.querySelector('.error-message') || document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.innerHTML = `
                <h3>Video Loading Error</h3>
                <p>Please try refreshing the page</p>
            `;
            if (!wrapper.querySelector('.error-message')) {
                wrapper.appendChild(errorMsg);
            }
            console.error('Error loading video:', video.dataset.src);
        };

        // Handle video play/pause
        const handlePlay = () => {
            // Pause all other videos when one starts playing
            videoWrappers.forEach(otherWrapper => {
                const otherVideo = otherWrapper.querySelector('video');
                if (otherVideo && otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        };

        // Add event listeners
        video.addEventListener('loadeddata', handleLoad, { once: true });
        video.addEventListener('error', handleError, { once: true });
        video.addEventListener('play', handlePlay);

        // Store cleanup function on the wrapper element
        wrapper.cleanup = () => {
            video.removeEventListener('loadeddata', handleLoad);
            video.removeEventListener('error', handleError);
            video.removeEventListener('play', handlePlay);
            observer.unobserve(wrapper);
            video.pause();
            video.src = '';
            video.load();
        };

        // Start observing the video wrapper
        observer.observe(wrapper);
    });
});

// Cleanup when navigating away
window.addEventListener('pagehide', () => {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    videoWrappers.forEach(wrapper => {
        if (wrapper.cleanup) {
            wrapper.cleanup();
        }
    });
}, { capture: true }); 