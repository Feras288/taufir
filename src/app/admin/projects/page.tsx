'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Project } from '@/data/index';

const categoryList = ['Hospitality', 'Residential', 'Commercial', 'Cultural', 'Government'];

export default function ProjectsPage() {
    const { locale } = useI18n();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedId, setSelectedId] = useState('');
    const [activeTab, setActiveTab] = useState('Content');
    const [newTag, setNewTag] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Load from API
    useEffect(() => {
        fetch('/api/projects')
            .then(r => r.json())
            .then((data: Project[]) => {
                setProjects(data);
                if (data.length > 0) setSelectedId(data[0].id);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const selected = projects.find(p => p.id === selectedId);

    const updateProjectLocal = (field: string, value: any) => {
        setProjects(prev => prev.map(p => p.id === selectedId ? { ...p, [field]: value } : p));
    };

    const removeTag = (tag: string) => {
        if (!selected) return;
        updateProjectLocal('tags', selected.tags.filter(t => t !== tag));
    };

    const addTag = () => {
        if (!selected || !newTag.trim()) return;
        if (!selected.tags.includes(newTag.trim())) {
            updateProjectLocal('tags', [...selected.tags, newTag.trim()]);
        }
        setNewTag('');
    };

    const addNewProject = async () => {
        const newProject: Project = {
            id: `project-${Date.now()}`,
            titleEn: '',
            titleAr: '',
            descEn: '',
            descAr: '',
            category: 'Residential',
            subcategory: '',
            tags: [],
            status: 'draft',
            images: [],
            featuredImage: '',
            lastEdited: 'Just now',
        };
        try {
            const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProject) });
            if (res.ok) {
                const saved = await res.json();
                setProjects(prev => [saved, ...prev]);
                setSelectedId(saved.id);
            }
        } catch {
            setProjects(prev => [newProject, ...prev]);
            setSelectedId(newProject.id);
        }
    };

    const deleteProject = async (id: string) => {
        const confirmed = window.confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Delete this project?');
        if (!confirmed) return;
        try { await fetch(`/api/projects?id=${id}`, { method: 'DELETE' }); } catch { }
        setProjects(prev => {
            const updated = prev.filter(p => p.id !== id);
            if (selectedId === id && updated.length > 0) setSelectedId(updated[0].id);
            else if (updated.length === 0) setSelectedId('');
            return updated;
        });
    };

    const handleSave = async () => {
        if (!selected) return;
        try {
            const res = await fetch('/api/projects', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected),
            });
            if (res.ok) {
                setSaveMessage(locale === 'ar' ? '✓ تم الحفظ! التغييرات ستظهر في الموقع' : '✓ Saved! Changes will appear on the site');
            } else {
                setSaveMessage(locale === 'ar' ? '✗ خطأ' : '✗ Error');
            }
        } catch {
            setSaveMessage(locale === 'ar' ? '✗ خطأ' : '✗ Error');
        }
        setTimeout(() => setSaveMessage(''), 3000);
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
            {/* Left Panel - Project List */}
            <div style={{
                width: 380, borderRight: '1px solid #E8E8E4', background: '#fff',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
                <div style={{ padding: '20px 16px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>
                            {locale === 'ar' ? 'المشاريع' : 'Projects'}
                        </h2>
                        <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{projects.length} {locale === 'ar' ? 'مشروع' : 'items'}</span>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: 'auto', padding: '0 8px 8px' }}>
                    {projects.map(p => (
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
                                width: 64, height: 64, borderRadius: 8, flexShrink: 0,
                                background: 'linear-gradient(135deg, #8B6914, #D4A017)',
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {locale === 'ar' ? (p.titleAr || 'مشروع جديد') : (p.titleEn || 'New Project')}
                                    </p>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, flexShrink: 0,
                                        background: p.status === 'published' ? '#38A169' : '#E6A817', color: '#fff',
                                    }}>{p.status === 'published' ? (locale === 'ar' ? 'منشور' : 'PUBLISHED') : (locale === 'ar' ? 'مسودة' : 'DRAFT')}</span>
                                </div>
                                <p style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{p.category} • {p.subcategory}</p>
                                <p style={{ fontSize: 11, color: '#bbb' }}>{locale === 'ar' ? 'آخر تعديل' : 'Last edited'}: {p.lastEdited}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={addNewProject} style={{
                    margin: '8px 16px 16px', padding: '14px',
                    border: 'none', borderRadius: 10,
                    background: '#1A1A1A', cursor: 'pointer',
                    fontSize: 14, fontWeight: 700, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                    + {locale === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}
                </button>
            </div>

            {/* Right Panel - Edit Project */}
            {selected ? (
                <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                        <div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                                {locale === 'ar' ? 'تعديل المشروع' : 'Edit Project'}
                            </h2>
                            <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
                                {['Content', 'SEO & Metadata', 'Settings'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                        padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                                        border: '1px solid', cursor: 'pointer',
                                        background: activeTab === tab ? '#1A1A1A' : '#fff',
                                        color: activeTab === tab ? '#fff' : '#555',
                                        borderColor: activeTab === tab ? '#1A1A1A' : '#E8E8E4',
                                    }}>{tab}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => deleteProject(selected.id)} style={{
                                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                border: '1px solid #E53E3E', background: '#fff', cursor: 'pointer', color: '#E53E3E',
                            }}>🗑 {locale === 'ar' ? 'حذف' : 'Delete'}</button>
                            <button onClick={handleSave} style={{
                                padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                                border: 'none',
                                background: saveMessage?.includes('✓') ? '#38A169' : saveMessage?.includes('✗') ? '#E53E3E' : 'var(--gold)',
                                color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6, minWidth: 180, justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}>{saveMessage || (locale === 'ar' ? '💾 حفظ التغييرات' : '💾 Save Changes')}</button>
                        </div>
                    </div>

                    {/* Content Tab */}
                    {activeTab === 'Content' && (
                        <div style={{ maxWidth: 800 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Project Title (EN)</label>
                                    <input value={selected.titleEn} onChange={e => updateProjectLocal('titleEn', e.target.value)}
                                        placeholder="Enter project title..."
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textAlign: 'right' }}>عنوان المشروع (AR)</label>
                                    <input value={selected.titleAr} onChange={e => updateProjectLocal('titleAr', e.target.value)} dir="rtl"
                                        placeholder="أدخل عنوان المشروع..."
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none', textAlign: 'right' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Category</label>
                                    <select value={selected.category} onChange={e => updateProjectLocal('category', e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, background: '#fff' }}>
                                        {categoryList.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Subcategory</label>
                                    <input value={selected.subcategory} onChange={e => updateProjectLocal('subcategory', e.target.value)}
                                        placeholder="e.g. Interior Doors & Paneling"
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Tags</label>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                                    {selected.tags.map(tag => (
                                        <span key={tag} style={{
                                            padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                                            background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', gap: 4,
                                        }}>
                                            {tag}
                                            <button onClick={() => removeTag(tag)} style={{
                                                background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, padding: 0, marginLeft: 2, lineHeight: 1,
                                            }}>×</button>
                                        </span>
                                    ))}
                                    {selected.tags.length === 0 && <span style={{ fontSize: 12, color: '#999' }}>{locale === 'ar' ? 'لا توجد تاقات' : 'No tags'}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()}
                                        placeholder={locale === 'ar' ? 'أضف تاق...' : 'Add tag...'}
                                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E8E8E4', fontSize: 12, outline: 'none', width: 150 }} />
                                    <button onClick={addTag} style={{
                                        padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                                        border: 'none', background: '#1A1A1A', color: '#fff', cursor: 'pointer',
                                    }}>{locale === 'ar' ? 'إضافة' : 'Add'}</button>
                                </div>
                            </div>

                            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{locale === 'ar' ? 'الحالة' : 'Status'}:</label>
                                <button
                                    onClick={() => updateProjectLocal('status', selected.status === 'published' ? 'draft' : 'published')}
                                    style={{
                                        padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                                        background: selected.status === 'published' ? '#38A169' : '#E6A817', color: '#fff',
                                    }}
                                >{selected.status === 'published' ? (locale === 'ar' ? 'منشور ✓' : 'Published ✓') : (locale === 'ar' ? 'مسودة' : 'Draft')}</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Description (EN)</label>
                                    <textarea value={selected.descEn} onChange={e => updateProjectLocal('descEn', e.target.value)} rows={6}
                                        placeholder="Enter project description..."
                                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textAlign: 'right' }}>الوصف (AR)</label>
                                    <textarea value={selected.descAr} onChange={e => updateProjectLocal('descAr', e.target.value)} rows={6} dir="rtl"
                                        placeholder="أدخل وصف المشروع..."
                                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7, textAlign: 'right' }} />
                                </div>
                            </div>

                            {/* Save reminder */}
                            <div style={{
                                marginTop: 20, padding: '12px 16px', borderRadius: 8,
                                background: '#FFF9E6', border: '1px solid rgba(212,160,23,0.2)',
                                fontSize: 13, color: '#8B6914', display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                                💡 {locale === 'ar'
                                    ? 'اضغط "حفظ التغييرات" لتحديث الموقع. التعديلات ستظهر فوراً على الموقع العام.'
                                    : 'Click "Save Changes" to update the site. Changes will appear immediately on the public website.'}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexDirection: 'column', gap: 12 }}>
                    <span style={{ fontSize: 48, opacity: 0.3 }}>📁</span>
                    <p style={{ fontSize: 16 }}>{locale === 'ar' ? 'اختر مشروعاً للتعديل' : 'Select a project to edit'}</p>
                </div>
            )}
        </div>
    );
}
