import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Drawer from './Drawer';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

// Mock the hook to verify it's called
jest.mock('../../hooks/useBodyScrollLock');

describe('Drawer', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        title: 'Test Drawer',
        children: <div data-testid="drawer-content">Drawer Content</div>,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Since Drawer uses createPortal to document.body, testing-library's render
        // will automatically work because it mounts within document.body as well,
        // but portals just append directly to document.body.
    });

    it('does not render when isOpen is false', () => {
        render(<Drawer {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('Test Drawer')).not.toBeInTheDocument();
        expect(screen.queryByTestId('drawer-content')).not.toBeInTheDocument();
        expect(useBodyScrollLock).toHaveBeenCalledWith(false);
    });

    it('renders title and children when isOpen is true', () => {
        render(<Drawer {...defaultProps} />);

        expect(screen.getByText('Test Drawer')).toBeInTheDocument();
        expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
        expect(useBodyScrollLock).toHaveBeenCalledWith(true);
    });

    it('calls onClose when close button is clicked', () => {
        render(<Drawer {...defaultProps} />);

        // Find the button (it contains an svg, so we can use role="button" or closest button to the title)
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
        render(<Drawer {...defaultProps} />);

        // The backdrop is the first div before the content panel
        // It has bg-black/40 and backdrop-blur-sm
        // Let's get it by testid or a query that matches its classes, or just the first child of the portal container
        // Actually, we can just grab it by class or add a test id. Wait, we can't change Drawer.tsx if we don't want to.
        // Let's find it by looking for the element that has `bg-black/40` class.
        // A better way is to find it via its specific classes or we can just get all divs and find the one.
        // Actually, previous siblings of the panel...
        // Let's mock the document structure or just find the element.
        // The close button is inside the drawer panel. The backdrop is outside.
        const backdrop = document.querySelector('.bg-black\\/40');
        expect(backdrop).toBeInTheDocument();

        fireEvent.click(backdrop!);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('applies correct position classes for left and right', () => {
        const { rerender } = render(<Drawer {...defaultProps} position="left" />);

        // The panel is the one with max-w-md
        let panel = document.querySelector('.max-w-md');
        expect(panel).toHaveClass('left-0');
        expect(panel).not.toHaveClass('right-0');

        rerender(<Drawer {...defaultProps} position="right" />);

        panel = document.querySelector('.max-w-md');
        expect(panel).toHaveClass('right-0');
        expect(panel).not.toHaveClass('left-0');
    });
});
