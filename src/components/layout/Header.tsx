'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const { t, locale, setLocale } = useI18n();
    const { toggleCart, cartCount } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: t('nav.home') },
        { href: '/store', label: locale === 'ar' ? 'المتجر' : 'Store' },
        { href: '/products', label: t('nav.products') },
        { href: '/projects', label: t('nav.projects') },
        { href: '/contact', label: t('nav.contact') },
    ];

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: scrolled ? 'rgba(26,26,26,0.97)' : 'rgba(26,26,26,0.85)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                    <div style={{
                        width: 36, height: 36, background: 'var(--gold)', borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 800, color: 'white'
                    }}>
                        S
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                            Saudi Wood Factory
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                color: 'rgba(255,255,255,0.8)',
                                textDecoration: 'none',
                                fontSize: 14,
                                fontWeight: 500,
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Cart Button */}
                    <button
                        onClick={toggleCart}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: 20,
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        🛒
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                background: 'var(--gold)',
                                color: '#fff',
                                fontSize: 10,
                                fontWeight: 700,
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Language toggle */}
                    <button
                        onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 6,
                            padding: '6px 14px',
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {locale === 'en' ? 'العربية' : 'EN'}
                    </button>

                    {/* CTA */}
                    <Link
                        href="/contact"
                        className="btn btn-gold desktop-nav"
                        style={{ padding: '8px 20px', fontSize: 13 }}
                    >
                        {t('nav.getQuote')}
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: 24,
                            cursor: 'pointer',
                        }}
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    background: 'var(--charcoal)',
                    padding: '20px 24px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'block',
                                color: 'rgba(255,255,255,0.8)',
                                textDecoration: 'none',
                                padding: '12px 0',
                                fontSize: 16,
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="btn btn-gold"
                        onClick={() => setMobileOpen(false)}
                        style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                    >
                        {t('nav.getQuote')}
                    </Link>
                </div>
            )}

            <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
        </header>
    );
}
