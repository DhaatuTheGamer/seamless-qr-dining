import React, { useState, useEffect, useMemo } from 'react';
import { menuItems, CATEGORIES, type MenuItem as MenuItemType } from '../../data/menu';
import { useOrder } from '../../contexts/OrderContext';
import MenuItem from './MenuItem';
import VirtualWaiter from './VirtualWaiter';
import ItemDetail from './ItemDetail';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import MenuSkeleton from './MenuSkeleton';
import CartFloatingBar from './CartFloatingBar';
import { motion } from 'framer-motion';

/**
 * Props for the Menu component.
 */
interface MenuProps {
  /** The table ID for which the menu is being displayed. */
  tableId: string;
}

/**
 * The main menu component displaying categories and menu items.
 * Handles state for category selection, item details modal, cart visibility, and loading states.
 *
 * @component
 * @example
 * <Menu tableId="table-1" />
 *
 * @param {MenuProps} props - The component props.
 * @returns {JSX.Element} The rendered menu component.
 */
const Menu: React.FC<MenuProps> = ({ tableId }) => {
  const { isCartOpen, setIsCartOpen } = useOrder();
  const [activeCategory, setActiveCategory] = useState('starters');
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const filteredItems = useMemo(() => menuItems.filter(item => item.category === activeCategory), [activeCategory]);

  if (isCartOpen) {
    return <Cart tableId={tableId} onClose={() => setIsCartOpen(false)} />;
  }

  if (isHistoryOpen) {
    return <OrderHistory onClose={() => setIsHistoryOpen(false)} />;
  }

  return (
    <div className="min-h-screen pb-24 bg-white">
      {/* Hero Section */}
      <div className="relative h-64 -mt-6 mb-8 overflow-hidden rounded-b-3xl shadow-lg">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white font-heading tracking-tight drop-shadow-lg text-center px-4">
            Our Seasonal Menu
          </h1>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 mb-8">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex justify-center gap-8 min-w-max px-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  py-4 text-base font-medium transition-all duration-200 border-b-2 relative
                  ${activeCategory === cat.id
                    ? 'text-[#a0522d] border-[#a0522d]'
                    : 'text-gray-500 border-transparent hover:text-gray-800'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Menu Grid */}
        {isLoading ? (
          <MenuSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredItems.map(item => (
              <MenuItem
                key={item.id}
                item={item}
                onAdd={() => setSelectedItem(item)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Virtual Waiter */}
      <VirtualWaiter tableId={tableId} />

      {/* Floating Cart Bar */}
      <CartFloatingBar onOpenCart={() => setIsCartOpen(true)} />

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Menu;
