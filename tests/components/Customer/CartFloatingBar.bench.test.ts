
import { describe, it, expect } from '@jest/globals';

describe('CartFloatingBar Benchmark', () => {
    // Generate a large cart
    const generateCart = (size: number) => {
        return Array.from({ length: size }, (_, i) => ({
            id: `item-${i}`,
            name: `Item ${i}`,
            price: Math.random() * 100,
            quantity: Math.floor(Math.random() * 5) + 1,
            cartId: `cart-${i}`,
            description: 'description',
            category: 'category',
            available: true
        }));
    };

    const cartSize = 100000;
    const iterations = 100;
    const cart = generateCart(cartSize);

    it('benchmarks double reduce vs single reduce', () => {
        let doubleReduceTime = 0;
        let singleReduceTime = 0;

        // Warmup
        for (let i = 0; i < 10; i++) {
            cart.reduce((sum, item) => sum + item.quantity, 0);
            cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        // Measure Double Reduce (Current Implementation)
        const startDouble = performance.now();
        for (let i = 0; i < iterations; i++) {
            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            // preventing optimization by using values
            if (itemCount < 0 || totalAmount < 0) throw new Error("Impossible");
        }
        const endDouble = performance.now();
        doubleReduceTime = endDouble - startDouble;

        // Measure Single Reduce (Optimized Implementation)
        const startSingle = performance.now();
        for (let i = 0; i < iterations; i++) {
            const { itemCount, totalAmount } = cart.reduce(
                (acc, item) => {
                    acc.itemCount += item.quantity;
                    acc.totalAmount += item.price * item.quantity;
                    return acc;
                },
                { itemCount: 0, totalAmount: 0 }
            );
             // preventing optimization by using values
             if (itemCount < 0 || totalAmount < 0) throw new Error("Impossible");
        }
        const endSingle = performance.now();
        singleReduceTime = endSingle - startSingle;

        console.log(`\nBenchmark Results (${iterations} iterations, ${cartSize} items):`);
        console.log(`Double Reduce: ${doubleReduceTime.toFixed(2)}ms`);
        console.log(`Single Reduce: ${singleReduceTime.toFixed(2)}ms`);
        console.log(`Improvement: ${((doubleReduceTime - singleReduceTime) / doubleReduceTime * 100).toFixed(2)}%`);

        expect(singleReduceTime).toBeLessThan(doubleReduceTime);
    });
});
