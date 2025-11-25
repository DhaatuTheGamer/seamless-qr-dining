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
    const { cart, removeFromCart, updateCartQuantity, placeOrder } = useOrder();
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
                <div className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-[var(--secondary)] mb-2">Order Placed!</h2>
                    <p className="text-[var(--text-muted)] mb-8">Your order has been sent to the kitchen. We'll have it ready shortly.</p>
                    <Button
                        onClick={onClose}
                        fullWidth
                        size="lg"
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
                <div className="flex-1 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-60">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="font-medium">Your cart is empty</p>
                            <Button variant="ghost" onClick={onClose} className="mt-4">Browse Menu</Button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.cartId} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-[var(--secondary)] text-sm line-clamp-1">{item.name}</h3>
                                            <span className="font-bold text-[var(--primary-dark)] text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        {item.notes && <p className="text-xs text-[var(--text-muted)] italic line-clamp-1">"{item.notes}"</p>}
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateCartQuantity(item.cartId, -1)}
                                                className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                                            >
                                                {item.quantity === 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                ) : '-'}
                                            </button>
                                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item.cartId, 1)}
                                                className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
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
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[var(--text-muted)] font-medium">Total</span>
                            <span className="text-3xl font-heading font-bold text-[var(--secondary)]">${total.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => handlePlaceOrder(false)}
                                disabled={isProcessing}
                                className="border-gray-300"
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
