import React from 'react';
import { useOrder } from '../../contexts/OrderContext';
import Drawer from '../Shared/Drawer';

/**
 * Props for the OrderHistory component.
 */
interface OrderHistoryProps {
    /** Callback to close the history view. */
    onClose: () => void;
}

/**
 * A side drawer component that displays the customer's order history.
 * Lists orders sorted by timestamp with their status, items, and payment details.
 *
 * @component
 * @example
 * <OrderHistory onClose={closeHistory} />
 *
 * @param {OrderHistoryProps} props - The component props.
 * @returns {JSX.Element} The rendered order history drawer.
 */
const OrderHistory: React.FC<OrderHistoryProps> = ({ onClose }) => {
    const { orders } = useOrder();

    // Sort orders by timestamp descending
    const sortedOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp);

    /**
     * Gets the CSS color classes for a given order status.
     * @param status - The order status.
     * @returns {string} The CSS classes string.
     */
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ready': return 'bg-green-100 text-green-800 border-green-200';
            case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'completed': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    /**
     * Gets the emoji icon for a given order status.
     * @param status - The order status.
     * @returns {string} The emoji icon.
     */
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'preparing': return '👨‍🍳';
            case 'ready': return '✅';
            case 'delivered': return '🚚';
            case 'completed': return '🏁';
            default: return '📦';
        }
    };

    return (
        <Drawer isOpen={true} onClose={onClose} title="Order History">
            <div className="space-y-6">
                {sortedOrders.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-60">
                        <span className="text-4xl mb-2">📜</span>
                        <p className="font-medium">No orders yet</p>
                    </div>
                ) : (
                    sortedOrders.map(order => (
                        <div key={order.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${getStatusColor(order.status)}`}>
                                    <span>{getStatusIcon(order.status)}</span>
                                    <span className="uppercase tracking-wider">{order.status}</span>
                                </span>
                                <span className="text-xs font-medium text-[var(--text-muted)]">
                                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="space-y-3 mb-4">
                                {order.items.map(item => (
                                    <div key={item.cartId} className="flex justify-between text-sm items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-[var(--primary)] bg-[var(--primary-light)]/20 w-6 h-6 flex items-center justify-center rounded-md text-xs">
                                                {item.quantity}x
                                            </span>
                                            <span className="text-[var(--secondary)] font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-[var(--text-muted)]">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center bg-gray-50/50 -mx-5 -mb-5 p-5">
                                <span className="text-sm font-medium text-[var(--text-muted)]">Total Amount</span>
                                <div className="flex items-center gap-3">
                                    {order.isPaid ? (
                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 tracking-wider">PAID</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 tracking-wider">UNPAID</span>
                                    )}
                                    <span className="font-heading font-bold text-xl text-[var(--secondary)]">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Drawer>
    );
};

export default OrderHistory;
