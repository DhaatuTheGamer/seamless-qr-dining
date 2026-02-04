import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartFloatingBar from './CartFloatingBar';
import { useOrder } from '../../contexts/OrderContext';

// Mock the useOrder hook
jest.mock('../../contexts/OrderContext', () => ({
  useOrder: jest.fn(),
}));

describe('CartFloatingBar', () => {
  const mockOnOpenCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when cart is empty', () => {
    (useOrder as jest.Mock).mockReturnValue({
      cart: [],
    });

    render(<CartFloatingBar onOpenCart={mockOnOpenCart} />);
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders correctly when cart has items', () => {
    (useOrder as jest.Mock).mockReturnValue({
      cart: [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 1 },
      ],
    });

    render(<CartFloatingBar onOpenCart={mockOnOpenCart} />);

    // Check item count (2 + 1 = 3)
    expect(screen.getByText('3')).toBeInTheDocument();

    // Check total amount (10*2 + 5*1 = 25)
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  it('calls onOpenCart when clicked', () => {
    (useOrder as jest.Mock).mockReturnValue({
      cart: [{ price: 10, quantity: 1 }],
    });

    render(<CartFloatingBar onOpenCart={mockOnOpenCart} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnOpenCart).toHaveBeenCalledTimes(1);
  });
});
