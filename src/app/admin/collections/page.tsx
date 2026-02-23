'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { collections as initialCollections } from '@/data';

export default function AdminCollectionsPage() {
    const { locale } = useI18n();
    const [collectionsList] = useState(initialCollections);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>
                    {locale === 'ar' ? 'إدارة المجموعات' : 'Collections Management'}
                </h1>
                <button className="btn btn-gold" style={{ padding: '10px 20px', fontSize: 13 }}>
                    + {locale === 'ar' ? 'مجموعة جديدة' : 'New Collection'}
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 20,
            }}>
                {collectionsList.map(col => (
                    <div key={col.id} style={{
                        background: '#fff', borderRadius: 16,
                        border: '1px solid var(--border-light)',
                        overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div style={{
                            height: 160,
                            background: col.image ? `url(${col.image}) center/cover` : 'linear-gradient(135deg, #8B6914, #D4A017)',
                            position: 'relative',
                        }}>
                            {col.image && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />}
                        </div>
                        <div style={{ padding: 20 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                                {locale === 'ar' ? col.nameAr : col.nameEn}
                            </h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                                {locale === 'ar' ? col.descAr : col.descEn}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>
                                    {col.productCount} {locale === 'ar' ? 'منتج' : 'products'}
                                </span>
                                <button style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: 14, color: 'var(--text-muted)',
                                }}>✏️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
