'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function AdminDashboard() {
    const { locale } = useI18n();
    const [stats, setStats] = React.useState<any[]>([]);
    const [recentInquiries, setRecentInquiries] = React.useState<any[]>([]);
    const [recentActivity, setRecentActivity] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.overview) {
                    setStats([
                        { labelEn: 'Total Products', labelAr: 'إجمالي المنتجات', value: data.overview.productCount.toString(), icon: '📦', change: '', color: '#D4A017' },
                        { labelEn: 'Active Inquiries', labelAr: 'استفسارات نشطة', value: data.overview.inquiryCount.toString(), icon: '💬', change: '', color: '#3182CE' },
                        { labelEn: 'Projects', labelAr: 'المشاريع', value: data.overview.projectCount.toString(), icon: '📁', change: '', color: '#38A169' },
                        { labelEn: 'Total Orders', labelAr: 'إجمالي الطلبات', value: data.overview.orderCount.toString(), icon: '📋', change: '', color: '#805AD5' },
                    ]);
                    setRecentInquiries(data.recentInquiries || []);
                    setRecentActivity(data.recentActivity || []);
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading Dashboard...</div>;
    }

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                    {locale === 'ar' ? 'نظرة عامة' : 'Dashboard Overview'}
                </h1>
                <p style={{ fontSize: 14, color: '#888' }}>
                    {locale === 'ar' ? 'مرحباً بك! إليك ملخص النشاطات الأخيرة' : 'Welcome back! Here\'s your activity summary'}
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{
                        background: '#fff', borderRadius: 12, padding: '20px',
                        border: '1px solid #E8E8E4', position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {locale === 'ar' ? s.labelAr : s.labelEn}
                            </p>
                            <span style={{ fontSize: 20 }}>{s.icon}</span>
                        </div>
                        <p style={{ fontSize: 32, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>{s.value}</p>
                        {s.change && <p style={{ fontSize: 12, color: s.color, fontWeight: 500 }}>{s.change}</p>}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                {/* Recent Inquiries */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                            {locale === 'ar' ? 'أحدث الاستفسارات' : 'Recent Inquiries'}
                        </h2>
                        <Link href="/admin/inquiries" style={{ fontSize: 13, color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                            {locale === 'ar' ? 'عرض الكل' : 'View All'} →
                        </Link>
                    </div>
                    <div>
                        {recentInquiries.length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>
                                {locale === 'ar' ? 'لا يوجد استفسارات حالية' : 'No recent inquiries.'}
                            </div>
                        ) : (
                            recentInquiries.map((inq, i) => (
                                <div key={i} style={{
                                    padding: '14px 20px', borderBottom: i < recentInquiries.length - 1 ? '1px solid #F0F0EC' : 'none',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', minWidth: 80 }}>{inq.id}</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{inq.client}</p>
                                        <p style={{ fontSize: 12, color: '#888' }}>{inq.product}</p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                        background: inq.status === 'New' ? '#E8F5E9' : inq.status === 'In Progress' ? '#FFF3E0' : '#E3F2FD',
                                        color: inq.status === 'New' ? '#2E7D32' : inq.status === 'In Progress' ? '#E65100' : '#1565C0',
                                    }}>
                                        {inq.status}
                                    </span>
                                    {/* <span style={{ fontSize: 12, color: '#999', minWidth: 80, textAlign: 'right' }}>{inq.time}</span> */}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8E8E4' }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                            {locale === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                        </h2>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {recentActivity.length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>
                                {locale === 'ar' ? 'لا يوجد نشاط مسجل' : 'No recent activity.'}
                            </div>
                        ) : (
                            recentActivity.map((a, i) => (
                                <div key={i} style={{ padding: '10px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: 14, marginTop: 2 }}>{a.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, color: '#333', lineHeight: 1.5 }}>{a.text}</p>
                                        <p style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{a.time}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

