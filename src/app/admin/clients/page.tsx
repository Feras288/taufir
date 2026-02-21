'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface Client {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    type: 'Individual' | 'Corporate' | 'Government';
    totalInquiries: number;
    totalOrders: number;
    lastContact: string;
    status: 'Active' | 'Inactive';
}

const initialClients: Client[] = [
    { id: 'CL-001', name: 'Faisal Al-Saud', company: 'Al-Saud Holdings', email: 'faisal@example.com', phone: '+966 55 123 4567', type: 'Corporate', totalInquiries: 5, totalOrders: 3, lastContact: '2 mins ago', status: 'Active' },
    { id: 'CL-002', name: 'Mohammed Al-Harbi', company: '—', email: 'mohammed@example.com', phone: '+966 55 987 6543', type: 'Individual', totalInquiries: 2, totalOrders: 1, lastContact: 'Yesterday', status: 'Active' },
    { id: 'CL-003', name: 'China Construction Ltd', company: 'China Construction', email: 'procurement@example.cn', phone: '+86 10 1234 5678', type: 'Corporate', totalInquiries: 8, totalOrders: 12, lastContact: 'Oct 24, 2024', status: 'Active' },
    { id: 'CL-004', name: 'Sara Al-Rashid', company: 'Al-Rashid Interior Design', email: 'sara@design.sa', phone: '+966 50 111 2222', type: 'Corporate', totalInquiries: 3, totalOrders: 2, lastContact: 'Oct 20, 2024', status: 'Active' },
    { id: 'CL-005', name: 'Ministry of Education', company: 'Ministry of Education', email: 'procurement@moe.gov.sa', phone: '+966 11 333 4444', type: 'Government', totalInquiries: 1, totalOrders: 0, lastContact: 'Oct 15, 2024', status: 'Inactive' },
];

export default function ClientsPage() {
    const { locale } = useI18n();
    const [clients] = useState(initialClients);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    const filtered = clients.filter(c => {
        const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = typeFilter === 'All' || c.type === typeFilter;
        return matchSearch && matchType;
    });

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                        {locale === 'ar' ? 'العملاء' : 'Clients'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#888' }}>Business › Clients</p>
                </div>
                <button style={{
                    padding: '10px 20px', borderRadius: 8, border: 'none',
                    background: '#1A1A1A', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>+ Add Client</button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
                    borderRadius: 8, border: '1px solid #E8E8E4', padding: '8px 14px', flex: 1, maxWidth: 300,
                }}>
                    <span style={{ color: '#999' }}>🔍</span>
                    <input
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder={locale === 'ar' ? 'البحث عن عميل...' : 'Search clients...'}
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }}
                    />
                </div>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff' }}>
                    <option value="All">All Types</option>
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Government">Government</option>
                </select>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '70px 1fr 1fr 100px 80px 80px 100px 80px',
                    padding: '12px 20px', borderBottom: '1px solid #E8E8E4',
                    fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                    <span>ID</span>
                    <span>Client</span>
                    <span>Contact</span>
                    <span>Type</span>
                    <span>Inquiries</span>
                    <span>Orders</span>
                    <span>Last Contact</span>
                    <span>Status</span>
                </div>
                {filtered.map(client => (
                    <div key={client.id} style={{
                        display: 'grid', gridTemplateColumns: '70px 1fr 1fr 100px 80px 80px 100px 80px',
                        padding: '14px 20px', borderBottom: '1px solid #F0F0EC', alignItems: 'center',
                        cursor: 'pointer', transition: 'background 0.15s',
                    }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#999' }}>{client.id}</span>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{client.name}</p>
                            <p style={{ fontSize: 12, color: '#999' }}>{client.company}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 13, color: '#555' }}>{client.email}</p>
                            <p style={{ fontSize: 12, color: '#999' }}>{client.phone}</p>
                        </div>
                        <span style={{
                            padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                            background: client.type === 'Corporate' ? '#E3F2FD' : client.type === 'Government' ? '#FFF3E0' : '#F5F5F5',
                            color: client.type === 'Corporate' ? '#1565C0' : client.type === 'Government' ? '#E65100' : '#555',
                        }}>{client.type}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', textAlign: 'center' }}>{client.totalInquiries}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', textAlign: 'center' }}>{client.totalOrders}</span>
                        <span style={{ fontSize: 12, color: '#888' }}>{client.lastContact}</span>
                        <span style={{
                            width: 8, height: 8, borderRadius: '50%', margin: '0 auto',
                            background: client.status === 'Active' ? '#38A169' : '#ccc',
                        }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
