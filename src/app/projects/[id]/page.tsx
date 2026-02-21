'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { projects } from '@/data';
import ClientLayout from '@/components/ClientLayout';
import { useParams } from 'next/navigation';

export default function ProjectDetailPage() {
    const { t, locale } = useI18n();
    const params = useParams();
    const project = projects.find(p => p.id === params.id);

    if (!project) {
        return (
            <ClientLayout>
                <div className="container section" style={{ textAlign: 'center' }}>
                    <h1>Project not found</h1>
                    <Link href="/projects" className="btn btn-gold" style={{ marginTop: 20 }}>
                        ← {t('nav.projects')}
                    </Link>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout>
            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
                padding: '80px 0 60px',
            }}>
                <div className="container">
                    <div style={{ marginBottom: 24, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{t('nav.home')}</Link>
                        {' / '}
                        <Link href="/projects" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{t('nav.projects')}</Link>
                        {' / '}
                        <span style={{ color: '#fff' }}>{locale === 'ar' ? project.titleAr : project.titleEn}</span>
                    </div>
                    <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                        {locale === 'ar' ? project.titleAr : project.titleEn}
                    </h1>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className={`badge ${project.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                            {project.status}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                            {project.category} • {project.subcategory}
                        </span>
                    </div>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--bg-light)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
                        {/* Main content */}
                        <div>
                            {/* Gallery */}
                            <div style={{
                                borderRadius: 16, overflow: 'hidden', marginBottom: 32,
                                background: 'linear-gradient(135deg, #8B6914, #D4A017)',
                                height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 64 }}>🏗️</div>
                            </div>

                            {/* Description */}
                            <div style={{
                                background: '#fff', borderRadius: 16, padding: 32,
                                border: '1px solid var(--border-light)',
                            }}>
                                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
                                    {locale === 'ar' ? 'عن المشروع' : 'About the Project'}
                                </h2>
                                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                                    {locale === 'ar' ? project.descAr : project.descEn}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div style={{
                                background: '#fff', borderRadius: 16, padding: 24,
                                border: '1px solid var(--border-light)', marginBottom: 24,
                            }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                                    {locale === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
                                </h3>
                                {[
                                    { label: locale === 'ar' ? 'الفئة' : 'Category', value: project.category },
                                    { label: locale === 'ar' ? 'النوع' : 'Type', value: project.subcategory },
                                    { label: locale === 'ar' ? 'الحالة' : 'Status', value: project.status },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        padding: '10px 0', borderBottom: '1px solid var(--border-light)',
                                    }}>
                                        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{item.label}</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>{item.value}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: 16 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                                        {locale === 'ar' ? 'العلامات' : 'Tags'}
                                    </p>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {project.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/contact?project=${project.id}`}
                                className="btn btn-gold"
                                style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }}
                            >
                                {t('nav.getQuote')} →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </ClientLayout>
    );
}
