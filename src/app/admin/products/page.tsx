'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Product, ProductFinish } from '@/data/index';

const categoryFilters = ['All', 'interior', 'exterior', 'fire-rated', 'custom'];
const categoryLabels: Record<string, { en: string; ar: string }> = {
    All: { en: 'All', ar: 'الكل' },
    interior: { en: 'Interior', ar: 'داخلي' },
    exterior: { en: 'Exterior', ar: 'خارجي' },
    'fire-rated': { en: 'Fire-Rated', ar: 'مقاوم للحريق' },
    custom: { en: 'Custom', ar: 'مخصص' },
};

export default function ProductsManagement() {
    const { locale } = useI18n();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [specsList, setSpecsList] = useState<any[]>([]); // Dynamic specs
    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const additionalFileInputRef = useRef<HTMLInputElement>(null);
    const catalogFileInputRef = useRef<HTMLInputElement>(null);

    // Load products from API
    const loadProducts = useCallback(() => {
        fetch('/api/products')
            .then(r => r.json())
            .then((data: Product[]) => {
                setProducts(data);
                if (!selectedId && data.length > 0) setSelectedId(data[0].id);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [selectedId]);

    // Load specs from API
    useEffect(() => {
        fetch('/api/specifications')
            .then(r => r.json())
            .then(data => setSpecsList(data))
            .catch(err => console.error('Failed to load specs', err));
    }, []);

    useEffect(() => { loadProducts(); }, []);

    const selected = products.find(p => p.id === selectedId);

    const filteredProducts = products.filter(p => {
        const matchFilter = activeFilter === 'All' || p.category === activeFilter;
        const matchSearch = !searchQuery || p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || p.nameAr.includes(searchQuery);
        return matchFilter && matchSearch;
    });

    const updateProductLocal = (field: string, value: any) => {
        setProducts(prev => prev.map(p => p.id === selectedId ? { ...p, [field]: value } : p));
    };

    const addNewProduct = async () => {
        const num = products.length + 1;
        const newId = `new-product-${Date.now()}`;
        const newProduct: Product = {
            id: newId,
            nameEn: '',
            nameAr: '',
            descEn: '',
            descAr: '',
            category: 'interior',
            seriesEn: '',
            seriesAr: '',
            badges: [],
            image: '',
            images: [],
            finishes: [],
            specs: { material: '', dimensions: '', finish: '' },
            ref: `WDF-NEW-${String(num).padStart(2, '0')}`,
            price: 0,
            priceTiers: [],
            showInStore: true,
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (res.ok) {
                const saved = await res.json();
                setProducts(prev => [saved, ...prev]);
                setSelectedId(saved.id);
                setActiveFilter('All');
                setSearchQuery('');
            }
        } catch {
            // fallback to local only
            setProducts(prev => [newProduct, ...prev]);
            setSelectedId(newId);
            setActiveFilter('All');
        }
    };

    const deleteProduct = async (id: string) => {
        const confirmed = window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Delete this product?');
        if (!confirmed) return;

        try {
            await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        } catch { /* continue with local delete */ }

        setProducts(prev => {
            const updated = prev.filter(p => p.id !== id);
            if (selectedId === id && updated.length > 0) setSelectedId(updated[0].id);
            else if (updated.length === 0) setSelectedId('');
            return updated;
        });
    };

    const handleSave = async () => {
        if (!selected) return;

        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected),
            });
            if (res.ok) {
                setSaveMessage(locale === 'ar' ? '✓ تم الحفظ! التغييرات ستظهر في الموقع' : '✓ Saved! Changes will appear on the site');
            } else {
                setSaveMessage(locale === 'ar' ? '✗ خطأ في الحفظ' : '✗ Save error');
            }
        } catch {
            setSaveMessage(locale === 'ar' ? '✗ خطأ في الحفظ' : '✗ Save error');
        }
        setTimeout(() => setSaveMessage(''), 3000);
    };

    // Main image upload - replaces the featured/main image
    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selected || !e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            updateProductLocal('image', reader.result as string);
        };
        reader.readAsDataURL(file);
        if (mainFileInputRef.current) mainFileInputRef.current.value = '';
    };

    // Additional images upload - appends to the images array
    const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selected || !e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string;
                setProducts(prev => prev.map(p => {
                    if (p.id !== selectedId) return p;
                    return { ...p, images: [...(p.images || []), dataUrl] };
                }));
            };
            reader.readAsDataURL(file);
        });
        if (additionalFileInputRef.current) additionalFileInputRef.current.value = '';
    };

    // Catalog upload
    const handleCatalogUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selected || !e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (file.type !== 'application/pdf') {
            alert(locale === 'ar' ? 'يرجى اختيار ملف PDF فقط' : 'Please select a PDF file only');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            updateProductLocal('catalog', reader.result as string);
        };
        reader.readAsDataURL(file);
        if (catalogFileInputRef.current) catalogFileInputRef.current.value = '';
    };

    // Remove catalog
    const removeCatalog = () => {
        updateProductLocal('catalog', undefined);
    };

    // Remove main image
    const removeMainImage = () => {
        updateProductLocal('image', '');
    };

    // Remove an additional image by its index in the images array
    const removeAdditionalImage = (index: number) => {
        if (!selected) return;
        const newImages = [...(selected.images || [])];
        newImages.splice(index, 1);
        setProducts(prev => prev.map(p => p.id === selectedId ? { ...p, images: newImages } : p));
    };

    // Finishes Management
    const addFinish = () => {
        if (!selected) return;
        const newFinish = { name: '', color: '#000000', imageIndex: -1 };
        const newFinishes = [...(selected.finishes || []), newFinish];
        updateProductLocal('finishes', newFinishes);
    };

    const removeFinish = (index: number) => {
        if (!selected) return;
        const newFinishes = [...(selected.finishes || [])];
        newFinishes.splice(index, 1);
        updateProductLocal('finishes', newFinishes);
    };

    const updateFinish = (index: number, field: keyof ProductFinish, value: any) => {
        if (!selected) return;
        const newFinishes = [...(selected.finishes || [])];
        newFinishes[index] = { ...newFinishes[index], [field]: value };
        updateProductLocal('finishes', newFinishes);
    };

    // Tiered Pricing Management
    const addTier = () => {
        if (!selected) return;
        const newTiers = [...(selected.priceTiers || []), { min: 5, price: (selected.price || 0) * 0.9 }];
        updateProductLocal('priceTiers', newTiers);
    };

    const removeTier = (index: number) => {
        if (!selected) return;
        const newTiers = [...(selected.priceTiers || [])];
        newTiers.splice(index, 1);
        updateProductLocal('priceTiers', newTiers);
    };

    const updateTier = (index: number, field: 'min' | 'price', value: number) => {
        if (!selected) return;
        const newTiers = [...(selected.priceTiers || [])];
        newTiers[index] = { ...newTiers[index], [field]: value };
        updateProductLocal('priceTiers', newTiers);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', color: '#999' }}>
                <p>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
            {/* Hidden file inputs */}
            <input
                ref={mainFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleMainImageUpload}
                style={{ display: 'none' }}
            />
            <input
                ref={additionalFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleAdditionalImagesUpload}
                style={{ display: 'none' }}
            />
            <input
                ref={catalogFileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleCatalogUpload}
                style={{ display: 'none' }}
            />

            {/* Left Panel - Product List */}
            <div style={{
                width: 380, borderRight: '1px solid #E8E8E4', background: '#fff',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
                <div style={{ padding: '20px 16px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>
                            {locale === 'ar' ? 'جميع المنتجات' : 'All Products'}
                        </h2>
                        <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{products.length} {locale === 'ar' ? 'منتج' : 'items'}</span>
                    </div>
                    {/* Search */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, background: '#F5F5F0',
                        borderRadius: 8, padding: '7px 12px', marginBottom: 10,
                    }}>
                        <span style={{ color: '#999', fontSize: 13 }}>🔍</span>
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={locale === 'ar' ? 'بحث في المنتجات...' : 'Search products...'}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#333' }}
                        />
                    </div>
                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {categoryFilters.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                style={{
                                    padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                    background: activeFilter === cat ? '#1A1A1A' : '#F0F0EC',
                                    color: activeFilter === cat ? '#fff' : '#555',
                                }}
                            >
                                {locale === 'ar' ? categoryLabels[cat]?.ar : categoryLabels[cat]?.en}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add New Product */}
                <button
                    onClick={addNewProduct}
                    style={{
                        margin: '4px 16px 8px', padding: '12px',
                        border: '2px dashed var(--gold)', borderRadius: 10,
                        background: 'transparent', cursor: 'pointer',
                        fontSize: 14, fontWeight: 600, color: 'var(--gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                >
                    ⊕ {locale === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                </button>

                {/* Product List */}
                <div style={{ flex: 1, overflow: 'auto', padding: '0 8px 16px' }}>
                    {filteredProducts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 32, color: '#999', fontSize: 14 }}>
                            {locale === 'ar' ? 'لا توجد منتجات' : 'No products found'}
                        </div>
                    )}
                    {filteredProducts.map(p => (
                        <div
                            key={p.id}
                            onClick={() => setSelectedId(p.id)}
                            style={{
                                padding: '12px', borderRadius: 10, cursor: 'pointer',
                                border: selectedId === p.id ? '2px solid var(--gold)' : '2px solid transparent',
                                background: selectedId === p.id ? '#FFFBF0' : 'transparent',
                                marginBottom: 4, transition: 'all 0.15s',
                                display: 'flex', gap: 12, alignItems: 'center',
                            }}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                                background: p.image
                                    ? `url(${p.image}) center/cover`
                                    : 'linear-gradient(135deg, #8B6914, #D4A017)',
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {locale === 'ar' ? (p.nameAr || 'منتج جديد') : (p.nameEn || 'New Product')}
                                </p>
                                <p style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 2 }}>
                                    {locale === 'ar' ? p.nameEn : p.nameAr}
                                </p>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                        background: '#1A1A1A', color: '#fff', textTransform: 'uppercase',
                                    }}>
                                        {locale === 'ar' ? categoryLabels[p.category]?.ar : categoryLabels[p.category]?.en}
                                    </span>
                                    <span style={{ fontSize: 11, color: '#888' }}>{p.ref}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Edit Product */}
            {selected ? (
                <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
                    {/* Main Edit Area */}
                    <div style={{ flex: 1, padding: 24, maxWidth: 700 }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                            <div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                                    {locale === 'ar' ? 'تعديل المنتج' : 'Edit Product'}
                                </h2>
                                <p style={{ fontSize: 12, color: '#888' }}>
                                    REF: {selected.ref} • {locale === 'ar' ? categoryLabels[selected.category]?.ar : categoryLabels[selected.category]?.en}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    onClick={() => deleteProduct(selected.id)}
                                    style={{
                                        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        border: '1px solid #E53E3E', background: '#fff', cursor: 'pointer', color: '#E53E3E',
                                    }}
                                >🗑 {locale === 'ar' ? 'حذف' : 'Delete'}</button>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                                        border: 'none',
                                        background: saveMessage?.includes('✓') ? '#38A169' : saveMessage?.includes('✗') ? '#E53E3E' : '#1A1A1A',
                                        color: '#fff', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', minWidth: 170,
                                        justifyContent: 'center',
                                    }}
                                >{saveMessage || (locale === 'ar' ? '💾 حفظ التغييرات' : '💾 Save Changes')}</button>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                            padding: 24, marginBottom: 20,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <span style={{ fontSize: 16 }}>📝</span>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                                    {locale === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                                </h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Product Name (EN)</label>
                                    <input
                                        value={selected.nameEn}
                                        onChange={e => updateProductLocal('nameEn', e.target.value)}
                                        placeholder="Enter product name..."
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textAlign: 'right' }}>اسم المنتج (AR)</label>
                                    <input
                                        value={selected.nameAr}
                                        onChange={e => updateProductLocal('nameAr', e.target.value)}
                                        placeholder="أدخل اسم المنتج..."
                                        dir="rtl"
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none', textAlign: 'right' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Description (EN)</label>
                                    <textarea
                                        value={selected.descEn}
                                        onChange={e => updateProductLocal('descEn', e.target.value)}
                                        placeholder="Enter product description..."
                                        rows={4}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textAlign: 'right' }}>الوصف (AR)</label>
                                    <textarea
                                        value={selected.descAr}
                                        onChange={e => updateProductLocal('descAr', e.target.value)}
                                        placeholder="أدخل وصف المنتج..."
                                        dir="rtl"
                                        rows={4}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', textAlign: 'right' }}
                                    />
                                </div>
                            </div>

                            {/* Category & Series */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Category</label>
                                    <select
                                        value={selected.category}
                                        onChange={e => updateProductLocal('category', e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, background: '#fff' }}
                                    >
                                        <option value="interior">Interior</option>
                                        <option value="exterior">Exterior</option>
                                        <option value="fire-rated">Fire-Rated</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Series (EN)</label>
                                    <input
                                        value={selected.seriesEn}
                                        onChange={e => updateProductLocal('seriesEn', e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', textAlign: 'right' }}>السلسلة (AR)</label>
                                    <input
                                        value={selected.seriesAr}
                                        onChange={e => updateProductLocal('seriesAr', e.target.value)}
                                        dir="rtl"
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none', textAlign: 'right' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Price (SAR)</label>
                                    <input
                                        type="number"
                                        value={selected.price || ''}
                                        onChange={e => updateProductLocal('price', parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 16 }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                                    padding: '10px 12px', borderRadius: 8, border: '1px solid ' + (selected.showInStore ? '#48BB78' : '#E8E8E4'),
                                    background: selected.showInStore ? '#F0FFF4' : '#fff',
                                    width: 'fit-content'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={selected.showInStore !== false}
                                        onChange={e => updateProductLocal('showInStore', e.target.checked)}
                                        style={{ width: 18, height: 18, accentColor: '#48BB78' }}
                                    />
                                    <span style={{ fontSize: 13, fontWeight: 600, color: selected.showInStore ? '#2F855A' : '#888' }}>
                                        {locale === 'ar' ? 'عرض في المتجر' : 'Show in Store'}
                                    </span>
                                </label>
                            </div>

                            {/* Volume Pricing Tiers */}
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed #E8E8E4' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>
                                        {locale === 'ar' ? 'أسعار الجملة (حسب الكمية)' : 'Volume Pricing (Tiers)'}
                                    </label>
                                    <button
                                        onClick={addTier}
                                        style={{ fontSize: 11, padding: '4px 8px', background: '#F0F0EC', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        + {locale === 'ar' ? 'إضافة شريحة' : 'Add Tier'}
                                    </button>
                                </div>

                                {(selected.priceTiers || []).length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {(selected.priceTiers || []).map((tier, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <div style={{ flex: 1 }}>
                                                    <input
                                                        type="number"
                                                        value={tier.min}
                                                        onChange={e => updateTier(i, 'min', parseInt(e.target.value))}
                                                        placeholder="Min Qty"
                                                        style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13 }}
                                                    />
                                                </div>
                                                <span style={{ color: '#aaa' }}>→</span>
                                                <div style={{ flex: 1 }}>
                                                    <input
                                                        type="number"
                                                        value={tier.price}
                                                        onChange={e => updateTier(i, 'price', parseFloat(e.target.value))}
                                                        placeholder="Price"
                                                        style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13 }}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeTier(i)}
                                                    style={{ color: '#E53E3E', border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}
                                                >✕</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: 12, color: '#ccc', fontStyle: 'italic' }}>
                                        {locale === 'ar' ? 'لا توجد خصومات كميات' : 'No volume discounts configured'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Finishes Management */}
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                            padding: 24, marginBottom: 24,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--charcoal)' }}>
                                    {locale === 'ar' ? 'تشطيبات المنتج' : 'Product Finishes'}
                                </h3>
                                <button
                                    onClick={addFinish}
                                    style={{
                                        padding: '6px 12px', borderRadius: 6, background: '#FAFAF8',
                                        border: '1px solid #E8E8E4', fontSize: 12, fontWeight: 600,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                    }}
                                >
                                    <span>+</span> {locale === 'ar' ? 'إضافة تشطيب' : 'Add Finish'}
                                </button>
                            </div>

                            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                                {locale === 'ar'
                                    ? 'أضف خيارات الألوان (التشطيبات) واربط كل لون بصورة محددة ليتم عرضها عند اختيار العميل.'
                                    : 'Add color finishes and link each to a specific image to be displayed when selected.'}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {(selected.finishes || []).map((finish, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                                        background: '#FAFAF8', borderRadius: 8, border: '1px solid #E8E8E4'
                                    }}>
                                        {/* Color Picker */}
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="color"
                                                value={finish.color}
                                                onChange={e => updateFinish(i, 'color', e.target.value)}
                                                style={{
                                                    width: 40, height: 40, padding: 0, border: 'none',
                                                    borderRadius: '50%', overflow: 'hidden', cursor: 'pointer',
                                                }}
                                            />
                                        </div>

                                        {/* Name Input */}
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: 11, fontWeight: 600, color: '#999', display: 'block', marginBottom: 4 }}>
                                                {locale === 'ar' ? 'اسم اللون' : 'Name'}
                                            </label>
                                            <input
                                                value={finish.name}
                                                onChange={e => updateFinish(i, 'name', e.target.value)}
                                                placeholder="e.g. Dark Walnut"
                                                style={{
                                                    width: '100%', padding: '8px', borderRadius: 6,
                                                    border: '1px solid #ddd', fontSize: 13, outline: 'none'
                                                }}
                                            />
                                        </div>

                                        {/* Image Link Dropdown */}
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: 11, fontWeight: 600, color: '#999', display: 'block', marginBottom: 4 }}>
                                                {locale === 'ar' ? 'الصورة المرتبطة' : 'Linked Image'}
                                            </label>
                                            <select
                                                value={finish.imageIndex !== undefined ? finish.imageIndex : -1}
                                                onChange={e => updateFinish(i, 'imageIndex', parseInt(e.target.value))}
                                                style={{
                                                    width: '100%', padding: '8px', borderRadius: 6,
                                                    border: '1px solid #ddd', fontSize: 13, outline: 'none', background: '#fff'
                                                }}
                                            >
                                                <option value={-1}>{locale === 'ar' ? 'بدون صورة' : 'No Link'}</option>
                                                {selected.image && <option value={0}>{locale === 'ar' ? 'الصورة الرئيسية' : 'Main Image'}</option>}
                                                {(selected.images || []).map((_, imgIdx) => (
                                                    <option key={imgIdx} value={imgIdx + 1}>
                                                        {locale === 'ar' ? `صورة إضافية ${imgIdx + 1}` : `Additional Image ${imgIdx + 1}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFinish(i)}
                                            style={{
                                                width: 32, height: 32, borderRadius: 6, border: '1px solid #ffcccc',
                                                background: '#fff5f5', color: '#cc0000', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                            title={locale === 'ar' ? 'حذف' : 'Remove'}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Technical Specifications */}
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                            padding: 24, marginBottom: 24,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <span style={{ fontSize: 16 }}>📏</span>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                                    {locale === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {specsList.map((spec: any) => (
                                    <div key={spec.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                                        <label style={{ width: 130, fontSize: 13, fontWeight: 600, color: '#555', flexShrink: 0 }}>
                                            {locale === 'ar' ? spec.nameAr : spec.nameEn}
                                        </label>
                                        {spec.options && spec.options.length > 0 ? (
                                            <select
                                                value={(selected.specs as any)[spec.key || spec.nameEn.toLowerCase()] || ''}
                                                onChange={e => {
                                                    const key = spec.key || spec.nameEn.toLowerCase();
                                                    const newSpecs = { ...selected.specs, [key]: e.target.value };
                                                    updateProductLocal('specs', newSpecs);
                                                }}
                                                style={{
                                                    flex: 1, padding: '8px 12px', borderRadius: 8,
                                                    border: '1px solid #E8E8E4', fontSize: 13, background: '#fff'
                                                }}
                                            >
                                                <option value="">{locale === 'ar' ? 'اختر...' : 'Select...'}</option>
                                                {spec.options.map((opt: any) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                value={(selected.specs as any)[spec.key || spec.nameEn.toLowerCase()] || ''}
                                                onChange={e => {
                                                    const key = spec.key || spec.nameEn.toLowerCase();
                                                    const newSpecs = { ...selected.specs, [key]: e.target.value };
                                                    updateProductLocal('specs', newSpecs);
                                                }}
                                                placeholder={locale === 'ar' ? `أدخل ${spec.nameAr}...` : `Enter ${spec.nameEn.toLowerCase()}...`}
                                                style={{
                                                    flex: 1, padding: '8px 12px', borderRadius: 8,
                                                    border: '1px solid #E8E8E4', fontSize: 13, outline: 'none',
                                                }}
                                            />
                                        )}
                                        {spec.unit && <span style={{ fontSize: 12, color: '#888' }}>{spec.unit}</span>}
                                    </div>
                                ))}
                            </div>

                            {/* Save reminder */}
                            <div style={{
                                marginTop: 16, padding: '12px 16px', borderRadius: 8,
                                background: '#FFF9E6', border: '1px solid rgba(212,160,23,0.2)',
                                fontSize: 13, color: '#8B6914', display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                                💡 {locale === 'ar'
                                    ? 'اضغط "حفظ التغييرات" لتحديث الموقع. التعديلات ستظهر فوراً على الموقع العام.'
                                    : 'Click "Save Changes" to update the site. Changes will appear immediately on the public website.'}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div style={{ width: 280, padding: '24px 16px', borderLeft: '1px solid #E8E8E4', background: '#FAFAF8' }}>
                        {/* Main Image */}
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                            padding: 16, marginBottom: 16,
                        }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>
                                {locale === 'ar' ? 'الصورة الرئيسية' : 'Main Image'}
                            </h4>

                            {selected.image ? (
                                <div style={{ position: 'relative', marginBottom: 10 }}>
                                    <div style={{
                                        width: '100%', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', background: '#F0F0EC',
                                        border: '2px solid var(--gold)',
                                    }}>
                                        <img src={selected.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    </div>
                                    <span style={{
                                        position: 'absolute', bottom: 6, left: 6,
                                        padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                                        background: 'var(--gold)', color: '#fff',
                                    }}>{locale === 'ar' ? 'رئيسية' : 'MAIN'}</span>
                                    <button
                                        onClick={removeMainImage}
                                        style={{
                                            position: 'absolute', top: 4, right: 4,
                                            width: 22, height: 22, borderRadius: '50%',
                                            background: 'rgba(229,62,62,0.9)', color: '#fff',
                                            border: 'none', cursor: 'pointer', fontSize: 11,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                        title={locale === 'ar' ? 'حذف الصورة' : 'Remove'}
                                    >✕</button>
                                </div>
                            ) : (
                                <div style={{
                                    width: '100%', aspectRatio: '1.2', borderRadius: 10,
                                    border: '2px dashed #E8E8E4', background: '#FAFAF8',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 10, color: '#999',
                                }}>
                                    <span style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>🖼</span>
                                    <p style={{ fontSize: 13, fontWeight: 500 }}>{locale === 'ar' ? 'لا توجد صورة' : 'No image'}</p>
                                </div>
                            )}

                            <button
                                onClick={() => mainFileInputRef.current?.click()}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: 8,
                                    border: '1px dashed var(--gold)', background: '#FFFBF0',
                                    color: 'var(--gold)', fontSize: 13, fontWeight: 600,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}
                            >
                                📷 {locale === 'ar' ? (selected.image ? 'تغيير الصورة' : 'رفع صورة رئيسية') : (selected.image ? 'Change Image' : 'Upload Main Image')}
                            </button>
                        </div>

                        {/* Additional Images */}
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                            padding: 16, marginBottom: 16,
                        }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>
                                {locale === 'ar' ? 'صور إضافية' : 'Additional Images'}
                            </h4>

                            {(selected.images || []).length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                                    {(selected.images || []).map((img, i) => (
                                        <div key={i} style={{ position: 'relative', width: 'calc(50% - 4px)' }}>
                                            <div style={{
                                                width: '100%', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: '#F0F0EC',
                                                border: '1px solid #E8E8E4',
                                            }}>
                                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            </div>
                                            <button
                                                onClick={() => removeAdditionalImage(i)}
                                                style={{
                                                    position: 'absolute', top: 3, right: 3,
                                                    width: 20, height: 20, borderRadius: '50%',
                                                    background: 'rgba(229,62,62,0.9)', color: '#fff',
                                                    border: 'none', cursor: 'pointer', fontSize: 10,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                                title={locale === 'ar' ? 'حذف' : 'Remove'}
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginBottom: 10 }}>
                                    {locale === 'ar' ? 'لا توجد صور إضافية' : 'No additional images'}
                                </p>
                            )}

                            <button
                                onClick={() => additionalFileInputRef.current?.click()}
                                style={{
                                    width: '100%', padding: '8px', borderRadius: 8,
                                    border: '1px dashed #ccc', background: '#FAFAF8',
                                    color: '#888', fontSize: 12, fontWeight: 600,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}
                            >
                                + {locale === 'ar' ? 'إضافة صور أخرى' : 'Add More Images'}
                            </button>
                            <p style={{ fontSize: 10, color: '#bbb', textAlign: 'center', marginTop: 4 }}>
                                {locale === 'ar' ? 'يمكنك اختيار عدة صور' : 'Select multiple files'}
                            </p>
                        </div>

                        {/* Catalog Upload */}
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                            padding: 16, marginBottom: 16,
                        }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>
                                {locale === 'ar' ? 'الكتالوج (PDF)' : 'Product Catalog (PDF)'}
                            </h4>

                            {selected.catalog ? (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px', background: '#F0F9FF', border: '1px solid #BEE3F8',
                                    borderRadius: 8, marginBottom: 10
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                                        <span style={{ fontSize: 16 }}>📄</span>
                                        <span style={{ fontSize: 13, color: '#2B6CB0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {locale === 'ar' ? 'ملف الكتالوج' : 'Catalog File'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={removeCatalog}
                                        style={{
                                            width: 24, height: 24, borderRadius: '50%',
                                            background: '#FFF5F5', color: '#C53030', border: '1px solid #FED7D7',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 10
                                        }}
                                        title={locale === 'ar' ? 'حذف' : 'Remove'}
                                    >✕</button>
                                </div>
                            ) : (
                                <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginBottom: 10 }}>
                                    {locale === 'ar' ? 'لا يوجد كتالوج مرفوع' : 'No catalog uploaded'}
                                </p>
                            )}

                            <button
                                onClick={() => catalogFileInputRef.current?.click()}
                                style={{
                                    width: '100%', padding: '8px', borderRadius: 8,
                                    border: '1px dashed #4299E1', background: '#EBF8FF',
                                    color: '#4299E1', fontSize: 12, fontWeight: 600,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}
                            >
                                📄 {locale === 'ar' ? (selected.catalog ? 'تغيير الملف' : 'رفع كتالوج') : (selected.catalog ? 'Change File' : 'Upload Catalog')}
                            </button>
                        </div>

                        {/* Badges */}
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                            padding: 16,
                        }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>
                                {locale === 'ar' ? 'الشارات' : 'Badges'}
                            </h4>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {selected.badges.map((badge, i) => (
                                    <span key={i} style={{
                                        padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                                        background: 'var(--gold)', color: '#fff',
                                    }}>{badge}</span>
                                ))}
                                {selected.badges.length === 0 && (
                                    <span style={{ fontSize: 12, color: '#999' }}>{locale === 'ar' ? 'لا توجد شارات' : 'No badges'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexDirection: 'column', gap: 12 }}>
                    <span style={{ fontSize: 48, opacity: 0.3 }}>📦</span>
                    <p style={{ fontSize: 16 }}>{locale === 'ar' ? 'اختر منتجاً للتعديل أو أضف منتجاً جديداً' : 'Select a product or add a new one'}</p>
                </div>
            )}
        </div >
    );
}

// Force rebuild 2
