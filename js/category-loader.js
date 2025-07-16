import DynamicGridManager from './dynamic-grid.js';

// Get the current category from the page URL
function getCurrentCategory() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page.replace('.html', '');
}

// Initialize the grid manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const category = getCurrentCategory();
    const gridManager = new DynamicGridManager('.projects-grid', category);
    
    // Optional: Add refresh button for manual updates
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-grid';
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshButton.title = 'Refresh Grid';
    
    refreshButton.addEventListener('click', () => {
        gridManager.loadContent();
    });
    
    document.querySelector('.category-header').appendChild(refreshButton);
}); 