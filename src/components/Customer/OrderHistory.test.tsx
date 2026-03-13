import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderHistory from './OrderHistory';
import { useOrder } from '../../contexts/OrderContext';

// Mock contexts
jest.mock('../../contexts/OrderContext', () => ({
    useOrder: jest.fn(),
}));

// Mock useBodyScrollLock
jest.mock('../../hooks/useBodyScrollLock', () => ({
    useBodyScrollLock: jest.fn(),
}));

// Mock Drawer
jest.mock('../Shared/Drawer', () => {
    return ({ isOpen, onClose, children, title }: any) => {
        if (!isOpen) return null;
        return (
            <div data-testid="mock-drawer">
                <button data-testid="close-drawer" onClick={onClose}>Close</button>
                <h2>{title}</h2>
                {children}
            </div>
        );
    };
});

describe('OrderHistory Component', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state when there are no orders', () => {
        (useOrder as jest.Mock).mockReturnValue({
            orders: [],
        });

        render(<OrderHistory onClose={mockOnClose} />);

        expect(screen.getByTestId('mock-drawer')).toBeInTheDocument();
        expect(screen.getByText('Order History')).toBeInTheDocument();
        expect(screen.getByText('No orders yet')).toBeInTheDocument();
        expect(screen.getByText('📜')).toBeInTheDocument();
    });

    it('renders orders correctly', () => {
        (useOrder as jest.Mock).mockReturnValue({
            orders: [
                {
                    id: 'order-1',
                    tableId: 'table-1',
                    items: [
                        { cartId: 'item-1', id: 'm1', name: 'Burger', description: 'desc', category: 'Mains', price: 10, quantity: 2 },
                    ],
                    status: 'pending',
                    timestamp: 1620000000000,
                    total: 20,
                    isPaid: false,
                },
                {
                    id: 'order-2',
                    tableId: 'table-1',
                    items: [
                        { cartId: 'item-2', id: 'm2', name: 'Fries', description: 'desc', category: 'Sides', price: 5, quantity: 1 },
                    ],
                    status: 'ready',
                    timestamp: 1620000000001,
                    total: 5,
                    isPaid: true,
                }
            ],
        });

        render(<OrderHistory onClose={mockOnClose} />);

        // Drawer
        expect(screen.getByText('Order History')).toBeInTheDocument();

        // Order 1
        expect(screen.getByText('Burger')).toBeInTheDocument();
        expect(screen.getByText('2x')).toBeInTheDocument();
        expect(screen.getAllByText('$20.00')[0]).toBeInTheDocument(); // Item price * quantity
        expect(screen.getAllByText('$20.00')[1]).toBeInTheDocument(); // Total amount
        expect(screen.getByText('UNPAID')).toBeInTheDocument();
        expect(screen.getByText('pending')).toBeInTheDocument();

        // Order 2
        expect(screen.getByText('Fries')).toBeInTheDocument();
        expect(screen.getByText('1x')).toBeInTheDocument();
        expect(screen.getAllByText('$5.00')[0]).toBeInTheDocument(); // Item price * quantity
        expect(screen.getAllByText('$5.00')[1]).toBeInTheDocument(); // Total amount
        expect(screen.getByText('PAID')).toBeInTheDocument();
        expect(screen.getByText('ready')).toBeInTheDocument();
    });

    it('sorts orders by timestamp descending', () => {
        const timestamp1 = 1620000000000; // earlier
        const timestamp2 = 1620000000001; // later

        (useOrder as jest.Mock).mockReturnValue({
            orders: [
                {
                    id: 'order-1',
                    tableId: 'table-1',
                    items: [
                        { cartId: 'item-1', id: 'm1', name: 'Burger', description: 'desc', category: 'Mains', price: 10, quantity: 2 },
                    ],
                    status: 'pending',
                    timestamp: timestamp1,
                    total: 20,
                    isPaid: false,
                },
                {
                    id: 'order-2',
                    tableId: 'table-1',
                    items: [
                        { cartId: 'item-2', id: 'm2', name: 'Fries', description: 'desc', category: 'Sides', price: 5, quantity: 1 },
                    ],
                    status: 'ready',
                    timestamp: timestamp2,
                    total: 5,
                    isPaid: true,
                }
            ],
        });

        const { container } = render(<OrderHistory onClose={mockOnClose} />);

        // The second order should be rendered first because it has a later timestamp
        const orderElements = container.querySelectorAll('.bg-white.p-5.rounded-xl');
        expect(orderElements.length).toBe(2);

        // Check the text content of the items to infer order
        expect(orderElements[0]).toHaveTextContent('ready'); // later timestamp
        expect(orderElements[0]).toHaveTextContent('Fries');

        expect(orderElements[1]).toHaveTextContent('pending'); // earlier timestamp
        expect(orderElements[1]).toHaveTextContent('Burger');
    });

    it('calls onClose when drawer close button is clicked', () => {
        (useOrder as jest.Mock).mockReturnValue({
            orders: [],
        });

        render(<OrderHistory onClose={mockOnClose} />);

        const closeBtn = screen.getByTestId('close-drawer');
        fireEvent.click(closeBtn);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('maps status to correct colors and icons', () => {
        (useOrder as jest.Mock).mockReturnValue({
            orders: [
                { id: '1', tableId: '1', items: [], status: 'pending', timestamp: 1, total: 0, isPaid: false },
                { id: '2', tableId: '1', items: [], status: 'preparing', timestamp: 2, total: 0, isPaid: false },
                { id: '3', tableId: '1', items: [], status: 'ready', timestamp: 3, total: 0, isPaid: false },
                { id: '4', tableId: '1', items: [], status: 'delivered', timestamp: 4, total: 0, isPaid: false },
                { id: '5', tableId: '1', items: [], status: 'completed', timestamp: 5, total: 0, isPaid: false },
                { id: '6', tableId: '1', items: [], status: 'unknown', timestamp: 6, total: 0, isPaid: false },
            ],
        });

        render(<OrderHistory onClose={mockOnClose} />);

        expect(screen.getByText('⏳')).toBeInTheDocument();
        expect(screen.getByText('👨‍🍳')).toBeInTheDocument();
        expect(screen.getByText('✅')).toBeInTheDocument();
        expect(screen.getByText('🚚')).toBeInTheDocument();
        expect(screen.getByText('🏁')).toBeInTheDocument();
        expect(screen.getByText('📦')).toBeInTheDocument();

        expect(screen.getByText('pending')).toBeInTheDocument();
        expect(screen.getByText('preparing')).toBeInTheDocument();
        expect(screen.getByText('ready')).toBeInTheDocument();
        expect(screen.getByText('delivered')).toBeInTheDocument();
        expect(screen.getByText('completed')).toBeInTheDocument();
        expect(screen.getByText('unknown')).toBeInTheDocument();
    });
});
