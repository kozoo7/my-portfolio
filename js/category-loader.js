import DynamicGridManager from './dynamic-grid.js';
import { imageOptimizer } from './image-optimizer.js';
import { videoOptimizer } from './video-optimizer.js';
import MasonryOptimizer from './masonry-optimizer.js';
import CategoryManager from './category-manager.js';

// Get the current category from the page URL
function getCurrentCategory() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page.replace('.html', '');
}

// Initialize the grid manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const category = getCurrentCategory();
    const projectsGrid = document.querySelector('.projects-grid');
    const loadingPlaceholder = document.querySelector('.loading-placeholder');
    
    // Initialize managers
    const categoryManager = new CategoryManager();
    const masonryOptimizer = new MasonryOptimizer(projectsGrid, {
        itemSelector: '.project-item',
        columnWidth: '.project-item',
        percentPosition: true,
        gutter: 20,
        transitionDuration: '0.3s'
    });
    
    // Initialize masonry
    masonryOptimizer.init();
    
    // Function to show/hide loading state
    const toggleLoading = (show) => {
        if (loadingPlaceholder) {
            loadingPlaceholder.style.display = show ? 'block' : 'none';
        }
    };
    
    // Function to load category content
    const loadCategoryContent = async (page = 1) => {
        try {
            toggleLoading(true);
            const data = await categoryManager.loadCategory(category, page);
            
            // Create and append new items
            data.items.forEach(item => {
                const element = createGridItem(item);
                projectsGrid.appendChild(element);
            });
            
            // Initialize optimizers for new content
            imageOptimizer.initContainer(projectsGrid);
            videoOptimizer.initContainer(projectsGrid);
            
            // Update masonry layout
            masonryOptimizer.layout();
            
            // Update infinite scroll status
            if (!data.hasMore) {
                observer.disconnect();
            }
            
        } catch (error) {
            console.error('Error loading category content:', error);
        } finally {
            toggleLoading(false);
        }
    };
    
    // Create grid item element
    const createGridItem = (item) => {
        const element = document.createElement('div');
        element.className = 'project-item';
        // Add your item HTML structure here
        return element;
    };
    
    // Initialize infinite scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !categoryManager.isLoading() && categoryManager.hasMoreContent()) {
                categoryManager.loadMore().then(data => {
                    if (data) {
                        data.items.forEach(item => {
                            const element = createGridItem(item);
                            projectsGrid.appendChild(element);
                        });
                        
                        // Initialize optimizers for new content
                        imageOptimizer.initContainer(projectsGrid);
                        videoOptimizer.initContainer(projectsGrid);
                        
                        // Update masonry layout
                        masonryOptimizer.layout();
                    }
                });
            }
        });
    }, {
        rootMargin: '200px',
    });
    
    // Observe the loading placeholder for infinite scroll
    if (loadingPlaceholder) {
        observer.observe(loadingPlaceholder);
    }
    
    // Initial load
    loadCategoryContent();
    
    // Optional: Add refresh button for manual updates
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-grid';
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshButton.title = 'Refresh Grid';
    
    refreshButton.addEventListener('click', async () => {
        categoryManager.clearCache();
        projectsGrid.innerHTML = '';
        await loadCategoryContent();
    });
    
    document.querySelector('.category-header').appendChild(refreshButton);
    
    // Clean up on page unload
    window.addEventListener('unload', () => {
        masonryOptimizer.destroy();
        observer.disconnect();
    });
});