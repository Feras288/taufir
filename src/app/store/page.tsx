'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Product } from '@/data/index';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function StorePage() {
    const { t, locale } = useI18n();
    const { addToCart } = useCart();
    const [category, setCategory] = useState('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                // Filter only products marked for store
                const storeProducts = data.filter((p: Product) => p.showInStore === true);
                setProducts(storeProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load products', err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = category === 'All'
        ? products
        : products.filter(p => p.category === category);

    const categories = ['All', 'interior', 'exterior', 'fire-rated', 'custom'];

    return (
        <main className="min-h-screen bg-[#F5F5F0]">
            <Navbar />

            {/* Hero */}
            <div className="bg-[#1A1A1A] text-white py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">
                        {locale === 'ar' ? 'المتجر الإلكتروني' : 'Online Store'}
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        {locale === 'ar'
                            ? 'تسوق أرقى الأبواب الخشبية المصممة خصيصاً لمشروعك'
                            : 'Shop premium wooden doors designed specifically for your project'
                        }
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${category === cat
                                ? 'bg-[#D4A017] text-white'
                                : 'bg-white text-[#555] hover:bg-[#E8E8E4]'
                                }`}
                        >
                            {cat === 'All' ? (locale === 'ar' ? 'الكل' : 'All') : cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        {locale === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                {locale === 'ar' ? 'لا توجد منتجات في هذا القسم حالياً' : 'No products found in this category'}
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                    {/* Image */}
                                    <div className="relative h-[300px] bg-[#F0F0EC] group-hover:opacity-95 transition-opacity">
                                        <Image
                                            src={product.image || '/images/placeholder.jpg'}
                                            alt={locale === 'ar' ? product.nameAr : product.nameEn}
                                            fill
                                            className="object-cover"
                                        />
                                        {product.badges?.[0] && (
                                            <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {product.badges[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs font-bold text-[#D4A017] uppercase tracking-wider mb-1">
                                                    {locale === 'ar' ? product.seriesAr : product.seriesEn}
                                                </p>
                                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">
                                                    <Link href={`/products/${product.id}`} className="hover:text-[#D4A017] transition-colors">
                                                        {locale === 'ar' ? product.nameAr : product.nameEn}
                                                    </Link>
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-sm text-[#888] mb-6 line-clamp-2">
                                            {locale === 'ar' ? product.descAr : product.descEn}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#F0F0EC]">
                                            <div className="text-lg font-bold text-[#1A1A1A]">
                                                {product.price ? (
                                                    <span>{product.price.toLocaleString()} SAR</span>
                                                ) : (
                                                    <span className="text-sm text-[#888]">Contact for Price</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#D4A017] transition-colors flex items-center gap-2"
                                            >
                                                <span>+</span>
                                                {locale === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
