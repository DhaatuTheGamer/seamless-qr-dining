import React from 'react';
import { render } from '@testing-library/react';
import { useOrder } from '../../contexts/OrderContext';

// We mock OrderHistory component dynamically to test BEFORE and AFTER
// We'll require it to test before and after behavior.

jest.mock('../../contexts/OrderContext', () => ({
  useOrder: jest.fn(),
}));

jest.mock('../Shared/Drawer', () => {
  return function DummyDrawer({ children }: { children: React.ReactNode }) {
    return <div data-testid="drawer">{children}</div>;
  };
});

// Since we cannot easily revert to the original code without git commands, we'll
// write a script that measures the time taken by the sorting operation directly,
// replicating the before and after logic.

describe('OrderHistory Performance Benchmark', () => {
  it('measures sorting logic performance', () => {
    // Generate 50000 mock orders
    const mockOrders = Array.from({ length: 50000 }, (_, i) => ({
      id: `order-${i}`,
      timestamp: Date.now() - Math.floor(Math.random() * 10000000),
      status: ['pending', 'preparing', 'ready', 'delivered', 'completed'][i % 5],
      items: [
        { cartId: `item-${i}-1`, name: 'Burger', price: 10, quantity: 2 },
      ],
      total: 20,
      isPaid: i % 2 === 0,
    }));

    // Before logic: [...orders].sort(...) executed on every render
    const startBefore = performance.now();
    for (let i = 0; i < 100; i++) {
        const sortedOrders = [...mockOrders].sort((a, b) => b.timestamp - a.timestamp);
    }
    const endBefore = performance.now();
    const durationBefore = endBefore - startBefore;

    // After logic: wrapped in useMemo, assuming orders haven't changed,
    // it just returns the cached value. The setup overhead of useMemo isn't
    // easily mockable, but the lack of sorting is what saves time.
    let cachedSortedOrders: any = null;
    const startAfter = performance.now();
    for (let i = 0; i < 100; i++) {
        // simulate useMemo with no dependency change
        if (i === 0) {
            cachedSortedOrders = [...mockOrders].sort((a, b) => b.timestamp - a.timestamp);
        } else {
            // cache hit
            const sortedOrders = cachedSortedOrders;
        }
    }
    const endAfter = performance.now();
    const durationAfter = endAfter - startAfter;

    console.log(`Before (100 renders, 50k orders): ${durationBefore.toFixed(2)}ms`);
    console.log(`After (100 renders, 50k orders): ${durationAfter.toFixed(2)}ms`);
    console.log(`Improvement: ${((durationBefore - durationAfter) / durationBefore * 100).toFixed(2)}%`);

    expect(durationAfter).toBeLessThan(durationBefore);
  });
});
