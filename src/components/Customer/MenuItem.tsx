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
            className="overflow-hidden p-0 h-full flex flex-col group border-0"
            onClick={onAdd}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                <div className="absolute top-3 right-3 flex gap-1">
                    {item.dietary?.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-wider rounded-full uppercase shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="font-heading font-bold text-white text-xl drop-shadow-md">${item.price}</span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="font-heading font-bold text-[var(--secondary)] text-lg leading-tight mb-1 group-hover:text-[var(--primary)] transition-colors">{item.name}</h3>
                </div>
                <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-4 flex-grow">{item.description}</p>

                <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    className="mt-auto border-[var(--primary)] text-[var(--primary-dark)] hover:bg-[var(--primary)] hover:text-white"
                >
                    Add to Order
                </Button>
            </div>
        </Card>
    );
};

export default MenuItem;
