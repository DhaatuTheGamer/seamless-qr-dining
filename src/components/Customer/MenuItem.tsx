import React from 'react';
import type { MenuItem as MenuItemType } from '../../data/menu';
import Card from '../Shared/Card';
import Button from '../Shared/Button';

interface MenuItemProps {
    item: MenuItemType;
    onAdd: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAdd }) => {
    return (
        <Card
            className="overflow-hidden p-0 h-full flex flex-col group border-0 bg-white hover:shadow-xl transition-all duration-500"
            onClick={onAdd}
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-70"></div>

                <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end">
                    {item.dietary?.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-wider rounded-full uppercase shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-heading font-bold text-white text-2xl drop-shadow-md">${item.price}</span>
                    </div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow relative">
                <div className="mb-2">
                    <h3 className="font-heading font-bold text-[var(--secondary)] text-xl leading-tight mb-2 group-hover:text-[var(--primary)] transition-colors">
                        {item.name}
                    </h3>
                </div>
                <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {item.description}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    className="mt-auto border-[var(--primary)] text-[var(--primary-dark)] hover:bg-[var(--primary-gradient)] hover:text-white hover:border-transparent transition-all duration-300 font-medium tracking-wide"
                >
                    Add to Order
                </Button>
            </div>
        </Card>
    );
};

export default MenuItem;
