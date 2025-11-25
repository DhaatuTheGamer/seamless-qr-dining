import React, { useState } from 'react';
import { menuItems, CATEGORIES, type MenuItem as MenuItemType } from '../../data/menu';
import MenuItem from './MenuItem';
import VirtualWaiter from './VirtualWaiter';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import ItemDetail from './ItemDetail';
import Cart from './Cart';
import OrderHistory from './OrderHistory';

interface MenuProps {
  tableId: string;
}

const Menu: React.FC<MenuProps> = ({ tableId }) => {
  const { cart } = useOrder();
  const [activeCategory, setActiveCategory] = useState('starters');
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  if (isCartOpen) {
    return <Cart tableId={tableId} onClose={() => setIsCartOpen(false)} />;
  }

  if (isHistoryOpen) {
    return <OrderHistory onClose={() => setIsHistoryOpen(false)} />;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Categories */}
      <div className="sticky top-16 z-20 bg-[var(--background)]/95 backdrop-blur-sm py-4 border-b border-[rgba(0,0,0,0.05)] mb-6 -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                ${activeCategory === cat.id
                  ? 'bg-[var(--secondary)] text-[var(--primary)] shadow-lg scale-105'
                  : 'bg-white text-[var(--text-muted)] border border-gray-100 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="animate-slide-up">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-heading text-3xl font-bold text-[var(--secondary)] capitalize">
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="text-sm text-[var(--text-muted)] font-medium">
            {filteredItems.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              onAdd={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Virtual Waiter */}
      <VirtualWaiter tableId={tableId} />

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
