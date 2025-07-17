// Initialize Masonry grid after the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Masonry
    var grid = document.querySelector('.projects-grid');
    var masonry = new Masonry(grid, {
        itemSelector: '.project-item',
        columnWidth: '.project-item',
        percentPosition: true,
        gutter: 20,
        initLayout: false // We'll initialize after content is loaded
    });

    // Get all media elements (both videos and images)
    var videos = document.querySelectorAll('.video-wrapper video');
    var images = document.querySelectorAll('.project-item img');
    var totalMediaCount = videos.length + images.length;
    var loadedMediaCount = 0;

    function checkIfAllLoaded() {
        loadedMediaCount++;
        if (loadedMediaCount === totalMediaCount) {
            masonry.layout();
        }
    }

    // Handle video loading
    videos.forEach(function(video) {
        if (video.readyState >= 4) {
            checkIfAllLoaded();
        } else {
            video.addEventListener('loadeddata', checkIfAllLoaded);
        }
    });

    // Handle image loading
    images.forEach(function(img) {
        if (img.complete) {
            checkIfAllLoaded();
        } else {
            img.addEventListener('load', checkIfAllLoaded);
        }
    });

    // Re-layout Masonry when window is resized
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            masonry.layout();
        }, 250);
    });
}); 