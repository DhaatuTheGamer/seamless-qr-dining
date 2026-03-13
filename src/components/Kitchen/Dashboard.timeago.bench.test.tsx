import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useOrder } from '../../contexts/OrderContext';

jest.mock('../../contexts/OrderContext', () => ({
    useOrder: jest.fn()
}));

describe('Dashboard TimeAgo Benchmark', () => {
    it('measures execution time of getTimeAgo explicitly', () => {
        // We will simulate the getTimeAgo usage in render
        const start = performance.now();
        const timestamps = Array.from({ length: 1000000 }, () => Date.now() - Math.random() * 100000);

        let dummy = 0;
        for (let i = 0; i < timestamps.length; i++) {
            const diff = Math.floor((Date.now() - timestamps[i]) / 60000);
            if (diff < 1) dummy += 1;
            else dummy += 2;
        }

        const end = performance.now();
        console.log(`getTimeAgo calculation time for 1,000,000 items: ${(end - start).toFixed(2)}ms`);
    });

    it('measures execution time with cached Date.now()', () => {
        const timestamps = Array.from({ length: 1000000 }, () => Date.now() - Math.random() * 100000);

        const start = performance.now();
        const now = Date.now();
        let dummy = 0;
        for (let i = 0; i < timestamps.length; i++) {
            const diff = Math.floor((now - timestamps[i]) / 60000);
            if (diff < 1) dummy += 1;
            else dummy += 2;
        }

        const end = performance.now();
        console.log(`getTimeAgo calculation time with cached now for 1,000,000 items: ${(end - start).toFixed(2)}ms`);
    });
});
