"use client";
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { MenuItem } from '../data/menu';
import { useToast } from './ToastContext';

/**
 * Represents an item in the shopping cart.
 * Extends MenuItem with quantity and specific cart details.
 */
export interface CartItem extends MenuItem {
    /** Unique identifier for this item in the cart. */
    cartId: string;
    /** The number of this item ordered. */
    quantity: number;
    /** Special instructions or notes for this item. */
    notes?: string;
}

/**
 * Possible statuses for an order.
 */
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';

/**
 * Represents a placed order.
 */
export interface Order {
    /** Unique identifier for the order. */
    id: string;
    /** Identifier for the table where the order was placed. */
    tableId: string;
    /** List of items included in the order. */
    items: CartItem[];
    /** Current status of the order. */
    status: OrderStatus;
    /** Timestamp when the order was placed (in milliseconds). */
    timestamp: number;
    /** Total cost of the order. */
    total: number;
    /** Whether the order has been paid for. */
    isPaid: boolean;
    /** Name of the customer who placed the order (optional). */
    customerName?: string;
}

/**
 * Types of service requests a customer can make.
 */
export type ServiceRequestType = 'water' | 'bill' | 'help' | 'custom';

/**
 * Represents a service request from a table.
 */
export interface ServiceRequest {
    /** Unique identifier for the service request. */
    id: string;
    /** Identifier for the table making the request. */
    tableId: string;
    /** The type of service requested. */
    type: ServiceRequestType;
    /** Status of the request. */
    status: 'pending' | 'done';
    /** Timestamp when the request was made. */
    timestamp: number;
    /** Optional message or details for the request. */
    message?: string;
}

/**
 * Defines the shape of the OrderContext.
 */
interface OrderContextType {
    /** Current items in the cart. */
    cart: CartItem[];
    /** List of all orders. */
    orders: Order[];
    /** List of active service requests. */
    serviceRequests: ServiceRequest[];
    /**
     * Adds an item to the cart.
     * @param item - The menu item to add.
     * @param quantity - The quantity to add.
     * @param notes - Optional notes for the item.
     */
    addToCart: (item: MenuItem, quantity: number, notes?: string) => void;
    /**
     * Removes an item from the cart.
     * @param cartId - The unique cart ID of the item to remove.
     */
    removeFromCart: (cartId: string) => void;
    /**
     * Updates the quantity of an item in the cart.
     * @param cartId - The unique cart ID of the item.
     * @param delta - The amount to change the quantity by (e.g., +1 or -1).
     */
    updateCartQuantity: (cartId: string, delta: number) => void;
    /**
     * Clears all items from the cart.
     */
    clearCart: () => void;
    /**
     * Places an order with the current cart items.
     * @param tableId - The table ID for the order.
     * @param customerName - Optional customer name.
     * @param payNow - Whether the order is paid immediately.
     */
    placeOrder: (tableId: string, customerName?: string, payNow?: boolean) => void;
    /**
     * Updates the status of an existing order.
     * @param orderId - The ID of the order to update.
     * @param status - The new status.
     */
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    /**
     * Toggles the payment status of an order.
     * @param orderId - The ID of the order.
     */
    toggleOrderPayment: (orderId: string) => void;
    /**
     * Creates a new service request.
     * @param tableId - The table ID making the request.
     * @param type - The type of request.
     * @param message - Optional message.
     */
    requestService: (tableId: string, type: ServiceRequestType, message?: string) => void;
    /**
     * Marks a service request as resolved/done.
     * @param requestId - The ID of the request to resolve.
     */
    resolveServiceRequest: (requestId: string) => void;
    /** Whether the cart sidebar is currently open. */
    isCartOpen: boolean;
    /**
     * Sets the visibility of the cart sidebar.
     * @param isOpen - True to open, false to close.
     */
    setIsCartOpen: (isOpen: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Hook to access the order context.
 *
 * @returns {OrderContextType} The order context value.
 * @throws {Error} If used outside of an OrderProvider.
 */
export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

/**
 * Provider component for the OrderContext.
 * Manages cart, orders, and service requests state.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Child components.
 * @returns {JSX.Element} The provider component.
 */
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addToast } = useToast();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        const savedRequests = localStorage.getItem('serviceRequests');
        if (savedRequests) setServiceRequests(JSON.parse(savedRequests));

        setIsInitialized(true);
    }, []);

    // Persist orders
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }, [orders, isInitialized]);

    // Persist service requests
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
        }
    }, [serviceRequests, isInitialized]);

    // Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'orders' && e.newValue) {
                setOrders(JSON.parse(e.newValue));
            }
            if (e.key === 'serviceRequests' && e.newValue) {
                setServiceRequests(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    const [isCartOpen, setIsCartOpen] = useState(false);

    /**
     * Adds a menu item to the cart.
     * @param item - The item to add.
     * @param quantity - The quantity.
     * @param notes - Special instructions.
     */
    const addToCart = (item: MenuItem, quantity: number, notes?: string) => {
        const newItem: CartItem = {
            ...item,
            cartId: Math.random().toString(36).substr(2, 9),
            quantity,
            notes
        };
        setCart(prev => [...prev, newItem]);
        addToast(`Added ${quantity}x ${item.name} to cart`, 'success');
    };

    /**
     * Removes an item from the cart.
     * @param cartId - The unique cart ID.
     */
    const removeFromCart = (cartId: string) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    /**
     * Updates the quantity of a cart item.
     * @param cartId - The unique cart ID.
     * @param delta - The change in quantity.
     */
    const updateCartQuantity = (cartId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.cartId === cartId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    /** Clears the cart. */
    const clearCart = () => setCart([]);

    /**
     * Places a new order.
     * @param tableId - Table identifier.
     * @param customerName - Name of the customer.
     * @param payNow - If true, marks as paid.
     */
    const placeOrder = (tableId: string, customerName?: string, payNow: boolean = false) => {
        if (cart.length === 0) return;

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 9),
            tableId,
            items: [...cart],
            status: 'pending',
            timestamp: Date.now(),
            total,
            isPaid: payNow,
            customerName
        };

        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        addToast('Order placed successfully!', 'success');
    };

    /**
     * Updates an order's status.
     * @param orderId - The order ID.
     * @param status - The new status.
     */
    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status } : order
        ));
        addToast(`Order #${orderId.substr(0, 4)} status: ${status}`, 'info');
    };

    /**
     * Toggles whether an order is paid.
     * @param orderId - The order ID.
     */
    const toggleOrderPayment = (orderId: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, isPaid: !order.isPaid } : order
        ));
    };

    /**
     * Creates a service request.
     * @param tableId - The table ID.
     * @param type - Request type.
     * @param message - Optional message.
     */
    const requestService = (tableId: string, type: ServiceRequestType, message?: string) => {
        const newRequest: ServiceRequest = {
            id: Math.random().toString(36).substr(2, 9),
            tableId,
            type,
            status: 'pending',
            timestamp: Date.now(),
            message
        };
        setServiceRequests(prev => [newRequest, ...prev]);
        addToast('Service request sent', 'info');
    };

    /**
     * Resolves a service request.
     * @param requestId - The request ID.
     */
    const resolveServiceRequest = (requestId: string) => {
        setServiceRequests(prev => prev.filter(req => req.id !== requestId));
    };

    return (
        <OrderContext.Provider value={{
            cart,
            orders,
            serviceRequests,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            placeOrder,
            updateOrderStatus,
            toggleOrderPayment,
            requestService,
            resolveServiceRequest,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </OrderContext.Provider>
    );
};
