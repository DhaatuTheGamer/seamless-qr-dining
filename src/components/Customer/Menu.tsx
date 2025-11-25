import React, { useState } from 'react';
import { menuItems, CATEGORIES, type MenuItem as MenuItemType } from '../../data/menu';
import MenuItem from './MenuItem';
import VirtualWaiter from './VirtualWaiter';
import ItemDetail from './ItemDetail';
import Cart from './Cart';
import OrderHistory from './OrderHistory';

interface MenuProps {
  tableId: string;
}

const Menu: React.FC<MenuProps> = ({ tableId }) => {
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
    <div className="min-h-screen pb-24 bg-[var(--background)]">
      {/* Categories Sticky Header */}
      <div className="sticky top-16 z-20 bg-[var(--background)]/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.05)] pt-4 pb-2 mb-6">
        <div className="container overflow-x-auto no-scrollbar">
          <div className="flex gap-3 pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeCategory === cat.id
                    ? 'bg-[var(--primary-gradient)] text-white shadow-md transform scale-105'
                    : 'bg-white text-[var(--text-muted)] border border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Section Header */}
        <div className="animate-slide-up mb-8">
          <div className="flex items-end justify-between mb-2">
            <h2 className="font-heading text-4xl font-bold text-[var(--secondary)] capitalize">
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            <span className="text-sm text-[var(--text-muted)] font-medium bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              {filteredItems.length} items
            </span>
          </div>
          <div className="h-1 w-20 bg-[var(--primary)] rounded-full"></div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
