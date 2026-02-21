'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';

export default function AdminCertificationsPage() {
    const { locale } = useI18n();

    const certifications = [
        { id: 1, name: 'ISO 9001:2015', issuer: 'Bureau Veritas', expiry: '2025-12-01', status: 'active', icon: '🏅' },
        { id: 2, name: 'SASO Quality Mark', issuer: 'Saudi Standards Authority', expiry: '2025-06-15', status: 'active', icon: '✅' },
        { id: 3, name: 'EN 1634-1 Fire Rating', issuer: 'Warrington Fire', expiry: '2026-03-20', status: 'active', icon: '🔥' },
        { id: 4, name: 'FSC Chain of Custody', issuer: 'Forest Stewardship Council', expiry: '2025-09-10', status: 'active', icon: '🌿' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>
                    {locale === 'ar' ? 'إدارة الشهادات' : 'Certifications Management'}
                </h1>
                <button className="btn btn-gold" style={{ padding: '10px 20px', fontSize: 13 }}>
                    + {locale === 'ar' ? 'إضافة شهادة' : 'Add Certification'}
                </button>
            </div>

            <div style={{
                background: '#fff', borderRadius: 16,
                border: '1px solid var(--border-light)', overflow: 'hidden',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-light)' }}>
                            {[
                                locale === 'ar' ? 'الشهادة' : 'Certification',
                                locale === 'ar' ? 'الجهة المصدرة' : 'Issuing Body',
                                locale === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date',
                                locale === 'ar' ? 'الحالة' : 'Status',
                                ''
                            ].map((h, i) => (
                                <th key={i} style={{
                                    padding: '12px 20px', textAlign: 'left', fontSize: 12,
                                    fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5,
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {certifications.map(cert => (
                            <tr key={cert.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 20 }}>{cert.icon}</span>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>{cert.name}</span>
                                </td>
                                <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text-secondary)' }}>{cert.issuer}</td>
                                <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text-secondary)' }}>{cert.expiry}</td>
                                <td style={{ padding: '14px 20px' }}>
                                    <span className="badge badge-published">{cert.status}</span>
                                </td>
                                <td style={{ padding: '14px 20px' }}>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>✏️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
