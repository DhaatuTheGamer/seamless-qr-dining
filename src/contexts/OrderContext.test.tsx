import { renderHook, act } from '@testing-library/react';
import { OrderProvider, useOrder } from './OrderContext';
import React from 'react';

// Mock useToast
jest.mock('./ToastContext', () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('OrderContext Data Loss Bug', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should not overwrite existing data in localStorage on initial mount', () => {
    // Setup initial data in localStorage
    const initialOrders = [{ id: '1', items: [], status: 'pending', total: 0, timestamp: 123, tableId: 't1', isPaid: false }];
    localStorageMock.setItem('orders', JSON.stringify(initialOrders));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OrderProvider>{children}</OrderProvider>
    );

    // Render the hook
    renderHook(() => useOrder(), { wrapper });

    // Check localStorage calls
    const setItemCalls = (localStorageMock.setItem as jest.Mock).mock.calls;
    const ordersSetItemCalls = setItemCalls.filter(call => call[0] === 'orders');

    // Should verify that no call wrote '[]'
    const hasEmptyArrayWrite = ordersSetItemCalls.some(call => call[1] === '[]');
    expect(hasEmptyArrayWrite).toBe(false);

    // Should verify that orders are still in LS
    expect(localStorageMock.getItem('orders')).toEqual(JSON.stringify(initialOrders));
  });

  it('should persist new data after initialization', () => {
     const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OrderProvider>{children}</OrderProvider>
    );

    const { result } = renderHook(() => useOrder(), { wrapper });

    // Wait for initialization (in real app it's async, here effects run sync-ish but let's be safe)
    // Actually in JSDOM environment without timers, effects run after render.

    // Add item to cart and place order
    act(() => {
        result.current.addToCart({
            id: 'm1',
            name: 'Burger',
            description: 'desc',
            price: 10,
            category: 'mains',
            image: 'img',
            available: true
        }, 1);
    });

    act(() => {
        result.current.placeOrder('t1');
    });

    // Check if localStorage has been updated
    const savedOrders = JSON.parse(localStorageMock.getItem('orders') || '[]');
    expect(savedOrders).toHaveLength(1);
    expect(savedOrders[0].items[0].name).toBe('Burger');
  });
});
