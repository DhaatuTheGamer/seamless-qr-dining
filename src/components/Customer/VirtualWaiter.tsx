import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import Modal from '../Shared/Modal';
import Button from '../Shared/Button';

/**
 * Props for the VirtualWaiter component.
 */
interface VirtualWaiterProps {
    /** The table ID from which the request is originating. */
    tableId: string;
}

/**
 * A floating action button that opens a modal for requesting service.
 * Allows customers to quickly request water, the bill, a waiter, or send a custom message.
 *
 * @component
 * @example
 * <VirtualWaiter tableId="table-1" />
 *
 * @param {VirtualWaiterProps} props - The component props.
 * @returns {JSX.Element} The rendered virtual waiter component.
 */
const VirtualWaiter: React.FC<VirtualWaiterProps> = ({ tableId }) => {
    const { requestService } = useOrder();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    /**
     * Handles sending the service request.
     * @param type - The type of request (water, bill, help, custom).
     */
    const handleRequest = async (type: 'water' | 'bill' | 'help' | 'custom') => {
        if (type === 'custom' && !message.trim()) return;

        setIsSending(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        requestService(tableId, type, type === 'custom' ? message : undefined);
        setIsSending(false);

        if (type === 'custom') {
            setMessage('');
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 w-14 h-14 bg-[var(--secondary)] text-[var(--primary)] rounded-full shadow-2xl shadow-[var(--secondary)]/40 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all border-2 border-[var(--primary)]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </button>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Call for Service">
                <div className="space-y-6">
                    <p className="text-[var(--text-muted)] text-center text-sm">
                        Tap an option below to request service for Table #{tableId}
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => handleRequest('water')}
                            disabled={isSending}
                            className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group disabled:opacity-50"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💧</span>
                            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Water</span>
                        </button>

                        <button
                            onClick={() => handleRequest('bill')}
                            disabled={isSending}
                            className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-100 hover:border-green-300 hover:shadow-md transition-all group disabled:opacity-50"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧾</span>
                            <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Bill</span>
                        </button>

                        <button
                            onClick={() => handleRequest('help')}
                            disabled={isSending}
                            className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group disabled:opacity-50"
                        >
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">👋</span>
                            <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Waiter</span>
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                            <span className="px-3 bg-white text-[var(--text-muted)]">Or Custom Request</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="e.g. More napkins, extra cutlery..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all bg-gray-50"
                            />
                        </div>
                        <Button
                            onClick={() => handleRequest('custom')}
                            disabled={!message.trim() || isSending}
                            isLoading={isSending && message.trim().length > 0}
                            fullWidth
                        >
                            Send Request
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default VirtualWaiter;
