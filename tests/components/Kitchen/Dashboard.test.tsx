import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Dashboard, { groupOrdersByStatus } from '../../../src/components/Kitchen/Dashboard';
import { OrderProvider } from '../../../src/contexts/OrderContext';
import { ToastProvider } from '../../../src/contexts/ToastContext';
import * as OrderContextModule from '../../../src/contexts/OrderContext';

// Mock audio API to prevent errors during test
beforeAll(() => {
    (window as any).AudioContext = jest.fn().mockImplementation(() => ({
        createOscillator: jest.fn(() => ({
            type: 'sine',
            frequency: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
            connect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn()
        })),
        createGain: jest.fn(() => ({
            gain: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
            connect: jest.fn()
        })),
        destination: {},
        currentTime: 0
    }));
});

const mockOrders: OrderContextModule.Order[] = [
    {
        id: '1',
        tableId: '5',
        items: [{ id: 'm1', name: 'Burger', description: 'desc', quantity: 2, price: 10, category: 'mains', image: '', available: true, cartId: 'c1' }],
        status: 'pending',
        timestamp: Date.now() - 60000, // 1 minute ago
        total: 20,
        isPaid: false
    },
    {
        id: '2',
        tableId: '3',
        items: [{ id: 'd1', name: 'Cake', description: 'desc', quantity: 1, price: 5, category: 'desserts', image: '', available: true, cartId: 'c2' }],
        status: 'preparing',
        timestamp: Date.now() - 120000, // 2 minutes ago
        total: 5,
        isPaid: false
    },
    {
        id: '3',
        tableId: '2',
        items: [{ id: 's1', name: 'Soup', description: 'desc', quantity: 1, price: 8, category: 'starters', image: '', available: true, cartId: 'c3' }],
        status: 'completed',
        timestamp: Date.now() - 300000, // 5 minutes ago
        total: 8,
        isPaid: true
    }
];

const mockUpdateOrderStatus = jest.fn();

// We need to mock useOrder to control the orders
jest.mock('../../../src/contexts/OrderContext', () => {
    const originalModule = jest.requireActual('../../../src/contexts/OrderContext');
    return {
        ...originalModule,
        useOrder: jest.fn()
    };
});

const mockUseOrder = OrderContextModule.useOrder as jest.Mock;

describe('Dashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseOrder.mockReturnValue({
            orders: mockOrders,
            updateOrderStatus: mockUpdateOrderStatus
        });
    });

    it('groups orders correctly by status', () => {
        const { newOrders, activeOrders, completedOrders } = groupOrdersByStatus(mockOrders);
        
        expect(newOrders).toHaveLength(1);
        expect(newOrders[0].id).toBe('1');
        
        expect(activeOrders).toHaveLength(1);
        expect(activeOrders[0].id).toBe('2');
        
        expect(completedOrders).toHaveLength(1);
        expect(completedOrders[0].id).toBe('3');
    });

    it('renders the dashboard with categorized orders', () => {
        render(
            <ToastProvider>
                <Dashboard />
            </ToastProvider>
        );

        // Check headers
        expect(screen.getByText('New Orders')).toBeInTheDocument();
        expect(screen.getByText('Active Orders')).toBeInTheDocument();
        expect(screen.getByText('Completed Orders')).toBeInTheDocument();

        // Check order numbers (using sliced IDs like in component)
        expect(screen.getByText('Order #1')).toBeInTheDocument();
        expect(screen.getByText('Order #2')).toBeInTheDocument();
        expect(screen.getByText('Order #3')).toBeInTheDocument();

        // Check item names render
        expect(screen.getByText('2x Burger')).toBeInTheDocument();
        expect(screen.getByText('1x Cake')).toBeInTheDocument();
        expect(screen.getByText('1x Soup')).toBeInTheDocument();
    });

    it('calls updateOrderStatus when Accept is clicked on new order', () => {
        render(
            <ToastProvider>
                <Dashboard />
            </ToastProvider>
        );

        const acceptBtn = screen.getByText('Accept');
        fireEvent.click(acceptBtn);

        expect(mockUpdateOrderStatus).toHaveBeenCalledWith('1', 'preparing');
    });

    it('calls updateOrderStatus when Mark Plated is clicked on preparing order', () => {
        render(
            <ToastProvider>
                <Dashboard />
            </ToastProvider>
        );

        const platedBtn = screen.getByText('Mark Plated');
        fireEvent.click(platedBtn);

        expect(mockUpdateOrderStatus).toHaveBeenCalledWith('2', 'ready');
    });

    it('renders ready orders and calls updateOrderStatus when Complete is clicked', () => {
        const readyOrder: OrderContextModule.Order = {
            id: '4',
            tableId: '1',
            items: [],
            status: 'ready',
            timestamp: Date.now(),
            total: 0,
            isPaid: false
        };
        
        mockUseOrder.mockReturnValue({
            orders: [...mockOrders, readyOrder],
            updateOrderStatus: mockUpdateOrderStatus
        });

        render(
            <ToastProvider>
                <Dashboard />
            </ToastProvider>
        );

        // Check if PLATED tag shows
        expect(screen.getByText('PLATED')).toBeInTheDocument();
        
        const completeBtn = screen.getByText('Complete');
        fireEvent.click(completeBtn);

        expect(mockUpdateOrderStatus).toHaveBeenCalledWith('4', 'delivered');
    });
    
    it('plays notification sound when a new order arrives', () => {
        const { rerender } = render(
            <ToastProvider>
                <Dashboard />
            </ToastProvider>
        );
        
        const newMockOrders = [...mockOrders, {
            id: 'new', tableId: '1', items: [], status: 'pending', timestamp: Date.now(), total: 0, isPaid: false
        } as OrderContextModule.Order];
        
        mockUseOrder.mockReturnValue({
            orders: newMockOrders,
            updateOrderStatus: mockUpdateOrderStatus
        });
        
        rerender(
            <ToastProvider>
                <Dashboard />
            </ToastProvider>
        );
        
        // At this point AudioContext should have been instantiated to play the sound
        expect((window as any).AudioContext).toHaveBeenCalled();
    });
});
