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
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Categories Sticky Header */}
      <div className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 pt-4 pb-2 mb-6">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="animate-slide-up mb-8">
          <div className="flex items-end justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900 capitalize tracking-tight">
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              {filteredItems.length} items
            </span>
          </div>
          <div className="h-1 w-16 bg-emerald-500 rounded-full"></div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
