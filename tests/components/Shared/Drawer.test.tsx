import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Drawer from '../../../src/components/Shared/Drawer';
import { useBodyScrollLock } from '../../../src/hooks/useBodyScrollLock';

// Mock the hook to verify it's called
jest.mock('../../../src/hooks/useBodyScrollLock');

describe('Drawer', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        title: 'Test Drawer',
        children: <div data-testid="drawer-content">Drawer Content</div>,
    };

    beforeEach(() => {
        jest.clearAllMocks();
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
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
        render(<Drawer {...defaultProps} />);
        const backdrop = document.querySelector('.bg-black\\/40');
        expect(backdrop).toBeInTheDocument();
        fireEvent.click(backdrop!);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('applies correct position classes for left and right', () => {
        const { rerender } = render(<Drawer {...defaultProps} position="left" />);
        let panel = document.querySelector('.max-w-md');
        expect(panel).toHaveClass('left-0');
        expect(panel).not.toHaveClass('right-0');

        rerender(<Drawer {...defaultProps} position="right" />);
        panel = document.querySelector('.max-w-md');
        expect(panel).toHaveClass('right-0');
        expect(panel).not.toHaveClass('left-0');
    });
});
