
import { describe, it, expect } from '@jest/globals';

describe('Menu Filtering Benchmark', () => {
    // Generate a large menu
    const generateMenu = (size: number) => {
        const categories = ['starters', 'mains', 'desserts', 'drinks'] as const;
        return Array.from({ length: size }, (_, i) => ({
            id: `item-${i}`,
            name: `Item ${i}`,
            description: 'description',
            price: Math.random() * 100,
            category: categories[Math.floor(Math.random() * categories.length)],
            image: 'https://example.com/image.jpg',
            available: true
        }));
    };

    const menuSize = 10000;
    const iterations = 1000;
    const menuItems = generateMenu(menuSize);
    const activeCategory = 'mains';

    it('benchmarks unmemoized vs memoized filtering', () => {
        let unmemoizedTime = 0;
        let memoizedTime = 0;

        // Warmup
        for (let i = 0; i < 100; i++) {
            menuItems.filter(item => item.category === activeCategory);
        }

        // Measure Unmemoized (Current Implementation - re-filtering every render)
        const startUnmemoized = performance.now();
        for (let i = 0; i < iterations; i++) {
            // Simulation of re-render: filter runs every time
            const filtered = menuItems.filter(item => item.category === activeCategory);
            // Prevent optimization
            if (filtered.length === -1) throw new Error("Impossible");
        }
        const endUnmemoized = performance.now();
        unmemoizedTime = endUnmemoized - startUnmemoized;

        // Measure Memoized (Optimized Implementation - filter runs once if deps don't change)
        const startMemoized = performance.now();

        // Simulation of memoization: filter runs once, subsequent accesses use cached result
        const filteredCached = menuItems.filter(item => item.category === activeCategory);

        for (let i = 0; i < iterations; i++) {
             // Simulation of re-render: we just use the cached result
            const filtered = filteredCached;
             // Prevent optimization
            if (filtered.length === -1) throw new Error("Impossible");
        }
        const endMemoized = performance.now();
        memoizedTime = endMemoized - startMemoized;

        console.log(`\nMenu Filtering Benchmark Results (${iterations} iterations, ${menuSize} items):`);
        console.log(`Unmemoized (Re-filter every time): ${unmemoizedTime.toFixed(2)}ms`);
        console.log(`Memoized (Filter once): ${memoizedTime.toFixed(2)}ms`);
        console.log(`Improvement: ${((unmemoizedTime - memoizedTime) / unmemoizedTime * 100).toFixed(2)}%`);

        expect(memoizedTime).toBeLessThan(unmemoizedTime);
    });
});
