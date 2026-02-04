import { renderHook, act, render, screen } from '@testing-library/react';
import { OrderProvider, useOrder } from './OrderContext';
import React, { useState } from 'react';

// Mock useToast with stable reference
const mockAddToast = jest.fn();
jest.mock('./ToastContext', () => ({
  useToast: () => ({
    addToast: mockAddToast,
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

  it('should not re-render consumers when provider parent re-renders if context value is unchanged', async () => {
      // Consumer component that tracks renders
      // We use React.memo to ensure it only re-renders if props or context change.
      const RenderCounter = React.memo(({ onRender }: { onRender: () => void }) => {
          useOrder(); // Consume context
          onRender();
          return <div>Render Counted</div>;
      });

      // Wrapper that renders OrderProvider directly to ensure it re-renders when state changes
      const WrapperWithProvider = ({ onRender }: { onRender: jest.Mock }) => {
          const [count, setCount] = useState(0);
          return (
              <div>
                  <button data-testid="force-render" onClick={() => setCount(c => c + 1)}>
                      Force Render {count}
                  </button>
                  <OrderProvider>
                      <RenderCounter onRender={onRender} />
                  </OrderProvider>
              </div>
          );
      };

      const renderSpy = jest.fn();

      render(
          <WrapperWithProvider onRender={renderSpy} />
      );

      // Wait for any initial effects (isInitialized)
      await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
      });

      const initialRenderCount = renderSpy.mock.calls.length;

      // Force re-render of parent
      const button = screen.getByTestId('force-render');
      await act(async () => {
          button.click();
      });

      const finalRenderCount = renderSpy.mock.calls.length;

      // With optimization: Consumer should not re-render.
      expect(finalRenderCount).toBe(initialRenderCount);
  });
});
