'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';

export default function AdminMediaPage() {
    const { locale } = useI18n();

    const mediaItems = Array.from({ length: 12 }, (_, i) => ({
        id: `media-${i + 1}`,
        name: `image-${i + 1}.jpg`,
        size: `${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)}MB`,
    }));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>
                    {locale === 'ar' ? 'مكتبة الوسائط' : 'Media Library'}
                </h1>
                <button className="btn btn-gold" style={{ padding: '10px 20px', fontSize: 13 }}>
                    + {locale === 'ar' ? 'رفع ملفات' : 'Upload Files'}
                </button>
            </div>

            {/* Upload area */}
            <div style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: 16, padding: 48, textAlign: 'center',
                marginBottom: 32, background: '#fff',
            }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>☁️</div>
                <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                    {locale === 'ar' ? 'اسحب الملفات هنا أو انقر للرفع' : 'Drag files here or click to upload'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    PNG, JPG, WEBP up to 10MB
                </p>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
            }}>
                {mediaItems.map(item => (
                    <div key={item.id} style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                    >
                        <div style={{
                            height: 120,
                            background: `linear-gradient(${135 + Math.random() * 90}deg, #8B6914, #D4A017, #B8860B)`,
                        }} />
                        <div style={{ padding: '8px 10px', background: '#fff' }}>
                            <p style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.name}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.size}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
