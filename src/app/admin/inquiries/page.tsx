'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Inquiry as ApiInquiry } from '@/data/index';

interface Inquiry {
    id: string;
    clientName: string;
    clientEmail: string;
    clientInitials: string;
    productName: string;
    productDetail: string;
    status: 'New' | 'In Progress' | 'Contacted' | 'Closed';
    date: string;
    message: string;
    internalNotes: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
    'New': { bg: '#E8F5E9', color: '#2E7D32' },
    'In Progress': { bg: '#FFF3E0', color: '#E65100' },
    'Contacted': { bg: '#E3F2FD', color: '#1565C0' },
    'Closed': { bg: '#F3E5F5', color: '#7B1FA2' },
};

export default function InquiriesPage() {
    const { locale } = useI18n();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [productFilter, setProductFilter] = useState('All');

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const [inqRes, statsRes] = await Promise.all([
                    fetch('/api/inquiries'),
                    fetch('/api/admin/stats')
                ]);

                if (inqRes.ok) {
                    const data: ApiInquiry[] = await inqRes.json();
                    const mapped: Inquiry[] = data.map(item => ({
                        id: item.id,
                        clientName: item.name,
                        clientEmail: item.email || item.phone || '',
                        clientInitials: item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                        productName: item.productId || 'General Inquiry',
                        productDetail: item.message.substring(0, 30) + '...',
                        status: (item.status === 'pending' ? 'New' : item.status === 'read' ? 'In Progress' : 'Contacted') as Inquiry['status'],
                        date: new Date(item.createdAt || '').toLocaleDateString(),
                        message: item.message,
                        internalNotes: '',
                    }));
                    setInquiries(mapped);
                }

                if (statsRes.ok) {
                    const sData = await statsRes.json();
                    if (sData.inquiryStats) {
                        setStats([
                            { labelEn: 'Total Inquiries', labelAr: 'إجمالي الاستفسارات', value: sData.inquiryStats.total.toString(), icon: '📋', subEn: '', subAr: '', color: 'var(--gold)' },
                            { labelEn: 'New / Unread', labelAr: 'جديد / غير مقروء', value: sData.inquiryStats.new.toString(), icon: '✉', subEn: 'Requires attention', subAr: 'تتطلب انتباه', color: '#3182CE' },
                            { labelEn: 'In Progress', labelAr: 'قيد التنفيذ', value: sData.inquiryStats.inProgress.toString(), icon: '🔄', subEn: 'Active discussions', subAr: 'مناقشات نشطة', color: '#DD6B20' },
                            { labelEn: 'Contacted', labelAr: 'تم التواصل', value: (sData.inquiryStats.closed || 0).toString(), icon: '✅', subEn: 'Total completed', subAr: 'إجمالي المكتملة', color: '#38A169' },
                        ]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch inquiries', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInquiries();
    }, []);



    const filteredInquiries = inquiries.filter(inq => {
        if (statusFilter !== 'All' && inq.status !== statusFilter) return false;
        return true;
    });

    const updateNotes = (id: string, notes: string) => {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, internalNotes: notes } : inq));
    };

    const updateStatus = (id: string, status: Inquiry['status']) => {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                        {locale === 'ar' ? 'إدارة الاستفسارات' : 'Inquiry Management'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#888' }}>
                        Dashboard › {locale === 'ar' ? 'الاستفسارات' : 'Inquiries'}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{
                        background: '#fff', borderRadius: 12, padding: '18px 20px',
                        border: '1px solid #E8E8E4',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {locale === 'ar' ? s.labelAr : s.labelEn}
                            </p>
                            <span style={{ fontSize: 18 }}>{s.icon}</span>
                        </div>
                        <p style={{ fontSize: 30, fontWeight: 800, color: '#1A1A1A', marginBottom: 2 }}>{s.value}</p>
                        <p style={{ fontSize: 12, color: s.color, fontWeight: 500 }}>
                            {locale === 'ar' ? s.subAr : s.subEn}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff', cursor: 'pointer' }}
                >
                    <option value="All">{locale === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                </select>
                <select
                    value={productFilter}
                    onChange={e => setProductFilter(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff', cursor: 'pointer' }}
                >
                    <option value="All">{locale === 'ar' ? 'جميع المنتجات' : 'All Products'}</option>
                    <option>Interior Doors</option>
                    <option>Exterior Doors</option>
                    <option>Fire-Rated</option>
                </select>
                <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    📅 {locale === 'ar' ? 'نطاق التاريخ' : 'Date Range'}
                </button>
                <div style={{ flex: 1 }} />
                <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff', cursor: 'pointer' }}>⬇</button>
                <button style={{
                    padding: '8px 18px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700,
                    background: '#1A1A1A', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>+ Manual Entry</button>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr 1fr 130px 120px 60px',
                    padding: '12px 20px', borderBottom: '1px solid #E8E8E4',
                    fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                    <span>ID</span>
                    <span>{locale === 'ar' ? 'تفاصيل العميل' : 'Client Details'}</span>
                    <span>{locale === 'ar' ? 'المنتج المطلوب' : 'Product Interest'}</span>
                    <span>{locale === 'ar' ? 'الحالة' : 'Status'}</span>
                    <span>{locale === 'ar' ? 'التاريخ' : 'Date'}</span>
                    <span>{locale === 'ar' ? 'إجراءات' : 'Actions'}</span>
                </div>

                {/* Rows */}
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                        Loading inquiries...
                    </div>
                ) : filteredInquiries.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                        No inquiries found.
                    </div>
                ) : (
                    filteredInquiries.map(inq => (
                        <div key={inq.id}>
                            {/* Main Row */}
                            <div
                                style={{
                                    display: 'grid', gridTemplateColumns: '80px 1fr 1fr 130px 120px 60px',
                                    padding: '16px 20px', borderBottom: '1px solid #F0F0EC',
                                    alignItems: 'center', cursor: 'pointer',
                                    background: expandedId === inq.id ? '#FAFAF8' : '#fff',
                                    transition: 'background 0.15s',
                                }}
                                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                            >
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>#{inq.id.replace('INQ-', '')}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%', background: '#F0F0EC',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 700, color: '#555', flexShrink: 0,
                                    }}>{inq.clientInitials}</div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{inq.clientName}</p>
                                        <p style={{ fontSize: 12, color: '#999' }}>{inq.clientEmail}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #8B6914, #D4A017)',
                                        flexShrink: 0,
                                    }} />
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{inq.productName}</p>
                                        <p style={{ fontSize: 11, color: '#999' }}>{inq.productDetail}</p>
                                    </div>
                                </div>
                                <div>
                                    <select
                                        value={inq.status}
                                        onChange={e => { e.stopPropagation(); updateStatus(inq.id, e.target.value as Inquiry['status']); }}
                                        onClick={e => e.stopPropagation()}
                                        style={{
                                            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            background: statusColors[inq.status].bg, color: statusColors[inq.status].color,
                                            border: 'none', cursor: 'pointer', outline: 'none',
                                        }}
                                    >
                                        <option value="New">● New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Contacted">● Contacted</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                                <span style={{ fontSize: 13, color: '#888' }}>{inq.date}</span>
                                <button style={{
                                    background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888',
                                    transform: expandedId === inq.id ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 0.2s',
                                }}>⌄</button>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === inq.id && (
                                <div style={{
                                    padding: '20px', background: '#FAFAF8',
                                    borderBottom: '1px solid #E8E8E4',
                                    display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24,
                                }}>
                                    {/* Left - Client Message & Notes */}
                                    <div>
                                        <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
                                            Client Message
                                        </h4>
                                        <div style={{
                                            background: '#fff', borderRadius: 10, padding: 16,
                                            border: '1px solid #E8E8E4', fontSize: 14, lineHeight: 1.7,
                                            color: '#333', marginBottom: 20,
                                        }}>
                                            {inq.message}
                                        </div>

                                        <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            📝 Internal Team Notes
                                            <span style={{ fontWeight: 400, color: '#999', textTransform: 'none', fontSize: 11, marginLeft: 'auto' }}>Last updated by Admin, 1 hour ago</span>
                                        </h4>
                                        <textarea
                                            value={inq.internalNotes}
                                            onChange={e => updateNotes(inq.id, e.target.value)}
                                            placeholder="Add notes about this client call or status..."
                                            rows={4}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: 10,
                                                border: '1px solid #E8E8E4', fontSize: 13,
                                                resize: 'vertical', fontFamily: 'inherit', outline: 'none',
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                            <button style={{
                                                padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                                                border: '1px solid var(--gold)', background: 'transparent',
                                                color: 'var(--gold)', cursor: 'pointer',
                                            }}>Save Note</button>
                                        </div>
                                    </div>

                                    {/* Right - Direct Actions */}
                                    <div>
                                        <h4 style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>
                                            Direct Actions
                                        </h4>
                                        <button style={{
                                            width: '100%', padding: '12px', borderRadius: 10,
                                            border: '1px solid #E8E8E4', background: '#fff',
                                            fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            color: '#333', marginBottom: 8,
                                        }}>
                                            ✉ Reply via Email
                                        </button>
                                        <button style={{
                                            width: '100%', padding: '12px', borderRadius: 10,
                                            border: '2px solid #25D366', background: '#F0FFF4',
                                            fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            color: '#25D366', marginBottom: 8,
                                        }}>
                                            💬 Chat on WhatsApp
                                        </button>
                                        <button style={{
                                            width: '100%', padding: '12px', borderRadius: 10,
                                            border: '1px solid #E8E8E4', background: '#fff',
                                            fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            color: '#333',
                                        }}>
                                            📄 Generate Quote PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )))}
            </div>
        </div>
    );
}
