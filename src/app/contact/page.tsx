'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { products } from '@/data';
import ClientLayout from '@/components/ClientLayout';

export default function ContactPage() {
    const { t, locale } = useI18n();
    const [formData, setFormData] = useState({
        name: '', company: '', phone: '', email: '', details: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const selectedProduct = products[0] || { id: '', nameEn: 'General Inquiry', nameAr: 'استفسار عام', ref: 'N/A' };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone || !formData.details) {
            alert(locale === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill in required fields');
            return;
        }

        setStatus('loading');
        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    productId: selectedProduct.id,
                    productName: selectedProduct.nameEn
                }),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', company: '', phone: '', email: '', details: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <ClientLayout>
            <section className="section" style={{ background: 'var(--bg-light)', paddingTop: 40 }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48 }}>
                        {/* Left - Form */}
                        <div>
                            <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12, lineHeight: 1.1 }}>
                                {t('contact.title')}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36, maxWidth: 480 }}>
                                {t('contact.subtitle')}
                            </p>

                            <div style={{
                                background: '#fff', borderRadius: 16, padding: 32,
                                border: '1px solid var(--border-light)',
                            }}>
                                {/* Inquiry reference */}
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{
                                        display: 'block', fontSize: 12, fontWeight: 700,
                                        color: 'var(--gold)', letterSpacing: 1, marginBottom: 8,
                                    }}>
                                        {t('contact.inquiryRef')}
                                    </label>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '12px 16px', background: 'var(--bg-light)',
                                        borderRadius: 8, border: '1px solid var(--border-light)',
                                    }}>
                                        <span style={{ flex: 1, fontSize: 14, color: 'var(--text-muted)' }}>
                                            {selectedProduct.nameEn} (Ref: {selectedProduct.ref})
                                        </span>
                                        <span style={{ color: 'var(--gold)' }}>🔒</span>
                                    </div>
                                </div>

                                {/* Name & Company */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                    <div>
                                        <label className="form-label">{t('contact.fullName')}</label>
                                        <input
                                            className="form-input"
                                            placeholder={t('contact.fullNamePlaceholder')}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">{t('contact.companyName')}</label>
                                        <input
                                            className="form-input"
                                            placeholder={t('contact.companyPlaceholder')}
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Phone & Email */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                    <div>
                                        <label className="form-label">{t('contact.phone')}</label>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                padding: '0 12px', background: 'var(--bg-light)',
                                                border: '1px solid var(--border-light)', borderRadius: 8,
                                                fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                🇸🇦 +966
                                            </div>
                                            <input
                                                className="form-input"
                                                placeholder="5X XXX XXXX"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label">{t('contact.email')}</label>
                                        <input
                                            className="form-input"
                                            type="email"
                                            placeholder={t('contact.emailPlaceholder')}
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div style={{ marginBottom: 24 }}>
                                    <label className="form-label">{t('contact.projectDetails')}</label>
                                    <textarea
                                        className="form-input"
                                        rows={5}
                                        placeholder={t('contact.projectPlaceholder')}
                                        value={formData.details}
                                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                {status === 'success' && (
                                    <div style={{
                                        marginBottom: 16, padding: '12px', borderRadius: 8,
                                        background: '#F0FFF4', border: '1px solid #C6F6D5', color: '#2F855A',
                                        fontSize: 14, fontWeight: 600
                                    }}>
                                        {locale === 'ar' ? '✓ تم إرسال استفسارك بنجاح!' : '✓ Your inquiry has been sent successfully!'}
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div style={{
                                        marginBottom: 16, padding: '12px', borderRadius: 8,
                                        background: '#FFF5F5', border: '1px solid #FED7D7', color: '#C53030',
                                        fontSize: 14, fontWeight: 600
                                    }}>
                                        {locale === 'ar' ? '✗ حدث خطأ، يرجى المحاولة مرة أخرى.' : '✗ An error occurred, please try again.'}
                                    </div>
                                )}

                                <button
                                    className="btn btn-gold"
                                    style={{ padding: '14px 32px', fontSize: 15, opacity: status === 'loading' ? 0.7 : 1 }}
                                    onClick={handleSubmit}
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (
                                        <>
                                            {t('contact.submit')} →
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right - Info */}
                        <div>
                            {/* Currently viewing product */}
                            <div style={{
                                background: '#fff', borderRadius: 16, padding: 20,
                                border: '2px solid var(--gold)', marginBottom: 24,
                                display: 'flex', gap: 16, alignItems: 'center',
                            }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: 12,
                                    background: 'linear-gradient(135deg, #8B6914, #D4A017)',
                                    flexShrink: 0,
                                }} />
                                <div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1 }}>
                                        {t('contact.currentlyViewing')}
                                    </span>
                                    <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                                        {locale === 'ar' ? selectedProduct.nameAr : selectedProduct.nameEn}
                                    </h4>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Ref: {selectedProduct.ref}</p>
                                    <a href="/products" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                                        {t('contact.changeProduct')}
                                    </a>
                                </div>
                            </div>

                            {/* Need answer */}
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                                {t('contact.needAnswer')}
                            </h3>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                                <a
                                    href="https://wa.me/966112345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 8, padding: '14px 20px', borderRadius: 12,
                                        background: '#25D366', color: '#fff', fontWeight: 700,
                                        fontSize: 15, textDecoration: 'none', transition: 'all 0.2s',
                                    }}
                                >
                                    💬 {t('contact.whatsapp')}
                                </a>
                                <a
                                    href="mailto:info@saudiwood.com"
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 8, padding: '14px 20px', borderRadius: 12,
                                        background: '#fff', color: 'var(--text-primary)', fontWeight: 700,
                                        fontSize: 15, textDecoration: 'none', border: '1px solid var(--border-light)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    ✉ {t('contact.emailUs')}
                                </a>
                            </div>

                            {/* Map */}
                            <div style={{
                                borderRadius: 16, overflow: 'hidden', marginBottom: 24,
                                height: 260,
                            }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.674034498968!2d46.6840412!3d24.7135515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f028e5f3730e3%3A0x7e6e8cb4c0e4cd56!2sRiyadh!5e0!3m2!1sen!2ssa!4v1710000000000"
                                    width="100%" height="100%" style={{ border: 0 }}
                                    allowFullScreen loading="lazy"
                                />
                            </div>

                            {/* Location info */}
                            <div style={{
                                background: '#fff', borderRadius: 16, padding: 24,
                                border: '1px solid var(--border-light)',
                            }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                                    <span style={{ fontSize: 20 }}>🏢</span>
                                    <div>
                                        <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t('contact.showroomTitle')}</h4>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                            {t('contact.showroomAddress')}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                                    <span style={{ fontSize: 16 }}>🕐</span>
                                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t('contact.workHours')}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <span style={{ fontSize: 16 }}>📞</span>
                                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t('contact.phoneNumber')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ClientLayout>
    );
}
