document.addEventListener('DOMContentLoaded', () => {
    const videoWrappers = document.querySelectorAll('.video-wrapper');

    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        if (!video) return;

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
            console.error('Error loading video:', video.src);
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
            video.pause();
            video.src = '';
            video.load();
        };
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