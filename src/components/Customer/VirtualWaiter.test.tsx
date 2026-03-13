import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VirtualWaiter from './VirtualWaiter';
import { useOrder } from '../../contexts/OrderContext';

// Mock contexts
jest.mock('../../contexts/OrderContext', () => ({
    useOrder: jest.fn(),
}));

// Mock Modal since it uses Portals which can be problematic in JSDOM
jest.mock('../Shared/Modal', () => {
    return ({ isOpen, children, title }: any) => {
        if (!isOpen) return null;
        return (
            <div data-testid="mock-modal">
                <h2>{title}</h2>
                {children}
            </div>
        );
    };
});

describe('VirtualWaiter Component', () => {
    const mockRequestService = jest.fn();
    const mockTableId = 'table-1';

    beforeEach(() => {
        jest.clearAllMocks();

        (useOrder as jest.Mock).mockReturnValue({
            requestService: mockRequestService,
        });
    });

    it('renders the floating button initially without showing the modal', () => {
        render(<VirtualWaiter tableId={mockTableId} />);

        // Floating button is present
        const floatingButton = screen.getByRole('button');
        expect(floatingButton).toBeInTheDocument();

        // Modal is not present
        const modal = screen.queryByTestId('mock-modal');
        expect(modal).not.toBeInTheDocument();
    });

    it('opens the modal when the floating button is clicked', () => {
        render(<VirtualWaiter tableId={mockTableId} />);

        const floatingButton = screen.getByRole('button');
        fireEvent.click(floatingButton);

        // Modal is now present
        const modal = screen.getByTestId('mock-modal');
        expect(modal).toBeInTheDocument();

        // Verify title
        expect(screen.getByText('Call for Service')).toBeInTheDocument();

        // Verify standard options
        expect(screen.getByText('Water')).toBeInTheDocument();
        expect(screen.getByText('Bill')).toBeInTheDocument();
        expect(screen.getByText('Waiter')).toBeInTheDocument();

        // Verify custom input
        expect(screen.getByPlaceholderText('e.g. More napkins, extra cutlery...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send Request/i })).toBeInTheDocument();
    });

    it('sends a standard request (e.g., Water) successfully', async () => {
        jest.useFakeTimers();

        render(<VirtualWaiter tableId={mockTableId} />);

        // Open modal
        fireEvent.click(screen.getByRole('button'));

        // Click Water button
        const waterButton = screen.getByRole('button', { name: /Water/i });
        fireEvent.click(waterButton);

        // Verify not called immediately due to 800ms timeout
        expect(mockRequestService).not.toHaveBeenCalled();

        // Advance timers by 800ms
        jest.advanceTimersByTime(800);

        // Wait for requestService to be called
        await waitFor(() => {
            expect(mockRequestService).toHaveBeenCalledWith(mockTableId, 'water', undefined);

            // Verify modal is closed
            expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    it('sends a custom request successfully', async () => {
        jest.useFakeTimers();

        render(<VirtualWaiter tableId={mockTableId} />);

        // Open modal
        fireEvent.click(screen.getByRole('button'));

        // Type a message in the custom request input
        const input = screen.getByPlaceholderText('e.g. More napkins, extra cutlery...');
        fireEvent.change(input, { target: { value: 'Extra ketchup please' } });

        // Click Send Request button
        const sendButton = screen.getByRole('button', { name: /Send Request/i });
        fireEvent.click(sendButton);

        // Verify not called immediately due to 800ms timeout
        expect(mockRequestService).not.toHaveBeenCalled();

        // Advance timers by 800ms
        jest.advanceTimersByTime(800);

        // Wait for requestService to be called
        await waitFor(() => {
            expect(mockRequestService).toHaveBeenCalledWith(mockTableId, 'custom', 'Extra ketchup please');

            // Verify modal is closed
            expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    it('does not send a custom request if the message is empty', async () => {
        jest.useFakeTimers();

        render(<VirtualWaiter tableId={mockTableId} />);

        // Open modal
        fireEvent.click(screen.getByRole('button'));

        // Click Send Request button without entering text
        const sendButton = screen.getByRole('button', { name: /Send Request/i });

        // Button should be disabled
        expect(sendButton).toBeDisabled();

        // Even if we try to force a click, it shouldn't trigger
        fireEvent.click(sendButton);

        // Advance timers by 800ms
        jest.advanceTimersByTime(800);

        // Wait and verify it was never called
        await waitFor(() => {
            expect(mockRequestService).not.toHaveBeenCalled();

            // Modal should still be open
            expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
        });

        jest.useRealTimers();
    });
});
