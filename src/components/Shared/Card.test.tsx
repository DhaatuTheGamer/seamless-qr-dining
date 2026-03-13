import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
    it('renders its children correctly', () => {
        render(
            <Card>
                <div data-testid="child-element">Test Content</div>
            </Card>
        );
        expect(screen.getByTestId('child-element')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies default card styling when glass is false', () => {
        const { container } = render(<Card>Content</Card>);
        // The div is the first child of the container
        const cardDiv = container.firstChild as HTMLElement;
        expect(cardDiv).toHaveClass('card');
        expect(cardDiv).not.toHaveClass('glass-panel');
    });

    it('applies glass styling when glass is true', () => {
        const { container } = render(<Card glass={true}>Content</Card>);
        const cardDiv = container.firstChild as HTMLElement;
        expect(cardDiv).toHaveClass('glass-panel');
        expect(cardDiv).not.toHaveClass('card');
    });

    it('applies additional className correctly', () => {
        const { container } = render(<Card className="custom-class">Content</Card>);
        const cardDiv = container.firstChild as HTMLElement;
        expect(cardDiv).toHaveClass('card');
        expect(cardDiv).toHaveClass('custom-class');
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        const { container } = render(<Card onClick={handleClick}>Content</Card>);
        const cardDiv = container.firstChild as HTMLElement;

        fireEvent.click(cardDiv);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
