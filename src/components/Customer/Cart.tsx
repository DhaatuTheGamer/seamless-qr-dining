import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import Drawer from '../Shared/Drawer';
import Button from '../Shared/Button';
import Modal from '../Shared/Modal';

interface CartProps {
    onClose: () => void;
    tableId: string;
}

const Cart: React.FC<CartProps> = ({ onClose, tableId }) => {
    const { cart, updateCartQuantity, placeOrder } = useOrder();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePlaceOrder = async (payNow: boolean) => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        placeOrder(tableId, user?.name, payNow);
        setOrderPlaced(true);
        setIsProcessing(false);
    };

    if (orderPlaced) {
        return (
            <Modal isOpen={true} onClose={onClose} title="Order Confirmed">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-[var(--success)]/10 rounded-full flex items-center justify-center mb-6 text-[var(--success)] animate-scale-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-[var(--secondary)] mb-3">Order Placed!</h2>
                    <p className="text-[var(--text-muted)] mb-10 leading-relaxed max-w-xs mx-auto">
                        Your order has been sent to the kitchen. We'll have it ready shortly.
                    </p>
                    <Button
                        onClick={onClose}
                        fullWidth
                        size="lg"
                        className="shadow-lg shadow-[var(--primary)]/20"
                    >
                        Back to Menu
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Drawer isOpen={true} onClose={onClose} title="Your Order">
            <div className="flex flex-col h-full">
                {/* Cart Items */}
                <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-60">
                            <div className="bg-gray-100 p-6 rounded-full mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="font-heading font-medium text-xl mb-2">Your cart is empty</p>
                            <p className="text-sm text-center max-w-[200px] mb-6">Looks like you haven't added anything yet.</p>
                            <Button variant="ghost" onClick={onClose} className="text-[var(--primary)] font-bold">Browse Menu</Button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.cartId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 transition-all hover:shadow-md hover:border-[var(--primary)]/30 group">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-[var(--secondary)] text-base line-clamp-1">{item.name}</h3>
                                            <span className="font-bold text-[var(--primary-dark)] text-base">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        {item.notes && <p className="text-xs text-[var(--text-muted)] italic line-clamp-1 bg-gray-50 p-1 rounded">"{item.notes}"</p>}
                                    </div>

                                    <div className="flex items-center justify-end mt-2">
                                        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                            <button
                                                onClick={() => updateCartQuantity(item.cartId, -1)}
                                                className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] transition-colors border border-gray-100"
                                            >
                                                {item.quantity === 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                ) : '-'}
                                            </button>
                                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item.cartId, 1)}
                                                className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] transition-colors border border-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[var(--text-muted)] font-medium">Total Amount</span>
                            <span className="text-4xl font-heading font-bold text-[var(--secondary)]">${total.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => handlePlaceOrder(false)}
                                disabled={isProcessing}
                                className="border-gray-300 hover:border-[var(--primary)]"
                            >
                                Pay Later
                            </Button>
                            <Button
                                onClick={() => handlePlaceOrder(true)}
                                disabled={isProcessing}
                                isLoading={isProcessing}
                                className="shadow-lg shadow-[var(--primary)]/30"
                            >
                                Pay Now
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    );
};

export default Cart;
