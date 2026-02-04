import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cart from './Cart';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';

// Mock the contexts
jest.mock('../../contexts/OrderContext');
jest.mock('../../contexts/AuthContext');

describe('Cart', () => {
    const mockPlaceOrder = jest.fn();
    const mockUpdateCartQuantity = jest.fn();
    const mockRemoveFromCart = jest.fn();
    const mockOnClose = jest.fn();

    const mockCart = [
        {
            cartId: '1',
            id: 'item1',
            name: 'Test Item',
            price: 10,
            quantity: 1,
            description: 'Test Description',
            image: '/test.jpg',
            category: 'Test'
        }
    ];

    beforeEach(() => {
        (useOrder as jest.Mock).mockReturnValue({
            cart: mockCart,
            updateCartQuantity: mockUpdateCartQuantity,
            removeFromCart: mockRemoveFromCart,
            placeOrder: mockPlaceOrder,
        });

        (useAuth as jest.Mock).mockReturnValue({
            user: { name: 'Test User' },
        });

        mockPlaceOrder.mockClear();
    });

    it('should place order immediately when clicked', async () => {
        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        const checkoutButton = screen.getByText('Proceed to Checkout');

        fireEvent.click(checkoutButton);

        await waitFor(() => {
            expect(mockPlaceOrder).toHaveBeenCalledWith('table-1', 'Test User', true);
        });
    });
});
