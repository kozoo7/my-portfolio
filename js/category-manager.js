// Category Manager with pagination and caching
class CategoryManager {
    constructor() {
        this.cache = new Map();
        this.pageSize = 12; // Number of items per page
        this.currentCategory = null;
        this.currentPage = 1;
        this.loading = false;
        this.hasMore = true;
    }

    async loadCategory(categoryId, page = 1) {
        if (this.loading) return;
        
        this.loading = true;
        this.currentCategory = categoryId;
        this.currentPage = page;

        try {
            const cacheKey = `${categoryId}_${page}`;
            let data;

            // Check cache first
            if (this.cache.has(cacheKey)) {
                data = this.cache.get(cacheKey);
            } else {
                data = await this.fetchCategoryData(categoryId, page);
                this.cache.set(cacheKey, data);
                
                // Cache cleanup - keep only last 5 pages
                if (this.cache.size > 5) {
                    const oldestKey = Array.from(this.cache.keys())[0];
                    this.cache.delete(oldestKey);
                }
            }

            return this.processData(data);
        } catch (error) {
            console.error('Error loading category:', error);
            throw error;
        } finally {
            this.loading = false;
        }
    }

    async fetchCategoryData(categoryId, page) {
        // Simulate API call - replace with actual API endpoint
        const start = (page - 1) * this.pageSize;
        const response = await fetch(`/api/categories/${categoryId}?start=${start}&limit=${this.pageSize}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch category data');
        }

        const data = await response.json();
        this.hasMore = data.hasMore;
        return data;
    }

    processData(data) {
        // Process and format the data for display
        return {
            items: data.items.map(item => ({
                ...item,
                processed: true
            })),
            hasMore: this.hasMore
        };
    }

    async loadMore() {
        if (!this.hasMore || this.loading) return;
        
        const nextPage = this.currentPage + 1;
        const data = await this.loadCategory(this.currentCategory, nextPage);
        return data;
    }

    clearCache() {
        this.cache.clear();
    }

    getCacheSize() {
        return this.cache.size;
    }

    isLoading() {
        return this.loading;
    }

    hasMoreContent() {
        return this.hasMore;
    }
}

export default CategoryManager;
