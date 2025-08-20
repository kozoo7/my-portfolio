// Blog functionality
class BlogManager {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentCategory = 'all';
        this.isLoading = false;
        
        this.initialize();
    }

    initialize() {
        // Initialize category filters
        this.initializeFilters();
        
        // Initialize load more functionality
        this.initializeLoadMore();
        
        // Initialize newsletter form
        this.initializeNewsletter();
    }

    initializeFilters() {
        const filters = document.querySelectorAll('.category-filter');
        
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Remove active class from all filters
                filters.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked filter
                filter.classList.add('active');
                
                // Update current category
                this.currentCategory = filter.dataset.category;
                
                // Reset pagination
                this.currentPage = 1;
                
                // Filter posts
                this.filterPosts();
            });
        });
    }

    filterPosts() {
        const posts = document.querySelectorAll('.blog-post');
        const category = this.currentCategory;
        
        posts.forEach(post => {
            if (category === 'all' || post.dataset.category === category) {
                post.style.display = '';
                post.style.animation = 'fadeInUp 0.6s ease both';
            } else {
                post.style.display = 'none';
            }
        });
        
        // Update load more button visibility
        this.updateLoadMoreButton();
    }

    initializeLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', async () => {
            if (this.isLoading) return;
            
            this.isLoading = true;
            loadMoreBtn.textContent = 'Loading...';
            
            try {
                await this.loadMorePosts();
                this.currentPage++;
                this.updateLoadMoreButton();
            } catch (error) {
                console.error('Error loading more posts:', error);
            } finally {
                this.isLoading = false;
                loadMoreBtn.textContent = 'Load More Posts';
            }
        });
    }

    async loadMorePosts() {
        // Simulate loading more posts
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you would fetch posts from an API
        const newPosts = this.generateDummyPosts();
        
        // Add new posts to the grid
        const postsContainer = document.querySelector('.blog-posts');
        newPosts.forEach(post => {
            postsContainer.insertAdjacentHTML('beforeend', post);
        });
        
        // Initialize lazy loading for new images
        this.initializeLazyLoading();
    }

    generateDummyPosts() {
        // This would be replaced with actual post data from an API
        return [
            `<article class="blog-post" data-category="tutorials">
                <div class="post-image">
                    <img src="images/blog/tutorial-2.jpg" alt="Design Tutorial" loading="lazy">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-category">Tutorial</span>
                        <span class="post-date">March 5, 2024</span>
                    </div>
                    <h2 class="post-title">Mastering Logo Animation in After Effects</h2>
                    <p class="post-excerpt">Step-by-step guide to creating professional logo animations.</p>
                    <a href="blog/logo-animation-tutorial.html" class="read-more">Read Tutorial →</a>
                </div>
            </article>`
        ];
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        // In a real implementation, check if there are more posts to load
        const hasMorePosts = this.currentPage < 3; // Example condition
        loadMoreBtn.style.display = hasMorePosts ? '' : 'none';
    }

    initializeNewsletter() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button');
            const email = emailInput.value;
            
            if (!email) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            try {
                // In a real implementation, send to your newsletter service
                await this.subscribeToNewsletter(email);
                
                // Show success message
                this.showMessage('Successfully subscribed to the newsletter!', 'success');
                form.reset();
            } catch (error) {
                this.showMessage('Failed to subscribe. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subscribe';
            }
        });
    }

    async subscribeToNewsletter(email) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, integrate with your newsletter service
        console.log('Subscribed:', email);
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        const container = document.querySelector('.newsletter-content');
        container.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    initializeLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize blog functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});
