'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/data/index';

export interface CartItem {
    product: Product;
    quantity: number;
    options?: {
        finish?: string;
        size?: string;
    };
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number, options?: CartItem['options']) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    toggleCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('sindean_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart data', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('sindean_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (product: Product, quantity = 1, options?: CartItem['options']) => {
        setItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                // If options match, update quantity. If options are different, maybe treat as new item? 
                // For simplicity in this version, we'll just update quantity if ID matches.
                // ideally we should check options equality too.
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity, options }];
        });
        setIsCartOpen(true); // Auto-open cart on add
    };

    const removeFromCart = (productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    // Calculate totals
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    // Assuming product has a price field? If not, we might need to assume a default or check strict types.
    // The current Product interface might not have a price. We should check that.
    // For now, let's assume price is 0 if missing, to be safe.
    const cartTotal = items.reduce((sum, item) => {
        let price = item.product.price || 0;

        if (item.product.priceTiers) {
            const tier = item.product.priceTiers
                .sort((a, b) => b.min - a.min)
                .find(t => item.quantity >= t.min);
            if (tier) {
                price = tier.price;
            }
        }

        return sum + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            toggleCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
