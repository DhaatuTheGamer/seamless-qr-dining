import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../../src/components/Shared/Modal';
import { useBodyScrollLock } from '../../../src/hooks/useBodyScrollLock';

// Mock the hook
jest.mock('../../../src/hooks/useBodyScrollLock', () => ({
    useBodyScrollLock: jest.fn(),
}));

describe('Modal Component', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render anything when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={mockOnClose}>
                <div data-testid="modal-content">Test Content</div>
            </Modal>
        );
        expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
        expect(useBodyScrollLock).toHaveBeenCalledWith(false);
    });

    it('should render children when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose}>
                <div data-testid="modal-content">Test Content</div>
            </Modal>
        );
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(useBodyScrollLock).toHaveBeenCalledWith(true);
    });

    it('should render the title when provided', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
                <div>Content</div>
            </Modal>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Title');
    });

    it('should call onClose when the backdrop is clicked', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose}>
                <div>Content</div>
            </Modal>
        );
        const backdrop = document.body.querySelector('.fixed > .absolute');
        expect(backdrop).toBeInTheDocument();
        if (backdrop) {
            fireEvent.click(backdrop);
        }
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when the close button is clicked (with title)', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
                <div>Content</div>
            </Modal>
        );
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when the close button is clicked (without title)', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose}>
                <div>Content</div>
            </Modal>
        );
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should apply custom className and panelClassName', () => {
        render(
            <Modal
                isOpen={true}
                onClose={mockOnClose}
                className="custom-container-class"
                panelClassName="custom-panel-class"
            >
                <div>Content</div>
            </Modal>
        );
        const container = document.body.querySelector('.fixed');
        expect(container).toHaveClass('custom-container-class');
        const panel = document.body.querySelector('.relative.w-full');
        expect(panel).toHaveClass('custom-panel-class');
    });
});
