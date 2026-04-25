import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemDetail from '../../../src/components/Customer/ItemDetail';
import { OrderProvider } from '../../../src/contexts/OrderContext';
import { ToastProvider } from '../../../src/contexts/ToastContext';
import type { MenuItem } from '../../../src/data/menu';

// Mock Modal portal issues in jest by just rendering children
jest.mock('../../../src/components/Shared/Modal', () => {
    return function MockModal({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {
        return isOpen ? <div data-testid="modal">{children}</div> : null;
    };
});

// Need to mock next/image to prevent issues
jest.mock('next/image', () => {
    return function MockImage(props: any) {
        return <img {...props} />;
    };
});

const mockItem: MenuItem = {
    id: 'm1',
    name: 'Wagyu Beef Burger',
    description: 'Premium wagyu patty.',
    price: 24,
    category: 'mains',
    image: '/test.jpg',
    available: true,
    options: [
        {
            id: 'cookLevel',
            name: 'Cook Level',
            type: 'select',
            choices: [{ name: 'Medium Rare' }, { name: 'Medium' }, { name: 'Medium Well' }]
        },
        {
            id: 'addons',
            name: 'Add-ons',
            type: 'checkbox',
            choices: [
                { name: 'Extra Truffle Aioli', price: 1.00 },
                { name: 'Applewood Smoked Bacon', price: 2.00 }
            ]
        }
    ]
};

const mockItemNoOptions: MenuItem = {
    id: 'd1',
    name: 'Dark Chocolate Fondant',
    description: 'Molten center chocolate cake.',
    price: 14,
    category: 'desserts',
    image: '/test2.jpg',
    available: true
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <ToastProvider>
            <OrderProvider>
                {ui}
            </OrderProvider>
        </ToastProvider>
    );
};

describe('ItemDetail Component', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders basic item details correctly', () => {
        renderWithProviders(<ItemDetail item={mockItemNoOptions} onClose={mockOnClose} />);
        
        expect(screen.getByText('Dark Chocolate Fondant')).toBeInTheDocument();
        expect(screen.getByText('Molten center chocolate cake.')).toBeInTheDocument();
        expect(screen.getByText('$14.00')).toBeInTheDocument();
        
        // Should not show options section
        expect(screen.queryByText('Select Options')).not.toBeInTheDocument();
    });

    it('renders dynamic options when present', () => {
        renderWithProviders(<ItemDetail item={mockItem} onClose={mockOnClose} />);
        
        expect(screen.getByText('Select Options')).toBeInTheDocument();
        expect(screen.getByText('Cook Level')).toBeInTheDocument();
        expect(screen.getByText('Add-ons')).toBeInTheDocument();
        
        // Check options are rendered
        expect(screen.getByText('Medium Rare')).toBeInTheDocument();
        expect(screen.getByText('Applewood Smoked Bacon')).toBeInTheDocument();
    });

    it('updates price when adding priced options', () => {
        renderWithProviders(<ItemDetail item={mockItem} onClose={mockOnClose} />);
        
        // Initial price is 24
        expect(screen.getByText('Add to Cart - $24.00')).toBeInTheDocument();
        
        // Click addon with price 2.00
        const baconAddon = screen.getByText('Applewood Smoked Bacon');
        fireEvent.click(baconAddon);
        
        // Price should update
        expect(screen.getByText('Add to Cart - $26.00')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const { container } = renderWithProviders(<ItemDetail item={mockItemNoOptions} onClose={mockOnClose} />);
        
        // Find the close button (it's the only generic button at the top)
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]); // The close button
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles quantity changes correctly', () => {
        renderWithProviders(<ItemDetail item={mockItemNoOptions} onClose={mockOnClose} />);
        
        const increaseBtn = screen.getByText('+');
        const decreaseBtn = screen.getByText('−');
        
        // Initial price
        expect(screen.getByText('Add to Cart - $14.00')).toBeInTheDocument();
        
        // Increase quantity
        fireEvent.click(increaseBtn);
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Add to Cart - $28.00')).toBeInTheDocument();
        
        // Decrease quantity
        fireEvent.click(decreaseBtn);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Add to Cart - $14.00')).toBeInTheDocument();
        
        // Should not go below 1
        fireEvent.click(decreaseBtn);
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
