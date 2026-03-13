import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from './Cart';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';

// Mock contexts
jest.mock('../../contexts/OrderContext', () => ({
    useOrder: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock Modal since it uses Portals which can be problematic in JSDOM
jest.mock('../Shared/Modal', () => {
    return ({ isOpen, children, title }: any) => {
        if (!isOpen) return null;
        return (
            <div data-testid="mock-modal">
                <h2>{title}</h2>
                {children}
            </div>
        );
    };
});

describe('Cart Component', () => {
    const mockOnClose = jest.fn();
    const mockUpdateCartQuantity = jest.fn();
    const mockPlaceOrder = jest.fn();
    const mockRemoveFromCart = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            user: { name: 'Test User' }
        });

        // Default OrderContext mock
        (useOrder as jest.Mock).mockReturnValue({
            cart: [],
            cartTotal: 0,
            updateCartQuantity: mockUpdateCartQuantity,
            placeOrder: mockPlaceOrder,
            removeFromCart: mockRemoveFromCart,
        });
    });

    it('renders empty cart correctly', () => {
        render(<Cart onClose={mockOnClose} tableId="table-1" />);
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
        expect(screen.getByText('Browse Menu')).toBeInTheDocument();

        // Proceed to Checkout should be disabled
        const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });
        expect(checkoutBtn).toBeDisabled();
    });

    it('renders cart items and totals correctly', () => {
        (useOrder as jest.Mock).mockReturnValue({
            cart: [
                { cartId: '1', name: 'Burger', description: 'Juicy burger', price: 10, quantity: 2, image: '/burger.jpg' },
                { cartId: '2', name: 'Fries', description: 'Crispy fries', price: 5, quantity: 1, image: '/fries.jpg', notes: 'No salt' }
            ],
            cartTotal: 25, // 10*2 + 5*1
            updateCartQuantity: mockUpdateCartQuantity,
            placeOrder: mockPlaceOrder,
            removeFromCart: mockRemoveFromCart,
        });

        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        expect(screen.getByText('Burger')).toBeInTheDocument();
        expect(screen.getByText('Fries')).toBeInTheDocument();
        expect(screen.getByText('Juicy burger')).toBeInTheDocument();
        expect(screen.getByText('"No salt"')).toBeInTheDocument();

        // 10*2 = 20, 5*1 = 5
        expect(screen.getByText('$20.00')).toBeInTheDocument();
        expect(screen.getByText('$5.00')).toBeInTheDocument();

        // Totals
        expect(screen.getByText('$25.00')).toBeInTheDocument(); // Subtotal
        expect(screen.getByText('$2.50')).toBeInTheDocument(); // Tax
        expect(screen.getByText('$27.50')).toBeInTheDocument(); // Total

        // Proceed to Checkout should be enabled
        const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });
        expect(checkoutBtn).not.toBeDisabled();
    });

    it('calls updateCartQuantity when increment/decrement buttons are clicked', () => {
        (useOrder as jest.Mock).mockReturnValue({
            cart: [{ cartId: '1', name: 'Burger', price: 10, quantity: 1, image: '/burger.jpg' }],
            cartTotal: 10,
            updateCartQuantity: mockUpdateCartQuantity,
            placeOrder: mockPlaceOrder,
            removeFromCart: mockRemoveFromCart,
        });

        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        const decrementBtn = screen.getByRole('button', { name: '-' });
        const incrementBtn = screen.getByRole('button', { name: '+' });

        fireEvent.click(decrementBtn);
        expect(mockUpdateCartQuantity).toHaveBeenCalledWith('1', -1);

        fireEvent.click(incrementBtn);
        expect(mockUpdateCartQuantity).toHaveBeenCalledWith('1', 1);
    });

    it('calls removeFromCart when remove button is clicked', () => {
        (useOrder as jest.Mock).mockReturnValue({
            cart: [{ cartId: '1', name: 'Burger', price: 10, quantity: 1, image: '/burger.jpg' }],
            cartTotal: 10,
            updateCartQuantity: mockUpdateCartQuantity,
            placeOrder: mockPlaceOrder,
            removeFromCart: mockRemoveFromCart,
        });

        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        const removeBtn = screen.getByRole('button', { name: /Remove/i });
        fireEvent.click(removeBtn);

        expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
    });

    it('allows changing payment method', () => {
        (useOrder as jest.Mock).mockReturnValue({
            cart: [{ cartId: '1', name: 'Burger', price: 10, quantity: 1, image: '/burger.jpg' }],
            cartTotal: 10,
            updateCartQuantity: mockUpdateCartQuantity,
            placeOrder: mockPlaceOrder,
            removeFromCart: mockRemoveFromCart,
        });

        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        const payLaterRadio = screen.getAllByRole('radio')[1]; // Second radio is "Pay Later"
        fireEvent.click(payLaterRadio);
        expect(payLaterRadio).toBeChecked();

        const payNowRadio = screen.getAllByRole('radio')[0];
        expect(payNowRadio).not.toBeChecked();
    });

    it('updates notes text area', () => {
        (useOrder as jest.Mock).mockReturnValue({
            cart: [{ cartId: '1', name: 'Burger', price: 10, quantity: 1, image: '/burger.jpg' }],
            cartTotal: 10,
            updateCartQuantity: mockUpdateCartQuantity,
            placeOrder: mockPlaceOrder,
            removeFromCart: mockRemoveFromCart,
        });

        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        const notesInput = screen.getByPlaceholderText('Add a note...');
        fireEvent.change(notesInput, { target: { value: 'Extra ketchup' } });

        expect(notesInput).toHaveValue('Extra ketchup');
    });

    it('places order and shows confirmation modal', async () => {
        jest.useFakeTimers();

        (useOrder as jest.Mock).mockReturnValue({
            cart: [{ cartId: '1', name: 'Burger', price: 10, quantity: 1, image: '/burger.jpg' }],
            cartTotal: 10,
            updateCartQuantity: mockUpdateCartQuantity,
            placeOrder: mockPlaceOrder,
            removeFromCart: mockRemoveFromCart,
        });

        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });

        fireEvent.click(checkoutBtn);

        // Before timer resolves
        expect(checkoutBtn).toBeDisabled(); // isProcessing is true

        // Advance timer for the simulated API call (1500ms)
        jest.advanceTimersByTime(1500);

        await waitFor(() => {
            expect(mockPlaceOrder).toHaveBeenCalledWith('table-1', 'Test User', true); // true for 'now' payment
            expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
            expect(screen.getByText('Order Confirmed')).toBeInTheDocument();
            expect(screen.getByText('Order Placed!')).toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    it('calls onClose when back buttons are clicked', () => {
        render(<Cart onClose={mockOnClose} tableId="table-1" />);

        const backBtn = screen.getAllByRole('button', { name: /Back to Menu/i })[0];
        fireEvent.click(backBtn);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
