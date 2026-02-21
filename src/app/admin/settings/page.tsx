'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
    const { locale } = useI18n();
    const [companyNameEn, setCompanyNameEn] = useState('Saudi Wood Factory');
    const [companyNameAr, setCompanyNameAr] = useState('مصنع الخشب السعودي');
    const [email, setEmail] = useState('info@saudiwood.com');
    const [phone, setPhone] = useState('+966 11 234 5678');
    const [whatsapp, setWhatsapp] = useState('+966 55 123 4567');
    const [address, setAddress] = useState('2nd Industrial City, Riyadh 14334, Saudi Arabia');
    const [defaultLang, setDefaultLang] = useState('en');
    const [enableNotifications, setEnableNotifications] = useState(true);
    const [autoReply, setAutoReply] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: 8,
        border: '1px solid #E8E8E4', fontSize: 14, outline: 'none',
        fontFamily: 'inherit',
    };

    const labelStyle = {
        fontSize: 12, fontWeight: 600 as const, color: '#888',
        display: 'block' as const, marginBottom: 6, textTransform: 'uppercase' as const,
    };

    return (
        <div style={{ padding: 24, maxWidth: 800 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                        {locale === 'ar' ? 'الإعدادات' : 'Settings'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#888' }}>System › Settings</p>
                </div>
                <button onClick={handleSave} style={{
                    padding: '10px 24px', borderRadius: 8, border: 'none',
                    background: saved ? '#38A169' : '#1A1A1A', color: '#fff',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                }}>{saved ? '✓ Saved!' : '💾 Save Settings'}</button>
            </div>

            {/* Company Info */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    🏭 Company Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={labelStyle}>Company Name (EN)</label>
                        <input value={companyNameEn} onChange={e => setCompanyNameEn(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>اسم الشركة (AR)</label>
                        <input value={companyNameAr} onChange={e => setCompanyNameAr(e.target.value)} dir="rtl" style={{ ...inputStyle, textAlign: 'right' }} />
                    </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Address</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Phone</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>WhatsApp</label>
                        <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={inputStyle} />
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⚙️ Preferences
                </h3>
                <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Default Language</label>
                    <select value={defaultLang} onChange={e => setDefaultLang(e.target.value)} style={{ ...inputStyle, maxWidth: 200, background: '#fff' }}>
                        <option value="en">English</option>
                        <option value="ar">العربية (Arabic)</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #F0F0EC' }}>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Email Notifications</p>
                        <p style={{ fontSize: 12, color: '#999' }}>Receive alerts for new inquiries and orders</p>
                    </div>
                    <button onClick={() => setEnableNotifications(!enableNotifications)} style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: enableNotifications ? 'var(--gold)' : '#DDD', position: 'relative', transition: 'all 0.2s',
                    }}>
                        <span style={{
                            position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
                            background: '#fff', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            left: enableNotifications ? 23 : 3,
                        }} />
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #F0F0EC' }}>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Auto-Reply to Inquiries</p>
                        <p style={{ fontSize: 12, color: '#999' }}>Send automated acknowledgement email to new inquiries</p>
                    </div>
                    <button onClick={() => setAutoReply(!autoReply)} style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: autoReply ? '#38A169' : '#DDD', position: 'relative', transition: 'all 0.2s',
                    }}>
                        <span style={{
                            position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
                            background: '#fff', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            left: autoReply ? 23 : 3,
                        }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
