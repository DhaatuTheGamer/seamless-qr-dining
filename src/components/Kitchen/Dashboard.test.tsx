import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';

// Mock the OrderContext
const mockOrders = [
    { id: 'order-1', status: 'pending', items: [{ name: 'Item 1', quantity: 1 }], timestamp: Date.now(), tableId: '1' },
    { id: 'order-2', status: 'preparing', items: [{ name: 'Item 2', quantity: 1 }], timestamp: Date.now(), tableId: '2' },
    { id: 'order-3', status: 'ready', items: [{ name: 'Item 3', quantity: 1 }], timestamp: Date.now(), tableId: '3' },
    { id: 'order-4', status: 'delivered', items: [{ name: 'Item 4', quantity: 1 }], timestamp: Date.now(), tableId: '4' },
    { id: 'order-5', status: 'completed', items: [{ name: 'Item 5', quantity: 1 }], timestamp: Date.now(), tableId: '5' },
];

jest.mock('../../contexts/OrderContext', () => ({
    useOrder: () => ({
        orders: mockOrders,
        updateOrderStatus: jest.fn(),
    }),
}));

// Mock window.AudioContext to avoid errors
Object.defineProperty(window, 'AudioContext', {
    value: jest.fn().mockImplementation(() => ({
        createOscillator: () => ({
            connect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
            type: '',
            frequency: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
        }),
        createGain: () => ({
            connect: jest.fn(),
            gain: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
        }),
        currentTime: 0,
        destination: {},
    })),
});

describe('Dashboard Component', () => {
    it('renders orders in the correct columns', () => {
        render(<Dashboard />);

        // Verify headers
        expect(screen.getByText('New Orders')).toBeInTheDocument();
        expect(screen.getByText('Active Orders')).toBeInTheDocument();
        expect(screen.getByText('Completed Orders')).toBeInTheDocument();

        // Verify order IDs are present (using regex to match "Order #...r-1")
        expect(screen.getByText(/Order #.*r-1/)).toBeInTheDocument(); // pending
        expect(screen.getByText(/Order #.*r-2/)).toBeInTheDocument(); // preparing
        expect(screen.getByText(/Order #.*r-3/)).toBeInTheDocument(); // ready
        expect(screen.getByText(/Order #.*r-4/)).toBeInTheDocument(); // delivered
        expect(screen.getByText(/Order #.*r-5/)).toBeInTheDocument(); // completed
    });
});
