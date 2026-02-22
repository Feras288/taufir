'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function AdminLoginPage() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin');
            } else {
                setStatus('error');
                setErrorMessage(locale === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage(locale === 'ar' ? 'حدث خطأ في النظام' : 'System error occurred');
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#F5F5F0', padding: 24, direction: locale === 'ar' ? 'rtl' : 'ltr'
        }}>
            <div style={{
                width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20,
                padding: '48px 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                border: '1px solid #E8E8E4'
            }}>
                {/* Logo Area */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 56, height: 56, background: 'var(--gold)', borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 auto 16px'
                    }}>S</div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
                        {locale === 'ar' ? 'لوحة التحكم للمصنع' : 'Factory Admin Dashboard'}
                    </h1>
                    <p style={{ fontSize: 14, color: '#888' }}>
                        {locale === 'ar' ? 'سجل دخولك للمتابعة' : 'Sign in to continue member access'}
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{
                            display: 'block', fontSize: 13, fontWeight: 700,
                            color: '#1A1A1A', marginBottom: 8, letterSpacing: 0.5
                        }}>
                            {locale === 'ar' ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="admin@taufir.com"
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: 12,
                                border: '1px solid #E8E8E4', outline: 'none', background: '#F9F9F7',
                                fontSize: 14, transition: 'all 0.2s'
                            }}
                            value={credentials.email}
                            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <label style={{
                            display: 'block', fontSize: 13, fontWeight: 700,
                            color: '#1A1A1A', marginBottom: 8, letterSpacing: 0.5
                        }}>
                            {locale === 'ar' ? 'كلمة المرور' : 'PASSWORD'}
                        </label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%', padding: '14px 16px', borderRadius: 12,
                                border: '1px solid #E8E8E4', outline: 'none', background: '#F9F9F7',
                                fontSize: 14, transition: 'all 0.2s'
                            }}
                            value={credentials.password}
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>

                    {status === 'error' && (
                        <div style={{
                            marginBottom: 24, padding: '12px 16px', borderRadius: 10,
                            background: '#FFF5F5', border: '1px solid #FED7D7',
                            color: '#C53030', fontSize: 13, fontWeight: 600, textAlign: 'center'
                        }}>
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        style={{
                            width: '100%', padding: '16px', borderRadius: 12,
                            background: 'var(--gold)', color: '#fff', border: 'none',
                            fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s', opacity: status === 'loading' ? 0.7 : 1,
                            boxShadow: '0 10px 20px rgba(212,160,23,0.15)'
                        }}
                    >
                        {status === 'loading' ? (locale === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In Now')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <a href="/" style={{ fontSize: 13, color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
                        ← {locale === 'ar' ? 'العودة للموقع' : 'Back to Website'}
                    </a>
                </div>
            </div>
        </div>
    );
}
