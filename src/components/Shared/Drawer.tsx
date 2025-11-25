import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    position?: 'left' | 'right';
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, title, position = 'right' }) => {
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

    const slideClass = position === 'right' ? 'translate-x-0' : 'translate-x-0';
    const initialClass = position === 'right' ? 'translate-x-full' : '-translate-x-full';

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                className={`
          absolute inset-y-0 ${position === 'right' ? 'right-0' : 'left-0'}
          w-full max-w-md bg-[var(--surface)] shadow-2xl transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? slideClass : initialClass}
        `}
            >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="text-xl font-heading font-bold text-[var(--secondary)]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors rounded-full hover:bg-black/5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Drawer;
