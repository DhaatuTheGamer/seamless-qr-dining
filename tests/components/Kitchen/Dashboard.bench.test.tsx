import { Order } from '../../../src/contexts/OrderContext';
import { groupOrdersByStatus } from '../../../src/components/Kitchen/Dashboard';

describe('Dashboard Performance Benchmark', () => {
    const generateOrders = (count: number): Order[] => {
        const statuses = ['pending', 'preparing', 'ready', 'delivered', 'completed'];
        return Array.from({ length: count }, (_, i) => ({
            id: `order-${i}`,
            tableId: '1',
            items: [],
            status: statuses[i % statuses.length] as any,
            timestamp: Date.now(),
            total: 10,
            isPaid: true
        }));
    };

    const orders = generateOrders(10000);

    test('Naive filtering (3 passes)', () => {
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
             orders.filter(o => o.status === 'pending');
             orders.filter(o => o.status === 'preparing' || o.status === 'ready');
             orders.filter(o => o.status === 'delivered' || o.status === 'completed');
        }
        const end = performance.now();
        console.log(`Naive approach time: ${(end - start).toFixed(2)}ms`);
    });

    test('Optimized filtering (1 pass)', () => {
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            groupOrdersByStatus(orders);
        }
        const end = performance.now();
        console.log(`Optimized approach time: ${(end - start).toFixed(2)}ms`);
    });
});
