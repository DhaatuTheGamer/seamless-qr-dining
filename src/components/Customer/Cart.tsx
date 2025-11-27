import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Shared/Button';
import Modal from '../Shared/Modal';

interface CartProps {
    onClose: () => void;
    tableId: string;
}

const Cart: React.FC<CartProps> = ({ onClose, tableId }) => {
    const { cart, updateCartQuantity, placeOrder, removeFromCart } = useOrder();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'now' | 'later'>('now');
    const [notes, setNotes] = useState('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.1; // 10% tax
    const finalTotal = total + tax;

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        placeOrder(tableId, user?.name, paymentMethod === 'now');
        setOrderPlaced(true);
        setIsProcessing(false);
    };

    if (orderPlaced) {
        return (
            <Modal isOpen={true} onClose={onClose} title="Order Confirmed">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 animate-scale-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-[#3d312e] mb-3">Order Placed!</h2>
                    <p className="text-gray-500 mb-10 leading-relaxed max-w-xs mx-auto">
                        Your order has been sent to the kitchen. We'll have it ready shortly.
                    </p>
                    <Button
                        onClick={onClose}
                        fullWidth
                        size="lg"
                        className="bg-[#a0522d] hover:bg-[#8b4513] text-white shadow-lg shadow-[#a0522d]/20"
                    >
                        Back to Menu
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#a0522d]">Seamless Dining</h1>
                    <button onClick={onClose} className="text-gray-500 hover:text-[#a0522d] font-medium">
                        Back to Menu
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-[#3d312e] mb-6">Customer Order Summary & Checkout</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-[#3d312e] mb-6">Your Order</h3>

                            {cart.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <p>Your cart is empty</p>
                                    <Button variant="ghost" onClick={onClose} className="mt-4 text-[#a0522d]">Browse Menu</Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map(item => (
                                        <div key={item.cartId} className="flex gap-4 items-center pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-[#3d312e] text-lg">{item.name}</h4>
                                                <p className="text-sm text-gray-400 line-clamp-1">{item.description}</p>
                                                {item.notes && <p className="text-xs text-[#a0522d] mt-1 italic">"{item.notes}"</p>}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-[#3d312e] text-lg mb-2">${(item.price * item.quantity).toFixed(2)}</div>
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateCartQuantity(item.cartId, -1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#a0522d]"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartQuantity(item.cartId, 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#a0522d]"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.cartId)}
                                                    className="text-red-400 text-xs mt-2 hover:text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {cart.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Tax (10%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold text-[#3d312e] pt-2">
                                        <span>Total</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            className="border-[#a0522d] text-[#a0522d] hover:bg-[#a0522d]/5 w-40"
                        >
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                Call Staff
                            </span>
                        </Button>
                    </div>

                    {/* Right Column: Payment & Instructions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-[#3d312e] mb-6">Payment Options</h3>

                            <div className="space-y-4">
                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'now' ? 'border-[#a0522d] bg-[#a0522d]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'now'} onChange={() => setPaymentMethod('now')} />
                                    <div className="w-10 h-10 rounded-lg bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[#3d312e]">Pay Now</div>
                                        <div className="text-xs text-gray-500">Credit Card, Apple Pay</div>
                                    </div>
                                    {paymentMethod === 'now' && <div className="w-4 h-4 rounded-full bg-[#a0522d]"></div>}
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'later' ? 'border-[#a0522d] bg-[#a0522d]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'later'} onChange={() => setPaymentMethod('later')} />
                                    <div className="w-10 h-10 rounded-lg bg-[#e3f2fd] text-[#1565c0] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-[#3d312e]">Pay Later</div>
                                        <div className="text-xs text-gray-500">Cash or Card at Counter</div>
                                    </div>
                                    {paymentMethod === 'later' && <div className="w-4 h-4 rounded-full bg-[#a0522d]"></div>}
                                </label>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-[#3d312e] mb-4">Special Instructions</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add a note..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#a0522d] focus:ring-2 focus:ring-[#a0522d]/20 outline-none resize-none h-32 text-sm bg-gray-50"
                            />
                        </div>

                        <Button
                            onClick={handlePlaceOrder}
                            fullWidth
                            size="lg"
                            disabled={cart.length === 0 || isProcessing}
                            isLoading={isProcessing}
                            className="bg-[#a0522d] hover:bg-[#8b4513] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#a0522d]/20"
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
