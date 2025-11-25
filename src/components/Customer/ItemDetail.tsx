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
                <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden group">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-5 left-6 right-6">
                        <h2 className="text-3xl font-heading font-bold text-white drop-shadow-lg mb-1">{item.name}</h2>
                        <div className="flex gap-2">
                            {item.dietary?.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-wider rounded-full uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <p className="text-[var(--text-muted)] leading-relaxed text-base">{item.description}</p>
                        <span className="text-2xl font-heading font-bold text-[var(--primary-dark)] ml-4 whitespace-nowrap">${item.price}</span>
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-xs font-bold text-[var(--secondary)] uppercase tracking-wider mb-2">Special Instructions</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. No onions, extra spicy..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none resize-none h-24 bg-gray-50 text-sm transition-all"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="font-bold text-[var(--secondary)]">Quantity</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                            >
                                {quantity === 1 ? (
                                    <span className="text-gray-400 text-lg">−</span>
                                ) : (
                                    <span className="text-lg">−</span>
                                )}
                            </button>
                            <span className="text-xl font-heading font-bold w-8 text-center text-[var(--secondary)]">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                            >
                                <span className="text-lg">+</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <Button
                        onClick={handleAddToCart}
                        fullWidth
                        size="lg"
                        className="shadow-lg shadow-[var(--primary)]/30 flex justify-between items-center px-6 py-4"
                    >
                        <span className="font-bold tracking-wide">Add to Order</span>
                        <span className="bg-white/20 px-2.5 py-1 rounded-lg text-sm font-bold">${(item.price * quantity).toFixed(2)}</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ItemDetail;
