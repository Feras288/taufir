'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import ClientLayout from '@/components/ClientLayout';

function AboutHero() {
    const { t } = useI18n();
    return (
        <section style={{
            position: 'relative',
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4A017\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
                <div style={{
                    display: 'inline-block', padding: '6px 16px',
                    background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)',
                    borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 2,
                    color: 'var(--gold)', marginBottom: 24,
                }}>
                    {t('about.badge')}
                </div>
                <h1 style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
                    {t('about.heroTitle1')}<br />
                    <span style={{ color: 'var(--gold)' }}>{t('about.heroTitle2')}</span><br />
                    {t('about.heroTitle3')}
                </h1>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
                    {t('about.heroSubtitle')}
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="#heritage" className="btn btn-gold" style={{ padding: '14px 32px' }}>
                        {t('about.heroCta1')}
                    </Link>
                    <button className="btn btn-outline-white" style={{ padding: '14px 32px' }}>
                        ▶ {t('about.heroCta2')}
                    </button>
                </div>
            </div>
        </section>
    );
}

function HeritageSection() {
    const { t } = useI18n();
    return (
        <section id="heritage" className="section" style={{ background: 'var(--bg-light)' }}>
            <div className="container">
                <span className="section-label">{t('about.heritageLabel')}</span>
                <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>{t('about.heritageTitle')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
                            {t('about.heritageDesc')}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                            {t('about.heritageDesc2')}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div style={{ padding: 20, background: '#fff', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                                <div style={{ fontSize: 20, marginBottom: 8 }}>🏛️</div>
                                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{t('about.saudiDesign')}</h4>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('about.saudiDesignDesc')}</p>
                            </div>
                            <div style={{ padding: 20, background: '#fff', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                                <div style={{ fontSize: 20, marginBottom: 8 }}>⚙️</div>
                                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{t('about.chineseEng')}</h4>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('about.chineseEngDesc')}</p>
                            </div>
                        </div>
                    </div>
                    {/* Map placeholder */}
                    <div style={{
                        borderRadius: 16, overflow: 'hidden', height: 400,
                        background: '#e5e3df', position: 'relative',
                    }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.674034498968!2d46.6840412!3d24.7135515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f028e5f3730e3%3A0x7e6e8cb4c0e4cd56!2sRiyadh!5e0!3m2!1sen!2ssa!4v1710000000000"
                            width="100%" height="100%" style={{ border: 0 }}
                            allowFullScreen loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function VisionMission() {
    const { t } = useI18n();
    return (
        <section className="section" style={{ background: 'var(--bg-white)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div style={{
                        padding: 40, background: 'var(--bg-light)', borderRadius: 16,
                        border: '1px solid var(--border-light)',
                    }}>
                        <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{t('about.visionTitle')}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8 }}>
                            {t('about.visionDesc')}
                        </p>
                    </div>
                    <div style={{
                        padding: 40, background: 'var(--bg-light)', borderRadius: 16,
                        border: '1px solid var(--border-light)',
                    }}>
                        <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{t('about.missionTitle')}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8 }}>
                            {t('about.missionDesc')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineSection() {
    const { t } = useI18n();
    const milestones = [
        { year: '1998', label: t('about.timeline1998') },
        { year: '', label: t('about.timelineExpansion') },
        { year: '2018', label: t('about.timeline2018') },
        { year: '', label: t('about.timelineFuture') },
    ];

    return (
        <section className="section" style={{ background: 'var(--bg-light)', textAlign: 'center' }}>
            <div className="container">
                <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{t('about.timelineTitle')}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 48 }}>
                    {t('about.timelineSubtitle')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
                    {milestones.map((m, i) => (
                        <React.Fragment key={i}>
                            <div style={{ textAlign: 'center', padding: '0 24px' }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    background: `linear-gradient(135deg, #8B6914, #D4A017)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 800, fontSize: 18, margin: '0 auto 12px',
                                }}>
                                    {m.year || '→'}
                                </div>
                                <p style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</p>
                            </div>
                            {i < milestones.length - 1 && (
                                <div style={{
                                    width: 80, height: 2,
                                    background: 'linear-gradient(to right, var(--gold), var(--border-light))',
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FacilitiesSection() {
    const { t } = useI18n();
    return (
        <section className="section" style={{ background: 'var(--bg-white)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                    <div>
                        <span className="section-label">{t('about.facilitiesLabel')}</span>
                        <h2 style={{ fontSize: 36, fontWeight: 800 }}>{t('about.facilitiesTitle')}</h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 300 }}>
                        {t('about.facilitiesDesc')}
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, gridTemplateRows: 'auto auto' }}>
                    <div style={{
                        gridRow: '1 / 3',
                        borderRadius: 16, overflow: 'hidden', position: 'relative',
                        minHeight: 360,
                        background: 'linear-gradient(135deg, #333 0%, #555 100%)',
                    }}>
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: 24, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            color: '#fff',
                        }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{t('about.automated')}</h3>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t('about.automatedDesc')}</p>
                        </div>
                    </div>
                    <div style={{
                        borderRadius: 16, overflow: 'hidden', position: 'relative',
                        minHeight: 165,
                        background: 'linear-gradient(135deg, #8B6914, #D4A017)',
                    }}>
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: 20, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                            color: '#fff',
                        }}>
                            <h4 style={{ fontSize: 16, fontWeight: 700 }}>{t('about.handFinishing')}</h4>
                        </div>
                    </div>
                    <div style={{
                        borderRadius: 16, overflow: 'hidden', position: 'relative',
                        minHeight: 165,
                        background: 'linear-gradient(135deg, #B8860B, #8B6914)',
                    }}>
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: 20, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                            color: '#fff',
                        }}>
                            <h4 style={{ fontSize: 16, fontWeight: 700 }}>{t('about.premiumBanding')}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CertificationsSection() {
    const { t } = useI18n();
    const certs = [
        { label: t('about.iso'), icon: '🏅' },
        { label: t('about.saso'), icon: '✓' },
        { label: t('about.en'), icon: '🔥' },
        { label: t('about.fsc'), icon: '🌿' },
    ];

    return (
        <section style={{ padding: '48px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
            <div className="container">
                <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 32 }}>
                    {t('about.certTitle')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
                    {certs.map((cert, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: 'var(--bg-light)', border: '2px solid var(--border-light)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, margin: '0 auto 10px',
                            }}>
                                {cert.icon}
                            </div>
                            <p style={{ fontWeight: 600, fontSize: 13 }}>{cert.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AboutCTA() {
    const { t } = useI18n();
    return (
        <section style={{
            background: 'var(--gold)',
            padding: '64px 0',
            textAlign: 'center',
        }}>
            <div className="container">
                <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
                    {t('about.ctaTitle')}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
                    {t('about.ctaSubtitle')}
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/contact" className="btn" style={{
                        background: 'var(--charcoal)', color: '#fff', padding: '14px 32px',
                    }}>
                        {t('about.ctaBtn1')}
                    </Link>
                    <button className="btn btn-outline-white" style={{ padding: '14px 32px' }}>
                        {t('about.ctaBtn2')}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default function AboutPage() {
    return (
        <ClientLayout>
            <AboutHero />
            <HeritageSection />
            <VisionMission />
            <TimelineSection />
            <FacilitiesSection />
            <CertificationsSection />
            <AboutCTA />
        </ClientLayout>
    );
}
