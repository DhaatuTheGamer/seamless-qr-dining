import React, { useState } from 'react';
import type { MenuItem } from '../../data/menu';
import { useOrder } from '../../contexts/OrderContext';
import Modal from '../Shared/Modal';
import Button from '../Shared/Button';

interface ItemDetailProps {
    item: MenuItem;
    onClose: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose }) => {
    const { addToCart } = useOrder();
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');

    const handleAddToCart = () => {
        addToCart(item, quantity, notes);
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="flex flex-col">
                {/* Image Header */}
                <div className="relative h-56 -mx-6 -mt-6 mb-6 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                        <h2 className="text-2xl font-heading font-bold text-white drop-shadow-md">{item.name}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <p className="text-[var(--text-muted)] leading-relaxed">{item.description}</p>
                        <span className="text-2xl font-heading font-bold text-[var(--primary-dark)] ml-4 whitespace-nowrap">${item.price}</span>
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-xs font-bold text-[var(--secondary)] uppercase tracking-wider mb-2">Special Instructions</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. No onions, extra spicy..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none resize-none h-24 bg-gray-50 text-sm"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="font-bold text-[var(--secondary)]">Quantity</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                            >
                                -
                            </button>
                            <span className="text-xl font-heading font-bold w-8 text-center text-[var(--secondary)]">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <Button
                        onClick={handleAddToCart}
                        fullWidth
                        size="lg"
                        className="shadow-lg shadow-[var(--primary)]/30 flex justify-between items-center px-6"
                    >
                        <span>Add to Order</span>
                        <span className="bg-white/20 px-2 py-1 rounded text-sm">${(item.price * quantity).toFixed(2)}</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ItemDetail;
