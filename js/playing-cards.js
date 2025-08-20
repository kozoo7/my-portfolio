document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('.modal');
    const modalContent = modal.querySelector('.modal-gallery');
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.nav-prev');
    const nextBtn = modal.querySelector('.nav-next');
    let currentImageIndex = 0;
    let currentImages = [];

    // Open modal and initialize gallery
    document.querySelectorAll('.card-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const images = JSON.parse(this.dataset.projectImages);
            const title = this.dataset.projectTitle;
            
            currentImages = images;
            currentImageIndex = 0;
            
            showImage(currentImageIndex);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Show specific image in modal
    function showImage(index) {
        if (!currentImages.length) return;
        
        // Clear existing content
        modalContent.innerHTML = '';
        
        // Create and add new image
        const img = document.createElement('img');
        img.src = currentImages[index];
        img.alt = `Image ${index + 1} of ${currentImages.length}`;
        modalContent.appendChild(img);
        
        // Update navigation buttons
        prevBtn.style.display = index > 0 ? 'block' : 'none';
        nextBtn.style.display = index < currentImages.length - 1 ? 'block' : 'none';
    }

    // Navigation handlers
    prevBtn.addEventListener('click', function() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            showImage(currentImageIndex);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentImageIndex < currentImages.length - 1) {
            currentImageIndex++;
            showImage(currentImageIndex);
        }
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            modalContent.innerHTML = ''; // Clear content after animation
        }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentImageIndex > 0) {
                    currentImageIndex--;
                    showImage(currentImageIndex);
                }
                break;
            case 'ArrowRight':
                if (currentImageIndex < currentImages.length - 1) {
                    currentImageIndex++;
                    showImage(currentImageIndex);
                }
                break;
            case 'Escape':
                closeModal();
                break;
        }
    });

    // Preload images
    function preloadImages(images) {
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Preload all gallery images
    document.querySelectorAll('.card-thumbnail').forEach(thumbnail => {
        const images = JSON.parse(thumbnail.dataset.projectImages);
        preloadImages(images);
    });
});