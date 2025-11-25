"use client";
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { MenuItem } from '../data/menu';
import { useToast } from './ToastContext';

export interface CartItem extends MenuItem {
    cartId: string;
    quantity: number;
    notes?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';

export interface Order {
    id: string;
    tableId: string;
    items: CartItem[];
    status: OrderStatus;
    timestamp: number;
    total: number;
    isPaid: boolean;
    customerName?: string;
}

export type ServiceRequestType = 'water' | 'bill' | 'help' | 'custom';

export interface ServiceRequest {
    id: string;
    tableId: string;
    type: ServiceRequestType;
    status: 'pending' | 'done';
    timestamp: number;
    message?: string;
}

interface OrderContextType {
    cart: CartItem[];
    orders: Order[];
    serviceRequests: ServiceRequest[];
    addToCart: (item: MenuItem, quantity: number, notes?: string) => void;
    removeFromCart: (cartId: string) => void;
    updateCartQuantity: (cartId: string, delta: number) => void;
    clearCart: () => void;
    placeOrder: (tableId: string, customerName?: string, payNow?: boolean) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    toggleOrderPayment: (orderId: string) => void;
    requestService: (tableId: string, type: ServiceRequestType, message?: string) => void;
    resolveServiceRequest: (requestId: string) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addToast } = useToast();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

    useEffect(() => {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        const savedRequests = localStorage.getItem('serviceRequests');
        if (savedRequests) setServiceRequests(JSON.parse(savedRequests));
    }, []);

    // Persist orders
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    // Persist service requests
    useEffect(() => {
        localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
    }, [serviceRequests]);

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

    const removeFromCart = (cartId: string) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const updateCartQuantity = (cartId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.cartId === cartId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const clearCart = () => setCart([]);

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

    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status } : order
        ));
        // Only show toast if it's a status update from kitchen (simulated here, but usually would be via socket/polling)
        // For this demo, we might not want to spam toasts if the user is the one doing it (e.g. kitchen view)
        // But since this context is shared, we can check if we are in kitchen view? 
        // Actually, let's just show toast.
        addToast(`Order #${orderId.substr(0, 4)} status: ${status}`, 'info');
    };

    const toggleOrderPayment = (orderId: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, isPaid: !order.isPaid } : order
        ));
    };

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
