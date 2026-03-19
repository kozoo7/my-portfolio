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
            const images = JSON.parse(this.dataset.projectImages || '[]');
            const title = this.dataset.projectTitle;
            
            currentImages = Array.isArray(images) ? images : [];
            currentImageIndex = 0;
            
            showImage(currentImageIndex);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Show specific image in modal (with smooth fade)
    function showImage(index) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';

        if (!currentImages.length) {
            modalContent.innerHTML = '';
            const msg = document.createElement('p');
            msg.className = 'modal-no-images';
            msg.textContent = 'No gallery images yet. Add image URLs to the card\'s data-project-images in playing-cards.html.';
            msg.setAttribute('style', 'color:#888;padding:2rem;text-align:center;max-width:320px;');
            modalContent.appendChild(msg);
            return;
        }

        let img = modalContent.querySelector('img');
        if (img) {
            img.classList.add('modal-gallery-img-leaving');
            img.addEventListener('transitionend', function handler() {
                img.removeEventListener('transitionend', handler);
                img.src = currentImages[index];
                img.alt = `Image ${index + 1} of ${currentImages.length}`;
                img.onload = function() {
                    img.classList.remove('modal-gallery-img-leaving');
                };
                if (img.complete) img.classList.remove('modal-gallery-img-leaving');
            }, { once: true });
        } else {
            img = document.createElement('img');
            img.src = currentImages[index];
            img.alt = `Image ${index + 1} of ${currentImages.length}`;
            img.className = 'modal-gallery-img-enter';
            modalContent.appendChild(img);
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    img.classList.remove('modal-gallery-img-enter');
                });
            });
        }

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
                if (lightbox && lightbox.classList.contains('active')) closeLightbox();
                else closeModal();
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

    // Preload all gallery images (skip if no images)
    document.querySelectorAll('.card-thumbnail').forEach(thumbnail => {
        const raw = thumbnail.dataset.projectImages;
        const images = raw ? JSON.parse(raw) : [];
        if (Array.isArray(images) && images.length) preloadImages(images);
    });

    // Lightbox: click modal image to enlarge
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox && lightbox.querySelector('.lightbox-backdrop');

    function openLightbox(img) {
        if (!lightbox || !lightboxImg || !img || !img.src) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Enlarged view';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
    }
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    modalContent.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(e.target);
        }
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) closeLightbox();
    });
});