'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

const inventoryItems = [
    { icon: '📦', labelEn: 'Products', labelAr: 'المنتجات', href: '/admin/products' },
    { icon: '📂', labelEn: 'Categories', labelAr: 'الفئات', href: '/admin/categories' },
    { icon: '📋', labelEn: 'Specifications', labelAr: 'المواصفات', href: '/admin/specifications' },
];

const businessItems = [
    // Orders management
    { icon: '🛍️', labelEn: 'Orders', labelAr: 'الطلبات', href: '/admin/orders' },
    { icon: '💬', labelEn: 'Inquiries', labelAr: 'الاستفسارات', href: '/admin/inquiries', badge: 0 },
    { icon: '📁', labelEn: 'Projects', labelAr: 'المشاريع', href: '/admin/projects' },
    { icon: '👤', labelEn: 'Clients', labelAr: 'العملاء', href: '/admin/clients' },
];

const systemItems = [
    { icon: '⚙️', labelEn: 'Settings', labelAr: 'الإعدادات', href: '/admin/settings' },
    { icon: '👥', labelEn: 'Users & Roles', labelAr: 'المستخدمون والأدوار', href: '/admin/users' },
];

function NavItem({ item, isActive }: { item: { icon: string; labelEn: string; labelAr: string; href: string; badge?: number }; isActive: boolean }) {
    const { locale } = useI18n();
    return (
        <Link
            href={item.href}
            style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', borderRadius: 10,
                background: isActive ? 'var(--gold)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s', marginBottom: 2, position: 'relative',
            }}
        >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
            {item.badge && (
                <span style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--gold)',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 10, minWidth: 20, textAlign: 'center',
                }}>{item.badge}</span>
            )}
        </Link>
    );
}

function SectionLabel({ labelEn, labelAr }: { labelEn: string; labelAr: string }) {
    const { locale } = useI18n();
    return (
        <p style={{
            padding: '16px 16px 6px', fontSize: 11, fontWeight: 700,
            letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
        }}>
            {locale === 'ar' ? labelAr : labelEn}
        </p>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { locale, setLocale } = useI18n();
    const pathname = usePathname();
    const [notifications] = useState(3);
    const [newInquiriesCount, setNewInquiriesCount] = useState(0);

    const isRTL = locale === 'ar';

    React.useEffect(() => {
        const fetchInquiryCount = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.inquiryStats) {
                    setNewInquiriesCount(data.inquiryStats.new);
                }
            } catch (error) {
                console.error('Failed to fetch inquiry count', error);
            }
        };
        fetchInquiryCount();
    }, [pathname]);

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    // Update businessItems with the dynamic count
    const dynamicBusinessItems = businessItems.map(item =>
        item.href === '/admin/inquiries' ? { ...item, badge: newInquiriesCount } : item
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F0', direction: isRTL ? 'rtl' : 'ltr' }}>
            {/* Sidebar */}
            <aside style={{
                width: 220, background: '#1A1A1A', display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, bottom: 0, zIndex: 100,
                overflowY: 'auto',
                [isRTL ? 'right' : 'left']: 0, // Dynamic positioning
                borderLeft: isRTL ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderRight: isRTL ? 'none' : '1px solid rgba(255,255,255,0.08)',
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, background: 'var(--gold)', borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 800, color: '#fff',
                    }}>S</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Saudi Wood Factory</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, fontWeight: 600 }}>ADMIN DASHBOARD</div>
                    </div>
                </div>

                {/* Main nav */}
                <nav style={{ flex: 1, padding: '12px 8px' }}>
                    {/* Overview */}
                    <NavItem
                        item={{ icon: '📊', labelEn: 'Overview', labelAr: 'نظرة عامة', href: '/admin' }}
                        isActive={isActive('/admin') && pathname === '/admin'}
                    />

                    {/* Inventory */}
                    <SectionLabel labelEn="INVENTORY" labelAr="المخزون" />
                    {inventoryItems.map(item => (
                        <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
                    ))}

                    {/* Business */}
                    <SectionLabel labelEn="BUSINESS" labelAr="الأعمال" />
                    {dynamicBusinessItems.map(item => (
                        <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
                    ))}

                    {/* System */}
                    <SectionLabel labelEn="SYSTEM" labelAr="النظام" />
                    {systemItems.map(item => (
                        <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
                    ))}
                </nav>

                {/* User */}
                <div style={{
                    padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(212,160,23,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--gold)', fontWeight: 700, fontSize: 13,
                        }}>AD</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin User</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Super Admin</div>
                        </div>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textDecoration: 'none' }}>↗</Link>
                    </div>

                    <button
                        onClick={async () => {
                            await fetch('/api/admin/logout', { method: 'POST' });
                            window.location.href = '/admin/login';
                        }}
                        style={{
                            width: '100%', padding: '8px', borderRadius: 8,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                    >
                        <span>🚪</span> {locale === 'ar' ? 'تسجيل الخروج' : 'Logout System'}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div style={{
                flex: 1,
                minHeight: '100vh',
                [isRTL ? 'marginRight' : 'marginLeft']: 220, // Dynamic margin
                transition: 'margin 0.2s',
            }}>
                {/* Top bar */}
                <header style={{
                    height: 56, background: '#fff',
                    borderBottom: '1px solid #E8E8E4',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 50,
                }}>
                    {/* Search */}
                    <div style={{
                        flex: 1, maxWidth: 320, display: 'flex', alignItems: 'center', gap: 8,
                        background: '#F5F5F0', borderRadius: 8, padding: '8px 14px',
                    }}>
                        <span style={{ fontSize: 14, color: '#999' }}>🔍</span>
                        <input
                            placeholder={locale === 'ar' ? 'بحث...' : 'Search ID, name...'}
                            style={{
                                border: 'none', background: 'transparent', outline: 'none',
                                fontSize: 13, color: '#333', width: '100%',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Language */}
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                            style={{
                                background: 'none', border: '1px solid #E8E8E4', borderRadius: 6,
                                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                padding: '5px 10px', color: '#555', display: 'flex', gap: 6,
                            }}
                        >
                            <span style={{ opacity: locale === 'ar' ? 1 : 0.4 }}>AR</span>
                            <span style={{ opacity: locale === 'en' ? 1 : 0.4 }}>EN</span>
                        </button>

                        {/* Notifications */}
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, position: 'relative', cursor: 'pointer',
                        }}>
                            🔔
                            {notifications > 0 && (
                                <span style={{
                                    position: 'absolute', top: 2, right: 2,
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: '#E53E3E', border: '2px solid #fff',
                                }} />
                            )}
                        </div>
                    </div>
                </header>

                <div style={{ padding: 0 }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
