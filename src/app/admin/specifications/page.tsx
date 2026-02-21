'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface Spec {
    id: string;
    key?: string;
    nameEn: string;
    nameAr: string;
    type: 'text' | 'dropdown' | 'number';
    unit: string;
    options: string[];
    required: boolean;
}

const initialSpecs: Spec[] = [];

export default function SpecificationsPage() {
    const { locale } = useI18n();
    const [specs, setSpecs] = useState<Spec[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch initial data
    React.useEffect(() => {
        fetch('/api/specifications')
            .then(res => res.json())
            .then(data => {
                setSpecs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching specs:', err);
                setLoading(false);
            });
    }, []);

    const toggleRequired = (id: string) => {
        setSpecs(prev => prev.map(s => s.id === id ? { ...s, required: !s.required } : s));
    };

    const addSpec = () => {
        const newSpec: Spec = {
            id: String(Date.now()), nameEn: '', nameAr: '', type: 'text', unit: '', options: [], required: false,
        };
        setSpecs(prev => [...prev, newSpec]);
    };

    const removeSpec = (id: string) => {
        setSpecs(prev => prev.filter(s => s.id !== id));
    };

    const updateSpec = (id: string, field: string, value: any) => {
        setSpecs(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/specifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(specs),
            });
            if (res.ok) {
                alert(locale === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
            } else {
                alert('Error saving data');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving data');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                        {locale === 'ar' ? 'المواصفات' : 'Specifications'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#888' }}>Inventory › Specifications</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleSave} disabled={isSaving} style={{
                        padding: '10px 20px', borderRadius: 8, border: 'none',
                        background: '#D4A017', color: '#fff', fontSize: 13, fontWeight: 700, cursor: isSaving ? 'wait' : 'pointer',
                    }}>
                        {isSaving ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                    </button>
                    <button onClick={addSpec} style={{
                        padding: '10px 20px', borderRadius: 8, border: 'none',
                        background: '#1A1A1A', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}>
                        {locale === 'ar' ? '+ إضافة خاصية' : '+ Add Specification'}
                    </button>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 120px 80px 80px 60px',
                    padding: '12px 20px', borderBottom: '1px solid #E8E8E4',
                    fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                    <span>Name (EN)</span>
                    <span>Name (AR)</span>
                    <span>Type</span>
                    <span>Unit</span>
                    <span>Required</span>
                    <span></span>
                </div>
                {specs.map(spec => (
                    <div key={spec.id} style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr 120px 80px 80px 60px',
                        padding: '12px 20px', borderBottom: '1px solid #F0F0EC', alignItems: 'center',
                    }}>
                        <input value={spec.nameEn} onChange={e => updateSpec(spec.id, 'nameEn', e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E8E8E4', fontSize: 13, outline: 'none' }} />
                        <input value={spec.nameAr} onChange={e => updateSpec(spec.id, 'nameAr', e.target.value)} dir="rtl"
                            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E8E8E4', fontSize: 13, outline: 'none', textAlign: 'right' }} />
                        <select value={spec.type} onChange={e => updateSpec(spec.id, 'type', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E8E8E4', fontSize: 12, background: '#fff' }}>
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="dropdown">Dropdown</option>
                        </select>
                        <input value={spec.unit} onChange={e => updateSpec(spec.id, 'unit', e.target.value)}
                            placeholder="—"
                            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E8E8E4', fontSize: 12, outline: 'none', width: '100%' }} />
                        <button onClick={() => toggleRequired(spec.id)} style={{
                            width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', margin: '0 auto',
                            background: spec.required ? 'var(--gold)' : '#F0F0EC', color: spec.required ? '#fff' : '#ccc',
                            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{spec.required ? '✓' : '—'}</button>
                        <button onClick={() => removeSpec(spec.id)} style={{
                            background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#ccc', margin: '0 auto',
                        }}>🗑</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
