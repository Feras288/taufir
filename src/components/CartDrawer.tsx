'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/lib/i18n';

export default function CartDrawer() {
    const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { t, locale } = useI18n();
    const isRTL = locale === 'ar';

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            />

            {/* Drawer */}
            <div className={`relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 z-10`}>

                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="text-xl font-bold font-cairo text-[#1A1A1A]">
                        {locale === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
                        <span className="text-sm font-normal text-gray-500 mx-2">({items.length})</span>
                    </h2>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                            <span className="text-4xl mb-2">🛒</span>
                            <p>{locale === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}</p>
                            <button
                                onClick={toggleCart}
                                className="mt-4 text-[#D4A017] font-bold hover:underline"
                            >
                                {locale === 'ar' ? 'تصفح المتجر' : 'Start Shopping'}
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.product.id} className="flex gap-4">
                                {/* Image */}
                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <Image
                                        src={item.product.image}
                                        alt={locale === 'ar' ? item.product.nameAr : item.product.nameEn}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-[#1A1A1A] text-sm leading-tight">
                                            {locale === 'ar' ? item.product.nameAr : item.product.nameEn}
                                        </h3>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="text-gray-400 hover:text-red-500 text-xs px-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {item.options?.finish || (locale === 'ar' ? 'الافتراضي' : 'Default Finish')}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        {/* Qty Control */}
                                        <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="font-bold text-[#1A1A1A]">
                                            {(() => {
                                                let price = item.product.price || 0;
                                                if (item.product.priceTiers) {
                                                    const tier = item.product.priceTiers
                                                        .sort((a, b) => b.min - a.min)
                                                        .find(t => item.quantity >= t.min);
                                                    if (tier) price = tier.price;
                                                }
                                                return (price * item.quantity).toLocaleString();
                                            })()} SAR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">{locale === 'ar' ? 'المجموع' : 'Subtotal'}</span>
                            <span className="text-xl font-bold text-[#1A1A1A]">{cartTotal.toLocaleString()} SAR</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={toggleCart}
                            className="block w-full bg-[#D4A017] text-white text-center py-3.5 rounded-xl font-bold hover:bg-[#B8860B] transition-colors shadow-lg shadow-orange-100"
                        >
                            {locale === 'ar' ? 'إتمام الشراء' : 'Proceed to Checkout'}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
