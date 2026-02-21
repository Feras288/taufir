'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { collections, projects } from '@/data';
import ClientLayout from '@/components/ClientLayout';

function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[600px] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4A017\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
        }} />
      </div>

      <div className="container relative z-10 py-12 md:py-0">
        <div className="max-w-[700px]">
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'rgba(212,160,23,0.15)',
            border: '1px solid rgba(212,160,23,0.3)',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            color: 'var(--gold)',
            marginBottom: 24,
          }}>
            {t('hero.badge')}
          </div>
          <h1 className="text-4xl md:text-[56px] font-[900] text-white leading-[1.1] mb-5">
            {t('hero.title1')}<br />
            <span style={{ color: 'var(--gold)' }}>{t('hero.title2')}</span><br />
            {t('hero.title3')}
          </h1>
          <p className="text-lg text-[rgba(255,255,255,0.7)] leading-[1.7] mb-9 max-w-[550px]">
            {t('hero.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn-gold" style={{ padding: '14px 32px', fontSize: 15 }}>
              {t('hero.cta1')} →
            </Link>
            <button className="btn btn-outline-white" style={{ padding: '14px 32px', fontSize: 15 }}>
              ▶ {t('hero.cta2')}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative right image area */}
      <div className="hidden md:flex" style={{
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: '40%',
        background: 'linear-gradient(to left, rgba(212,160,23,0.1), transparent)',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 300, height: 400,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #8B6914 0%, #D4A017 50%, #B8860B 100%)',
          opacity: 0.3,
          transform: 'rotate(-5deg)',
        }} />
      </div>
    </section>
  );
}

function StandardsSection() {
  const { t } = useI18n();
  const items = [
    { icon: '🏛️', title: t('standards.saudi.title'), desc: t('standards.saudi.desc') },
    { icon: '🌍', title: t('standards.global.title'), desc: t('standards.global.desc') },
    { icon: '✓', title: t('standards.certified.title'), desc: t('standards.certified.desc') },
  ];

  return (
    <section className="section" style={{ background: 'var(--bg-white)', textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{t('standards.sectionTitle')}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 48 }}>
          {t('standards.sectionSubtitle')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              padding: 40,
              borderRadius: 16,
              background: '#fff',
              border: '1px solid var(--border-light)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(212,160,23,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 20px',
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionsSection() {
  const { t, locale } = useI18n();
  return (
    <section className="section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <span className="section-label">{t('collections.sectionLabel')}</span>
            <h2 style={{ fontSize: 36, fontWeight: 800 }}>{t('collections.sectionTitle')}</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-medium)',
              background: '#fff', cursor: 'pointer', fontSize: 16,
            }}>←</button>
            <button style={{
              width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-medium)',
              background: '#fff', cursor: 'pointer', fontSize: 16,
            }}>→</button>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/products?collection=${col.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ cursor: 'pointer' }}>
                <div style={{
                  height: 260,
                  background: `linear-gradient(135deg, #8B6914 0%, #D4A017 50%, #B8860B 100%)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '60px 20px 20px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: '#fff',
                  }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                      {locale === 'ar' ? col.nameAr : col.nameEn}
                    </h3>
                  </div>
                </div>
                <div style={{ padding: '14px 20px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    {locale === 'ar' ? col.descAr : col.descEn}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { t, locale } = useI18n();
  const publishedProjects = projects.filter(p => p.status === 'published');

  return (
    <section className="section" style={{ background: 'var(--bg-white)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <span className="section-label">{t('projects.sectionLabel')}</span>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{t('projects.sectionTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 500 }}>
              {t('projects.sectionSubtitle')}
            </p>
          </div>
          <Link href="/projects" style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            {t('projects.viewAll')} →
          </Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {publishedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}>
                <div style={{
                  height: 220,
                  background: 'linear-gradient(135deg, #8B6914 0%, #D4A017 50%, #B8860B 100%)',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '60px 24px 20px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    color: '#fff',
                  }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                      {locale === 'ar' ? project.titleAr : project.titleEn}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                      {project.category} • {project.subcategory}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const { t } = useI18n();
  const partners = ['CONSTRUCTION CO', 'URBAN DEV', 'BUILD SA', 'MEGA PRO'];

  return (
    <section style={{ padding: '40px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
      <div className="container">
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 24 }}>
          {t('partners.title')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          {partners.map((partner, i) => (
            <div key={i} style={{
              fontSize: 18, fontWeight: 800, color: 'var(--text-muted)',
              letterSpacing: 1, opacity: 0.5,
            }}>
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { t } = useI18n();
  return (
    <section style={{
      background: 'var(--gold)',
      padding: '64px 0',
      textAlign: 'center',
    }}>
      <div className="container">
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
          {t('cta.title')}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          {t('cta.subtitle')}
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn" style={{
            background: 'var(--charcoal)', color: '#fff',
            padding: '14px 32px', fontSize: 15,
          }}>
            {t('cta.btn1')} →
          </Link>
          <Link href="/contact" className="btn btn-outline-white" style={{ padding: '14px 32px', fontSize: 15 }}>
            {t('cta.btn2')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <ClientLayout>
      <HeroSection />
      <StandardsSection />
      <CollectionsSection />
      <ProjectsSection />
      <PartnersSection />
      <CTASection />
    </ClientLayout>
  );
}
