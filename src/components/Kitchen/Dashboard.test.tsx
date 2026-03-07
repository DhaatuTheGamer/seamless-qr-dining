import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

let mockUseOrder = {
    orders: mockOrders,
    updateOrderStatus: jest.fn(),
};

jest.mock('../../contexts/OrderContext', () => ({
    useOrder: () => mockUseOrder,
}));

// Save original objects
const originalAudioContext = window.AudioContext;
const originalWebkitAudioContext = (window as any).webkitAudioContext;
const originalConsoleError = console.error;

describe('Dashboard Component', () => {
    beforeEach(() => {
        mockUseOrder = {
            orders: mockOrders,
            updateOrderStatus: jest.fn(),
        };
        console.error = jest.fn();

        // Setup default mock AudioContext
        Object.defineProperty(window, 'AudioContext', {
            writable: true,
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
    });

    afterEach(() => {
        console.error = originalConsoleError;
        Object.defineProperty(window, 'AudioContext', {
            writable: true,
            value: originalAudioContext,
        });
        Object.defineProperty(window, 'webkitAudioContext', {
            writable: true,
            value: originalWebkitAudioContext,
        });
        jest.clearAllMocks();
    });

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

    it('plays a notification sound when a new order is added', () => {
        const createOscillatorMock = jest.fn(() => ({
            connect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
            type: '',
            frequency: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
        }));

        const createGainMock = jest.fn(() => ({
            connect: jest.fn(),
            gain: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
        }));

        Object.defineProperty(window, 'AudioContext', {
            writable: true,
            value: jest.fn().mockImplementation(() => ({
                createOscillator: createOscillatorMock,
                createGain: createGainMock,
                currentTime: 0,
                destination: {},
            })),
        });

        // Start with empty orders
        mockUseOrder = {
            orders: [],
            updateOrderStatus: jest.fn(),
        };

        const { rerender } = render(<Dashboard />);

        // Add an order to trigger the sound
        mockUseOrder = {
            orders: [mockOrders[0]],
            updateOrderStatus: jest.fn(),
        };
        rerender(<Dashboard />);

        // The audio nodes should have been created
        expect(createOscillatorMock).toHaveBeenCalled();
        expect(createGainMock).toHaveBeenCalled();
    });

    it('handles AudioContext errors gracefully when playing notification sound', () => {
        // Mock AudioContext to throw an error when instantiated
        Object.defineProperty(window, 'AudioContext', {
            writable: true,
            value: jest.fn().mockImplementation(() => {
                throw new Error('AudioContext error');
            }),
        });

        // Start with empty orders
        mockUseOrder = {
            orders: [],
            updateOrderStatus: jest.fn(),
        };

        const { rerender } = render(<Dashboard />);

        // Trigger the effect by adding an order
        mockUseOrder = {
            orders: [mockOrders[0]],
            updateOrderStatus: jest.fn(),
        };
        rerender(<Dashboard />);

        // Verify error was caught and logged
        expect(console.error).toHaveBeenCalledWith('Audio play failed', expect.any(Error));
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('does nothing if AudioContext is not supported', () => {
        // Mock window to not have AudioContext
        Object.defineProperty(window, 'AudioContext', {
            writable: true,
            value: undefined,
        });
        Object.defineProperty(window, 'webkitAudioContext', {
            writable: true,
            value: undefined,
        });

        // Start with empty orders
        mockUseOrder = {
            orders: [],
            updateOrderStatus: jest.fn(),
        };

        const { rerender } = render(<Dashboard />);

        // Add an order
        mockUseOrder = {
            orders: [mockOrders[0]],
            updateOrderStatus: jest.fn(),
        };
        rerender(<Dashboard />);

        // Verify no error is logged
        expect(console.error).not.toHaveBeenCalled();
    });
});
