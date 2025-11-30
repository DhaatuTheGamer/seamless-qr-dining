import React from 'react';
import type { MenuItem as MenuItemType } from '../../data/menu';
import Card from '../Shared/Card';
import Button from '../Shared/Button';
import { motion } from 'framer-motion';

/**
 * Props for the MenuItem component.
 */
interface MenuItemProps {
    /** The menu item data to display. */
    item: MenuItemType;
    /** Callback when the user clicks the "Add to Cart" button or the card itself. */
    onAdd: () => void;
}

/**
 * A component representing a single menu item card.
 * Displays the image, name, description, and price of the item.
 * Includes animations for hover and tap interactions.
 *
 * @component
 * @example
 * <MenuItem item={pizzaItem} onAdd={addToCart} />
 *
 * @param {MenuItemProps} props - The component props.
 * @returns {JSX.Element} The rendered menu item card.
 */
const MenuItem: React.FC<MenuItemProps> = ({ item, onAdd }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
        >
            <Card
                className="overflow-hidden p-0 h-full flex flex-col group border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white"
                onClick={onAdd}
            >
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-3">
                        <h3 className="font-bold text-[#3d312e] text-xl leading-tight mb-2">
                            {item.name}
                        </h3>
                        <p className="text-[#8b7e78] text-sm line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-4 flex flex-col gap-4">
                        <span className="font-bold text-[#3d312e] text-xl">${item.price.toFixed(2)}</span>

                        <Button
                            fullWidth
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdd();
                            }}
                            className="bg-[#a0522d]/90 hover:bg-[#8b4513] text-white border-0 py-3 rounded-xl font-bold shadow-lg shadow-[#a0522d]/20 flex items-center justify-center gap-2"
                        >
                            <span>Add to Cart</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default MenuItem;
