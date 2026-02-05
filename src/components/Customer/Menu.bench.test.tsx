import React from 'react';
import { render, screen } from '@testing-library/react';
import Menu from './Menu';

// Mock the OrderContext
jest.mock('../../contexts/OrderContext', () => ({
  useOrder: () => ({
    isCartOpen: false,
    setIsCartOpen: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

// Mock child components that are not the focus of this benchmark
jest.mock('./VirtualWaiter', () => () => <div data-testid="virtual-waiter" />);
jest.mock('./CartFloatingBar', () => () => <div data-testid="cart-floating-bar" />);
jest.mock('./ItemDetail', () => () => <div data-testid="item-detail" />);
jest.mock('./OrderHistory', () => () => <div data-testid="order-history" />);
jest.mock('./Cart', () => () => <div data-testid="cart" />);

describe('Menu Performance Benchmark', () => {
  it('measures time to render menu items', async () => {
    const start = performance.now();

    render(<Menu tableId="table-1" />);

    // "Truffle Arancini" is a starter item that should appear
    await screen.findByText('Truffle Arancini');

    const end = performance.now();
    const duration = end - start;

    console.log(`\nMenu Render Time: ${duration.toFixed(2)}ms`);
  });
});
