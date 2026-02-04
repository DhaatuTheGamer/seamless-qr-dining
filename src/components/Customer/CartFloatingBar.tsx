import React from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for the CartFloatingBar component.
 */
interface CartFloatingBarProps {
    /** Callback to open the cart view. */
    onOpenCart: () => void;
}

/**
 * A floating bar displayed at the bottom of the screen on mobile devices
 * when there are items in the cart. Shows the total item count and price.
 *
 * @component
 * @example
 * <CartFloatingBar onOpenCart={openCart} />
 *
 * @param {CartFloatingBarProps} props - The component props.
 * @returns {JSX.Element} The rendered floating bar component.
 */
const CartFloatingBar: React.FC<CartFloatingBarProps> = ({ onOpenCart }) => {
    const { cart } = useOrder();
    const { itemCount, totalAmount } = cart.reduce(
        (acc, item) => {
            acc.itemCount += item.quantity;
            acc.totalAmount += item.price * item.quantity;
            return acc;
        },
        { itemCount: 0, totalAmount: 0 }
    );

    return (
        <AnimatePresence>
            {itemCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
                >
                    <button
                        onClick={onOpenCart}
                        className="w-full bg-emerald-600 text-white p-4 rounded-xl shadow-lg shadow-emerald-600/30 flex justify-between items-center backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                                {itemCount}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-emerald-100 font-medium uppercase tracking-wider">Total</span>
                                <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 font-bold tracking-wide">
                            View Cart
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="M12 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartFloatingBar;
