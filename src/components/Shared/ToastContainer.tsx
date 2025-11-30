import React from 'react';
import { useToast, type ToastType } from '../../contexts/ToastContext';

/**
 * Component that renders the list of active toast notifications.
 * It is positioned absolutely on the screen and manages the display of individual toast messages.
 *
 * @component
 * @example
 * <ToastContainer />
 *
 * @returns {JSX.Element} The rendered toast container.
 */
const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    /**
     * Gets the icon for a given toast type.
     * @param type - The type of toast.
     * @returns {string} The icon character.
     */
    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
        }
    };

    /**
     * Gets the CSS classes for a given toast type.
     * @param type - The type of toast.
     * @returns {string} The CSS classes string.
     */
    const getStyles = (type: ToastType) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'error': return 'bg-red-50 border-red-200 text-red-800';
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-fade-in ${getStyles(toast.type)}`}
                >
                    <span className="text-xl">{getIcon(toast.type)}</span>
                    <p className="font-medium text-sm">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
