'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
    const { t } = useI18n();

    return (
        <footer style={{ background: 'var(--charcoal)', color: '#fff', paddingTop: 60 }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 40,
                    paddingBottom: 40,
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 32, height: 32, background: 'var(--gold)', borderRadius: 6,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 16, fontWeight: 800, color: 'white'
                            }}>S</div>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>Saudi Wood Factory</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>
                            {t('footer.desc')}
                        </p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                            {['facebook', 'instagram', 'linkedin'].map(social => (
                                <a
                                    key={social}
                                    href="#"
                                    style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                                >
                                    {social[0].toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#fff' }}>
                            {t('footer.quickLinks')}
                        </h4>
                        {[
                            { href: '/', label: t('nav.home') },
                            { href: '/about', label: t('nav.about') },
                            { href: '/products', label: t('nav.products') },
                            { href: '/projects', label: t('nav.projects') },
                            { href: '/contact', label: t('nav.contact') },
                        ].map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    display: 'block',
                                    color: 'rgba(255,255,255,0.6)',
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    padding: '6px 0',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Locations */}
                    <div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#fff' }}>
                            {t('footer.locations')}
                        </h4>
                        <div style={{ marginBottom: 16 }}>
                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t('footer.riyadhHQ')}</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {t('footer.riyadhAddress')}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t('footer.mfgFacility')}</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {t('footer.mfgAddress')}
                            </p>
                        </div>
                    </div>

                    {/* Certifications */}
                    <div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#fff' }}>
                            {t('footer.certifications')}
                        </h4>
                        {['ISO 9001', 'SASO Approved', 'EN Standard', 'FSC Certified'].map(cert => (
                            <div
                                key={cert}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '6px 0',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: 14,
                                }}
                            >
                                <span style={{ color: 'var(--gold)' }}>✓</span>
                                {cert}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    padding: '20px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 16,
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                        {t('footer.copyright')}
                    </p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>
                            {t('footer.privacy')}
                        </a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>
                            {t('footer.terms')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
