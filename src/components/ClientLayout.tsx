'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 72 }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
