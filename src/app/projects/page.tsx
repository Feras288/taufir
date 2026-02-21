'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { type Project } from '@/data';
import ClientLayout from '@/components/ClientLayout';

export default function ProjectsPage() {
    const { t, locale } = useI18n();
    const [filter, setFilter] = useState('all');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects')
            .then(r => r.json())
            .then((data: Project[]) => { setProjects(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const categories = ['all', ...new Set(projects.map(p => p.category))];
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

    return (
        <ClientLayout>
            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
                padding: '80px 0 60px',
                textAlign: 'center',
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 44, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                        {t('projects.sectionTitle')}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
                        {t('projects.sectionSubtitle')}
                    </p>
                </div>
            </section>

            {/* Filter */}
            <section style={{ background: '#fff', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 72, zIndex: 100 }}>
                <div className="container" style={{ display: 'flex', gap: 8, padding: '16px 24px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: 24,
                                border: '1px solid',
                                borderColor: filter === cat ? 'var(--gold)' : 'var(--border-light)',
                                background: filter === cat ? 'var(--gold)' : '#fff',
                                color: filter === cat ? '#fff' : 'var(--text-primary)',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s',
                            }}
                        >
                            {cat === 'all' ? (locale === 'ar' ? 'الكل' : 'All') : cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid */}
            <section className="section" style={{ background: 'var(--bg-light)' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 28,
                    }}>
                        {filtered.map(project => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}>
                                    <div style={{
                                        height: 240,
                                        background: 'linear-gradient(135deg, #8B6914, #D4A017)',
                                        position: 'relative',
                                    }}>
                                        <div style={{
                                            position: 'absolute', top: 12, right: 12,
                                        }}>
                                            <span className={`badge ${project.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                                                {project.status === 'published' ? t('admin.published') : 'Draft'}
                                            </span>
                                        </div>
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            padding: '60px 24px 20px',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                            color: '#fff',
                                        }}>
                                            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                                                {locale === 'ar' ? project.titleAr : project.titleEn}
                                            </h3>
                                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                                                {project.category} • {project.subcategory}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px 24px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {project.tags.map(tag => (
                                            <span key={tag} style={{
                                                padding: '3px 10px', borderRadius: 4,
                                                background: 'rgba(212,160,23,0.1)', color: 'var(--gold)',
                                                fontSize: 12, fontWeight: 600,
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </ClientLayout>
    );
}
