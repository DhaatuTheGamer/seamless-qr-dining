import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import type { MenuItem } from '../../data/menu';
import { useOrder } from '../../contexts/OrderContext';
import Modal from '../Shared/Modal';
import Button from '../Shared/Button';

/**
 * Props for the ItemDetail component.
 */
interface ItemDetailProps {
    /** The menu item to display details for. */
    item: MenuItem;
    /** Callback to close the detail view. */
    onClose: () => void;
}

/**
 * A modal component that displays detailed information about a menu item.
 * Allows users to select options dynamically if available, quantity, and add notes before adding to cart.
 *
 * @component
 * @example
 * <ItemDetail item={selectedItem} onClose={closeDetail} />
 *
 * @param {ItemDetailProps} props - The component props.
 * @returns {JSX.Element} The rendered item detail modal.
 */
const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose }) => {
    const { addToCart } = useOrder();
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    
    // Initialize selected options. For select, pick the first one by default. For checkbox, start empty.
    const initialOptions = useMemo(() => {
        const init: Record<string, string[]> = {};
        if (item.options) {
            item.options.forEach(opt => {
                if (opt.type === 'select' && opt.choices.length > 0) {
                    init[opt.id] = [opt.choices[0].name];
                } else {
                    init[opt.id] = [];
                }
            });
        }
        return init;
    }, [item.options]);

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(initialOptions);

    /**
     * Handles changing a specific option selection.
     */
    const handleOptionSelect = (optionId: string, choiceName: string, type: 'select' | 'checkbox') => {
        setSelectedOptions(prev => {
            if (type === 'select') {
                return { ...prev, [optionId]: [choiceName] };
            } else {
                const current = prev[optionId] || [];
                if (current.includes(choiceName)) {
                    return { ...prev, [optionId]: current.filter(c => c !== choiceName) };
                } else {
                    return { ...prev, [optionId]: [...current, choiceName] };
                }
            }
        });
    };

    /**
     * Calculates the total extra price from selected options.
     */
    const extraPrice = useMemo(() => {
        let total = 0;
        if (item.options) {
            item.options.forEach(opt => {
                const selected = selectedOptions[opt.id] || [];
                selected.forEach(sel => {
                    const choice = opt.choices.find(c => c.name === sel);
                    if (choice && choice.price) {
                        total += choice.price;
                    }
                });
            });
        }
        return total;
    }, [item.options, selectedOptions]);

    /**
     * Handles adding the configured item to the cart.
     * Combines options into a single notes string.
     */
    const handleAddToCart = () => {
        const optionsList = Object.entries(selectedOptions)
            .filter(([_, selected]) => selected.length > 0)
            .map(([optId, selected]) => {
                const opt = item.options?.find(o => o.id === optId);
                return `${opt?.name}: ${selected.join(', ')}`;
            });
        
        let notesWithOptions = optionsList.join(' | ');
        if (notes.trim()) {
            notesWithOptions += notesWithOptions ? `. Notes: ${notes}` : `Notes: ${notes}`;
        }

        // Create a custom item to hold the calculated price if there are extra costs
        const itemWithExtraPrice = { ...item, price: item.price + extraPrice };

        addToCart(itemWithExtraPrice, quantity, notesWithOptions);
        onClose();
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            className="backdrop-blur-md"
            panelClassName="bg-[#1a1a1a] text-white w-full max-w-md rounded-3xl overflow-hidden border border-white/10"
        >
            <div className="relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                {/* Header Image */}
                <div className="flex justify-center pt-8 pb-4 relative z-10">
                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-b from-[#a0522d] to-transparent shadow-2xl">
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#1a1a1a]">
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="160px" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-24 max-h-[60vh] overflow-y-auto">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.description}</p>
                        <div className="text-2xl font-bold text-white">${(item.price + extraPrice).toFixed(2)}</div>
                    </div>

                    <div className="space-y-6">
                        {/* Dynamic Options Section */}
                        {item.options && item.options.length > 0 && (
                            <div>
                                <h3 className="font-bold text-lg mb-3">Select Options</h3>
                                <div className="space-y-6">
                                    {item.options.map(opt => (
                                        <div key={opt.id}>
                                            <h4 className="text-sm text-gray-400 mb-2">{opt.name}</h4>
                                            <div className={opt.type === 'select' ? "grid grid-cols-2 gap-3" : "space-y-2"}>
                                                {opt.choices.map(choice => {
                                                    const isSelected = (selectedOptions[opt.id] || []).includes(choice.name);
                                                    return (
                                                        <label key={choice.name} className="flex items-center gap-3 cursor-pointer group">
                                                            {opt.type === 'select' ? (
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#a0522d]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#a0522d]"></div>}
                                                                </div>
                                                            ) : (
                                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-[#a0522d] border-[#a0522d]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                                </div>
                                                            )}
                                                            <input
                                                                type={opt.type === 'select' ? 'radio' : 'checkbox'}
                                                                name={opt.id}
                                                                value={choice.name}
                                                                checked={isSelected}
                                                                onChange={() => handleOptionSelect(opt.id, choice.name, opt.type)}
                                                                className="hidden"
                                                            />
                                                            <span className={`text-sm flex-1 ${isSelected ? 'text-white' : 'text-gray-400'}`}>{choice.name}</span>
                                                            {choice.price && <span className="text-sm text-gray-400">(+${choice.price.toFixed(2)})</span>}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Special Instructions */}
                        <div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Special Instructions (Optional)"
                                className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#a0522d] resize-none h-24 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#1a1a1a] border-t border-white/5">
                    <div className="flex gap-4">
                        <div className="flex items-center bg-[#2a2a2a] rounded-xl border border-gray-700 px-2">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white text-xl">−</button>
                            <span className="w-8 text-center font-bold">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white text-xl">+</button>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            fullWidth
                            className="bg-[#e27d60] hover:bg-[#c06045] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#e27d60]/20"
                        >
                            Add to Cart - ${((item.price + extraPrice) * quantity).toFixed(2)}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ItemDetail;
