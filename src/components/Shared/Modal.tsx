import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props for the Modal component.
 */
interface ModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean;
    /** Callback function to close the modal. */
    onClose: () => void;
    /** The content to display inside the modal. */
    children: React.ReactNode;
    /** Optional title for the modal header. */
    title?: string;
    /** Additional CSS classes for the modal container (backdrop). */
    className?: string;
    /** Additional CSS classes for the modal panel (content wrapper). */
    panelClassName?: string;
}

/**
 * A modal dialog component.
 * Renders on top of other content using a portal.
 * Manages body scroll locking when open.
 *
 * @component
 * @example
 * <Modal isOpen={isOpen} onClose={closeModal} title="Confirmation">
 *   <p>Are you sure?</p>
 * </Modal>
 *
 * @param {ModalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered modal or null if closed.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, className, panelClassName }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in ${className || ''}`}>
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up ${panelClassName || 'bg-white'}`}>
                {title && (
                    <div className="px-6 py-4 border-b border-gray-100/10 flex justify-between items-center">
                        <h3 className="text-xl font-heading font-bold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                )}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                )}
                <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
