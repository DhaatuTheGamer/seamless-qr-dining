"use client";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrderProvider } from "@/contexts/OrderContext";
import ToastContainer from "@/components/Shared/ToastContainer";

/**
 * A wrapper component that combines all global context providers.
 * Includes ToastProvider, AuthProvider, and OrderProvider.
 * Also renders the ToastContainer to display notifications globally.
 *
 * @component
 * @example
 * <Providers>
 *   <App />
 * </Providers>
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that need access to the providers.
 * @returns {JSX.Element} The providers wrapping the children.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <OrderProvider>
                    {children}
                    <ToastContainer />
                </OrderProvider>
            </AuthProvider>
        </ToastProvider>
    );
}
