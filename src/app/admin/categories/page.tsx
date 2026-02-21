'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface Category {
    id: string;
    nameEn: string;
    nameAr: string;
    slug: string;
    productCount: number;
    status: 'active' | 'inactive';
    icon: string;
}

const initialCategories: Category[] = [
    { id: '1', nameEn: 'Interior Doors', nameAr: 'أبواب داخلية', slug: 'interior-doors', productCount: 18, status: 'active', icon: '🚪' },
    { id: '2', nameEn: 'Exterior Doors', nameAr: 'أبواب خارجية', slug: 'exterior-doors', productCount: 12, status: 'active', icon: '🏠' },
    { id: '3', nameEn: 'Fire-Rated', nameAr: 'مقاومة للحريق', slug: 'fire-rated', productCount: 8, status: 'active', icon: '🔥' },
    { id: '4', nameEn: 'Commercial', nameAr: 'تجاري', slug: 'commercial', productCount: 6, status: 'active', icon: '🏢' },
    { id: '5', nameEn: 'Custom Joinery', nameAr: 'نجارة مخصصة', slug: 'custom-joinery', productCount: 4, status: 'active', icon: '🛠' },
    { id: '6', nameEn: 'Acoustic', nameAr: 'صوتية', slug: 'acoustic', productCount: 0, status: 'inactive', icon: '🔇' },
];

export default function CategoriesPage() {
    const { locale } = useI18n();
    const [categories, setCategories] = useState(initialCategories);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNameEn, setEditNameEn] = useState('');
    const [editNameAr, setEditNameAr] = useState('');

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditNameEn(cat.nameEn);
        setEditNameAr(cat.nameAr);
    };

    const saveEdit = () => {
        setCategories(prev => prev.map(c => c.id === editingId ? { ...c, nameEn: editNameEn, nameAr: editNameAr } : c));
        setEditingId(null);
    };

    const toggleStatus = (id: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    };

    const addCategory = () => {
        const newCat: Category = {
            id: String(categories.length + 1), nameEn: 'New Category', nameAr: 'فئة جديدة',
            slug: 'new-category', productCount: 0, status: 'inactive', icon: '📁',
        };
        setCategories(prev => [...prev, newCat]);
        startEdit(newCat);
    };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                        {locale === 'ar' ? 'إدارة الفئات' : 'Categories'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#888' }}>Inventory › Categories</p>
                </div>
                <button onClick={addCategory} style={{
                    padding: '10px 20px', borderRadius: 8, border: 'none',
                    background: '#1A1A1A', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>+ Add Category</button>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '50px 1fr 1fr 80px 100px 120px 80px',
                    padding: '12px 20px', borderBottom: '1px solid #E8E8E4',
                    fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                    <span></span>
                    <span>Name (EN)</span>
                    <span>Name (AR)</span>
                    <span>Products</span>
                    <span>Status</span>
                    <span>Slug</span>
                    <span>Actions</span>
                </div>
                {categories.map(cat => (
                    <div key={cat.id} style={{
                        display: 'grid', gridTemplateColumns: '50px 1fr 1fr 80px 100px 120px 80px',
                        padding: '14px 20px', borderBottom: '1px solid #F0F0EC', alignItems: 'center',
                    }}>
                        <span style={{ fontSize: 20 }}>{cat.icon}</span>
                        {editingId === cat.id ? (
                            <>
                                <input value={editNameEn} onChange={e => setEditNameEn(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--gold)', fontSize: 13, outline: 'none' }} />
                                <input value={editNameAr} onChange={e => setEditNameAr(e.target.value)} dir="rtl" style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--gold)', fontSize: 13, outline: 'none', textAlign: 'right' }} />
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{cat.nameEn}</span>
                                <span style={{ fontSize: 14, color: '#555' }}>{cat.nameAr}</span>
                            </>
                        )}
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', textAlign: 'center' }}>{cat.productCount}</span>
                        <button onClick={() => toggleStatus(cat.id)} style={{
                            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: cat.status === 'active' ? '#E8F5E9' : '#F5F5F5',
                            color: cat.status === 'active' ? '#2E7D32' : '#999',
                        }}>{cat.status === 'active' ? 'Active' : 'Inactive'}</button>
                        <span style={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}>{cat.slug}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {editingId === cat.id ? (
                                <button onClick={saveEdit} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}>✅</button>
                            ) : (
                                <button onClick={() => startEdit(cat)} style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}>✏️</button>
                            )}
                            <button style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}>🗑</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
