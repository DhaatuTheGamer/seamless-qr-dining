"use client";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrderProvider } from "@/contexts/OrderContext";
import ToastContainer from "@/components/Shared/ToastContainer";

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
