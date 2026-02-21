'use client';

import React from 'react';
import { I18nProvider } from '@/lib/i18n';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <CartProvider>
                {children}
                <CartDrawer />
            </CartProvider>
        </I18nProvider>
    );
}
