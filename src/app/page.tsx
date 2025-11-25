"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Customer/Login';
import Menu from '@/components/Customer/Menu';
import Layout from '@/components/Shared/Layout';

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

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomerContent />
        </Suspense>
    );
}
