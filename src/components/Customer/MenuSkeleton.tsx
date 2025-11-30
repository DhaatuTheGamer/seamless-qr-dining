import React from 'react';

/**
 * A loading skeleton component for the menu grid.
 * Displays placeholder cards with a pulse animation to indicate data fetching.
 *
 * @component
 * @example
 * <MenuSkeleton />
 *
 * @returns {JSX.Element} The rendered skeleton component.
 */
const MenuSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 h-full flex flex-col">
                    <div className="h-56 bg-gray-200 w-full"></div>
                    <div className="p-5 flex flex-col flex-grow gap-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="mt-auto pt-4 flex justify-between items-center">
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuSkeleton;
