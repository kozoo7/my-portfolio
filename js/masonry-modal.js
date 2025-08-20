// Masonry and Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Masonry with specific column width
    const grid = document.querySelector('.projects-grid');
    const masonry = new Masonry(grid, {
        itemSelector: '.project-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 20,
        transitionDuration: '0.3s',
        initLayout: true
    });

    // Add grid sizer element
    if (!document.querySelector('.grid-sizer')) {
        const sizer = document.createElement('div');
        sizer.className = 'grid-sizer';
        grid.insertBefore(sizer, grid.firstChild);
    }

    // Reinitialize Masonry after all images are loaded
    imagesLoaded(grid, function() {
        masonry.layout();
    });

    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');

    // Open modal
    grid.addEventListener('click', function(e) {
        const clickedItem = e.target.closest('.project-item');
        if (clickedItem) {
            const img = clickedItem.querySelector('img');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    });

    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            modalImg.src = ''; // Clear source after animation
        }, 300);
    }

    // Close on button click
    closeBtn.addEventListener('click', closeModal);

    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            masonry.layout();
        }, 250);
    });

    // Back to Top functionality
    const backToTop = document.getElementById('back-to-top');
    
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    };

    backToTop.onclick = function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    };
});