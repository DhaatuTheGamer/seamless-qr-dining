import { renderHook, act, render, screen, waitFor } from '@testing-library/react';
import { OrderProvider, useOrder } from './OrderContext';
import React, { useState } from 'react';
import { encryptData, decryptData } from '../utils/security';

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

describe('OrderContext Security Fix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should decrypt existing data from localStorage on initial mount', async () => {
    // Setup initial encrypted data in localStorage
    const initialOrders = [{ id: '1', items: [], status: 'pending', total: 0, timestamp: 123, tableId: 't1', isPaid: false }];
    const encryptedOrders = await encryptData(initialOrders);
    localStorageMock.setItem('orders', encryptedOrders);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OrderProvider>{children}</OrderProvider>
    );

    // Render the hook
    const { result } = renderHook(() => useOrder(), { wrapper });

    // Wait for initialization
    await waitFor(() => {
        expect(result.current.orders).toEqual(initialOrders);
    });
  });

  it('should fallback to plaintext data from localStorage if decryption fails (backward compatibility)', async () => {
    // Setup initial plaintext data in localStorage
    const initialOrders = [{ id: '1', items: [], status: 'pending', total: 0, timestamp: 123, tableId: 't1', isPaid: false }];
    localStorageMock.setItem('orders', JSON.stringify(initialOrders));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OrderProvider>{children}</OrderProvider>
    );

    // Render the hook
    const { result } = renderHook(() => useOrder(), { wrapper });

    // Wait for initialization
    await waitFor(() => {
        expect(result.current.orders).toEqual(initialOrders);
    });
  });

  it('should encrypt and persist new data after initialization', async () => {
     const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OrderProvider>{children}</OrderProvider>
    );

    const { result } = renderHook(() => useOrder(), { wrapper });

    // Wait for provider to initialize
    // We can check if an initial placeOrder works as proxy for initialization

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

    // Check if localStorage has been updated with encrypted data
    await waitFor(async () => {
        const encryptedValue = localStorageMock.getItem('orders');
        expect(encryptedValue).not.toBeNull();
        expect(encryptedValue).not.toContain('Burger'); // Should be encrypted

        const decrypted = await decryptData(encryptedValue!);
        expect(decrypted).toHaveLength(1);
        expect(decrypted[0].items[0].name).toBe('Burger');
    });
  });

  it('should not re-render consumers when provider parent re-renders if context value is unchanged', async () => {
      const RenderCounter = React.memo(({ onRender }: { onRender: () => void }) => {
          useOrder();
          onRender();
          return <div>Render Counted</div>;
      });

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

      render(<WrapperWithProvider onRender={renderSpy} />);

      // Wait for any initial effects
      await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
      });

      const initialRenderCount = renderSpy.mock.calls.length;

      const button = screen.getByTestId('force-render');
      await act(async () => {
          button.click();
      });

      expect(renderSpy.mock.calls.length).toBe(initialRenderCount);
  });
});
