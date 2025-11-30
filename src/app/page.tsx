"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Customer/Login';
import Menu from '@/components/Customer/Menu';
import Layout from '@/components/Shared/Layout';

/**
 * The main content component for the customer-facing page.
 * Determines whether to show the login screen or the menu based on authentication state.
 * Retrieves the table ID from the URL query parameters.
 *
 * @component
 * @returns {JSX.Element} The rendered customer content.
 */
function CustomerContent() {
    const { isAuthenticated } = useAuth();
    const searchParams = useSearchParams();
    const tableId = searchParams.get('table') || '1';

    return (
        <Layout>
            {!isAuthenticated ? <Login tableId={tableId} /> : <Menu tableId={tableId} />}
        </Layout>
    );
}

/**
 * The main entry point for the customer application.
 * Wraps the content in a Suspense boundary to handle async operations (like useSearchParams).
 *
 * @component
 * @returns {JSX.Element} The rendered page.
 */
export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomerContent />
        </Suspense>
    );
}
