// Performance Monitoring Utility
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fcp: null,    // First Contentful Paint
            lcp: null,    // Largest Contentful Paint
            fid: null,    // First Input Delay
            cls: null,    // Cumulative Layout Shift
            ttfb: null    // Time to First Byte
        };
        
        this.initialize();
    }

    initialize() {
        // Observe First Contentful Paint
        this.observeFCP();
        
        // Observe Largest Contentful Paint
        this.observeLCP();
        
        // Observe First Input Delay
        this.observeFID();
        
        // Observe Cumulative Layout Shift
        this.observeCLS();
        
        // Measure TTFB
        this.measureTTFB();
        
        // Report metrics when page unloads
        window.addEventListener('unload', () => this.reportMetrics());
    }

    observeFCP() {
        const fcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            if (entries.length > 0) {
                this.metrics.fcp = entries[0].startTime;
                this.logMetric('FCP', this.metrics.fcp);
            }
        });
        
        fcpObserver.observe({ entryTypes: ['paint'] });
    }

    observeLCP() {
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.logMetric('LCP', this.metrics.lcp);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    observeFID() {
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            if (entries.length > 0) {
                this.metrics.fid = entries[0].processingStart - entries[0].startTime;
                this.logMetric('FID', this.metrics.fid);
            }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
    }

    observeCLS() {
        let clsValue = 0;
        let clsEntries = [];

        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            }
            
            this.metrics.cls = clsValue;
            this.logMetric('CLS', clsValue);
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    measureTTFB() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
            this.logMetric('TTFB', this.metrics.ttfb);
        }
    }

    logMetric(name, value) {
        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.log(`${name}: ${value}`);
        }
        
        // Send to Google Analytics
        if (window.gtag) {
            gtag('event', 'performance_metric', {
                metric_name: name,
                value: value
            });
        }
    }

    async reportMetrics() {
        try {
            const response = await fetch('/api/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.metrics)
            });
            
            if (!response.ok) {
                throw new Error('Failed to report metrics');
            }
        } catch (error) {
            console.error('Error reporting metrics:', error);
        }
    }

    // Get current metrics
    getMetrics() {
        return { ...this.metrics };
    }

    // Check if performance meets thresholds
    checkPerformance() {
        const thresholds = {
            fcp: 2000,  // 2 seconds
            lcp: 2500,  // 2.5 seconds
            fid: 100,   // 100 milliseconds
            cls: 0.1,   // 0.1 threshold
            ttfb: 600   // 600 milliseconds
        };

        const results = {};
        for (const [metric, value] of Object.entries(this.metrics)) {
            if (value !== null) {
                results[metric] = {
                    value: value,
                    passes: value <= thresholds[metric],
                    threshold: thresholds[metric]
                };
            }
        }

        return results;
    }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
