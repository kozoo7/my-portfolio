document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const closeModal = document.querySelector('.close-modal');
    const cardThumbnails = document.querySelectorAll('.card-thumbnail');

    // Function to open modal with project images
    function openModal(projectId, projectTitle, images) {
        const modalHTML = `
            <div class="modal-header">
                <h2>${projectTitle}</h2>
                <button class="close-modal" aria-label="Close modal">×</button>
            </div>
            <div class="modal-body">
                <div class="modal-gallery">
                    ${images.map(img => `
                        <img src="${img}" alt="${projectTitle} playing card design" loading="lazy">
                    `).join('')}
                </div>
            </div>
        `;

        modalContent.innerHTML = modalHTML;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

        // Add event listener to new close button
        modalContent.querySelector('.close-modal').addEventListener('click', closeModalHandler);
    }

    // Function to close modal
    function closeModalHandler() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalHandler();
        }
    });

    // Add click handlers to all card thumbnails
    cardThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const projectId = thumbnail.dataset.projectId;
            const projectTitle = thumbnail.dataset.projectTitle;
            const projectImages = JSON.parse(thumbnail.dataset.projectImages);
            openModal(projectId, projectTitle, projectImages);
        });
    });
}); 