'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { type Product } from '@/data';
import ClientLayout from '@/components/ClientLayout';

export default function ProductsPage() {
    const { t, locale } = useI18n();
    const [activeCategory, setActiveCategory] = useState('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(r => r.json())
            .then((data: Product[]) => {
                // Filter OUT products meant for the store (Display Only)
                const displayProducts = data.filter(p => !p.showInStore);
                setProducts(displayProducts);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = [
        { id: 'all', label: t('products.allCategories') },
        { id: 'interior', label: t('products.interiorDoors') },
        { id: 'exterior', label: t('products.exteriorDoors') },
        { id: 'fire-rated', label: t('products.fireRatedDoors') },
        { id: 'custom', label: t('products.customDoors') },
    ];

    const filtered = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <ClientLayout>
            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
                padding: '80px 0 60px',
                textAlign: 'center',
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 44, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                        {t('products.title')}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
                        {t('products.subtitle')}
                    </p>
                </div>
            </section>

            {/* Filter */}
            <section style={{ background: '#fff', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 72, zIndex: 100 }}>
                <div className="container" style={{ display: 'flex', gap: 8, padding: '16px 24px', overflowX: 'auto' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: 24,
                                border: '1px solid',
                                borderColor: activeCategory === cat.id ? 'var(--gold)' : 'var(--border-light)',
                                background: activeCategory === cat.id ? 'var(--gold)' : '#fff',
                                color: activeCategory === cat.id ? '#fff' : 'var(--text-primary)',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid */}
            <section className="section" style={{ background: 'var(--bg-light)' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                            <p style={{ fontSize: 16 }}>{locale === 'ar' ? 'جاري التحميل...' : 'Loading products...'}</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 28,
                        }}>
                            {filtered.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}>
                                        <div style={{
                                            height: 240,
                                            background: product.image
                                                ? `url(${product.image}) center/cover no-repeat`
                                                : 'linear-gradient(135deg, #8B6914 0%, #D4A017 50%, #B8860B 100%)',
                                            position: 'relative',
                                        }}>
                                            <div style={{
                                                position: 'absolute', top: 12, right: 12,
                                                padding: '4px 12px', borderRadius: 16,
                                                background: 'rgba(0,0,0,0.5)', color: '#fff',
                                                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                                            }}>
                                                {product.category}
                                            </div>
                                        </div>
                                        <div style={{ padding: '20px 24px' }}>
                                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                                                {locale === 'ar' ? product.nameAr : product.nameEn}
                                            </h3>
                                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                                                {locale === 'ar' ? product.descAr : product.descEn}
                                            </p>
                                            <span style={{
                                                color: 'var(--gold)', fontWeight: 600, fontSize: 14,
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                            }}>
                                                {t('products.viewDetails')} →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </ClientLayout>
    );
}
