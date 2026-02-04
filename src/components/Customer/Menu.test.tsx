import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Menu from './Menu';

// Mock dependencies
jest.mock('../../contexts/OrderContext', () => ({
    useOrder: () => ({
        isCartOpen: false,
        setIsCartOpen: jest.fn(),
    }),
}));

// Mock VirtualWaiter
jest.mock('./VirtualWaiter', () => () => <div data-testid="virtual-waiter">Virtual Waiter</div>);

// Mock CartFloatingBar
jest.mock('./CartFloatingBar', () => () => <div data-testid="cart-floating-bar">Cart Floating Bar</div>);

// Mock ItemDetail
jest.mock('./ItemDetail', () => () => <div data-testid="item-detail">Item Detail</div>);

// Mock OrderHistory
jest.mock('./OrderHistory', () => () => <div data-testid="order-history">Order History</div>);

describe('Menu Component Performance Optimization', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('shows content immediately without loading delay', () => {
        const { container } = render(<Menu tableId="t1" />);

        // Initially should NOT show skeleton
        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBe(0);

        // Should show menu items immediately
        expect(screen.getByText('Truffle Arancini')).toBeInTheDocument();
    });

    it('shows content immediately on category change', () => {
        const { container } = render(<Menu tableId="t1" />);

        // Click on 'Mains' category
        const mainsTab = screen.getByText('Mains');
        fireEvent.click(mainsTab);

        // Should NOT be loading
        expect(container.querySelectorAll('.animate-pulse').length).toBe(0);

        // Should show Mains items immediately
        expect(screen.getByText('Wagyu Beef Burger')).toBeInTheDocument();
    });
});
