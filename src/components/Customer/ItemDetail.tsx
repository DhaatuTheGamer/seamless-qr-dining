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
    const [cookLevel, setCookLevel] = useState('Medium');
    const [side, setSide] = useState('French Fries');
    const [addons, setAddons] = useState<string[]>([]);

    const handleAddToCart = () => {
        const notesWithOptions = `Cook: ${cookLevel}, Side: ${side}, Addons: ${addons.join(', ')}. ${notes}`;
        addToCart(item, quantity, notesWithOptions);
        onClose();
    };

    const toggleAddon = (addon: string) => {
        if (addons.includes(addon)) {
            setAddons(addons.filter(a => a !== addon));
        } else {
            setAddons([...addons, addon]);
        }
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
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#1a1a1a]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-24">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.description}</p>
                        <div className="text-2xl font-bold text-white">${item.price.toFixed(2)}</div>
                    </div>

                    <div className="space-y-6">
                        {/* Options Section (Mocked) */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">Select Options</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm text-gray-400 mb-2">Cook Level</h4>
                                    <div className="space-y-2">
                                        {['Medium Rare', 'Medium', 'Medium Well'].map(level => (
                                            <label key={level} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${cookLevel === level ? 'border-[#a0522d]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                    {cookLevel === level && <div className="w-2.5 h-2.5 rounded-full bg-[#a0522d]"></div>}
                                                </div>
                                                <input type="radio" name="cookLevel" value={level} checked={cookLevel === level} onChange={() => setCookLevel(level)} className="hidden" />
                                                <span className={`text-sm ${cookLevel === level ? 'text-white' : 'text-gray-400'}`}>{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm text-gray-400 mb-2">Side</h4>
                                    <div className="space-y-2">
                                        {['French Fries', 'Sweet Potato Fries', 'Side Salad'].map(s => (
                                            <label key={s} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${side === s ? 'border-[#a0522d]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                    {side === s && <div className="w-2.5 h-2.5 rounded-full bg-[#a0522d]"></div>}
                                                </div>
                                                <input type="radio" name="side" value={s} checked={side === s} onChange={() => setSide(s)} className="hidden" />
                                                <span className={`text-sm ${side === s ? 'text-white' : 'text-gray-400'}`}>{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add-ons */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">Add-ons</h3>
                            <div className="space-y-2">
                                {[
                                    { name: 'Extra Truffle Aioli', price: 1.00 },
                                    { name: 'Applewood Smoked Bacon', price: 2.00 },
                                    { name: 'Avocado', price: 1.50 }
                                ].map(addon => (
                                    <label key={addon.name} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${addons.includes(addon.name) ? 'bg-[#a0522d] border-[#a0522d]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                            {addons.includes(addon.name) && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        </div>
                                        <input type="checkbox" checked={addons.includes(addon.name)} onChange={() => toggleAddon(addon.name)} className="hidden" />
                                        <span className={`text-sm flex-1 ${addons.includes(addon.name) ? 'text-white' : 'text-gray-400'}`}>{addon.name}</span>
                                        <span className="text-sm text-gray-400">(+${addon.price.toFixed(2)})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

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
                            Add to Cart - ${(item.price * quantity).toFixed(2)}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ItemDetail;
