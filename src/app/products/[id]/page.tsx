'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { type Product } from '@/data';
import ClientLayout from '@/components/ClientLayout';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
    const { t, locale } = useI18n();
    const { addToCart } = useCart();
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedFinish, setSelectedFinish] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [openSection, setOpenSection] = useState('specs');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products', { cache: 'no-store' })
            .then(r => r.json())
            .then((data: Product[]) => {
                setAllProducts(data);
                const found = data.find(p => p.id === params.id);
                setProduct(found || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <ClientLayout>
                <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: 16, color: '#999' }}>{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </ClientLayout>
        );
    }

    if (!product) {
        return (
            <ClientLayout>
                <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: 28, marginBottom: 16 }}>Product not found</h1>
                    <Link href="/products" className="btn btn-gold">← {t('nav.products')}</Link>
                </div>
            </ClientLayout>
        );
    }

    const similarProducts = allProducts.filter(p => p.id !== product.id).slice(0, 3);
    const categoryLabel = product.category === 'interior' ? (locale === 'ar' ? 'أبواب داخلية' : 'Interior Doors')
        : product.category === 'exterior' ? (locale === 'ar' ? 'أبواب خارجية' : 'Exterior Doors')
            : product.category === 'fire-rated' ? (locale === 'ar' ? 'أبواب مقاومة للحريق' : 'Fire Rated')
                : (locale === 'ar' ? 'مخصص' : 'Custom');

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
    };

    return (
        <ClientLayout>
            <div style={{ background: '#FAFAF8', minHeight: '80vh' }}>
                {/* Breadcrumb */}
                <div className="container" style={{ paddingTop: 24, paddingBottom: 8 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('nav.home')}</Link>
                        <span>›</span>
                        <Link href="/products" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>{categoryLabel}</Link>
                        <span>›</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                            {locale === 'ar' ? product.nameAr : product.nameEn}
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container py-8 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

                        {/* LEFT - Image Gallery */}
                        {(() => {
                            const allImages = [product.image, ...(product.images || [])].filter(Boolean);
                            const currentImage = allImages[selectedImageIndex] || allImages[0] || '';
                            return (
                                <div>
                                    {/* Main Image */}
                                    <div
                                        className="h-[320px] md:h-[480px] w-full relative mb-4"
                                        style={{
                                            borderRadius: 16, overflow: 'hidden',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: currentImage
                                                ? '#F0F0EC'
                                                : 'linear-gradient(135deg, #8B6914 0%, #C8944A 40%, #D4A017 100%)',
                                        }}>
                                        {currentImage ? (
                                            <img
                                                src={currentImage}
                                                alt={locale === 'ar' ? product.nameAr : product.nameEn}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 120 }}>🚪</div>
                                        )}
                                        <button style={{
                                            position: 'absolute', bottom: 16, right: 16,
                                            width: 40, height: 40, borderRadius: 10,
                                            background: 'rgba(255,255,255,0.9)', border: 'none',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}>🔍</button>
                                    </div>

                                    {/* Thumbnails - only show if there are 2+ images */}
                                    {allImages.length > 1 && (
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            {allImages.map((img, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setSelectedImageIndex(i)}
                                                    style={{
                                                        width: 72, height: 72, borderRadius: 10, overflow: 'hidden',
                                                        border: selectedImageIndex === i ? '2px solid var(--charcoal)' : '2px solid var(--border-light)',
                                                        cursor: 'pointer', transition: 'all 0.2s',
                                                        opacity: selectedImageIndex === i ? 1 : 0.6,
                                                    }}
                                                >
                                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* RIGHT - Product Details */}
                        <div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                {product.badges.map((badge, i) => (
                                    <span key={i} style={{
                                        padding: '5px 14px', borderRadius: 4, fontSize: 11,
                                        fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                                        background: i === 0 ? 'var(--gold)' : 'var(--bg-light)',
                                        color: i === 0 ? '#fff' : 'var(--text-primary)',
                                        border: i === 0 ? 'none' : '1px solid var(--border-light)',
                                    }}>
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, lineHeight: 1.2, color: 'var(--charcoal)' }}>
                                {locale === 'ar' ? product.nameAr : product.nameEn}
                            </h1>

                            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 480 }}>
                                {locale === 'ar' ? product.descAr : product.descEn}
                            </p>

                            {/* Price */}
                            <div style={{ marginBottom: 24 }}>
                                {(() => {
                                    let currentPrice = product.price || 0;
                                    let isDiscounted = false;

                                    if (product.priceTiers) {
                                        const tier = product.priceTiers
                                            .sort((a, b) => b.min - a.min)
                                            .find(t => quantity >= t.min);
                                        if (tier) {
                                            currentPrice = tier.price;
                                            isDiscounted = tier.price < (product.price || 0);
                                        }
                                    }

                                    return (
                                        <div>
                                            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 4 }}>
                                                {isDiscounted && (
                                                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: 18, marginRight: 8 }}>
                                                        {product.price?.toLocaleString()}
                                                    </span>
                                                )}
                                                <span>{currentPrice.toLocaleString()} <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-secondary)' }}>{locale === 'ar' ? 'ر.س' : 'SAR'}</span></span>
                                            </p>

                                            {/* Quantity Discount Table */}
                                            {product.priceTiers && (
                                                <div style={{ marginTop: 12, fontSize: 13, background: '#f9f9f9', padding: '10px', borderRadius: 6, width: 'fit-content' }}>
                                                    <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>
                                                        {locale === 'ar' ? 'خصومات الكميات' : 'Volume Discounts'}
                                                    </p>
                                                    <table style={{ width: '100%', minWidth: 200, borderCollapse: 'collapse' }}>
                                                        <tbody>
                                                            {product.priceTiers.sort((a, b) => a.min - b.min).map((tier, i) => (
                                                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                                                    <td style={{ padding: '4px 8px 4px 0', color: '#555' }}>
                                                                        {tier.min}+ {locale === 'ar' ? 'قطعة' : 'pcs'}
                                                                    </td>
                                                                    <td style={{ padding: '4px 0 4px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--charcoal)' }}>
                                                                        {tier.price.toLocaleString()} {locale === 'ar' ? 'ر.س' : 'SAR'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Select Finish */}
                            <div style={{ marginBottom: 28 }}>
                                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--charcoal)' }}>
                                    {locale === 'ar' ? 'اختر التشطيب' : 'Select Finish'}
                                </p>
                                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                                    {product.finishes.map((finish, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSelectedFinish(i);
                                                if (finish.imageIndex !== undefined && finish.imageIndex >= 0) {
                                                    setSelectedImageIndex(finish.imageIndex);
                                                }
                                            }}
                                            style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: finish.color, border: 'none', cursor: 'pointer',
                                                outline: selectedFinish === i ? '2px solid var(--charcoal)' : 'none',
                                                outlineOffset: 3, transition: 'all 0.2s',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                            }}
                                            title={finish.name}
                                        />
                                    ))}
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                    {locale === 'ar' ? 'المحدد:' : 'Selected:'}{' '}
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {product.finishes[selectedFinish]?.name}
                                    </span>
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            {product.showInStore && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                    <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>
                                        {locale === 'ar' ? 'الكمية:' : 'Quantity:'}
                                    </span>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: 8,
                                        background: 'white'
                                    }}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            style={{
                                                padding: '8px 16px',
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                fontSize: 16,
                                                color: quantity <= 1 ? '#ccc' : 'var(--charcoal)'
                                            }}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span style={{
                                            padding: '8px 12px',
                                            minWidth: 40,
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            borderLeft: '1px solid var(--border-light)',
                                            borderRight: '1px solid var(--border-light)'
                                        }}>
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            style={{
                                                padding: '8px 16px',
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                fontSize: 16,
                                                color: 'var(--charcoal)'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                                {product.showInStore && (
                                    <button
                                        onClick={() => product && addToCart(product, quantity, { finish: product.finishes[selectedFinish]?.name })}
                                        className="btn"
                                        style={{
                                            padding: '13px 28px', fontSize: 14, gap: 8,
                                            background: '#1A1A1A', color: 'white', border: 'none',
                                            display: 'flex', alignItems: 'center', cursor: 'pointer',
                                            borderRadius: 8, fontWeight: 700
                                        }}
                                    >
                                        <span>🛒</span> {locale === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                                    </button>
                                )}
                                <Link href={`/contact?product=${product.id}`} className="btn btn-gold"
                                    style={{ padding: '13px 28px', fontSize: 14, gap: 8 }}>
                                    <span>✉</span> {locale === 'ar' ? 'طلب استفسار' : 'Request Inquiry'}
                                </Link>
                                {product.catalog && (
                                    <a
                                        href={product.catalog}
                                        download={`catalog-${product.ref}.pdf`}
                                        className="btn btn-outline"
                                        style={{ padding: '13px 28px', fontSize: 14, gap: 8, textDecoration: 'none' }}
                                    >
                                        <span>↓</span> {locale === 'ar' ? 'تحميل الكتالوج' : 'Download Catalog'}
                                    </a>
                                )}
                            </div>

                            {/* Accordion Sections */}
                            <div style={{ borderTop: '1px solid var(--border-light)' }}>
                                {/* Technical Specifications */}
                                <div>
                                    <button onClick={() => toggleSection('specs')} style={{
                                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 15, fontWeight: 700, color: 'var(--charcoal)',
                                        borderBottom: '1px solid var(--border-light)',
                                    }}>
                                        {locale === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
                                        <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: openSection === 'specs' ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                                    </button>
                                    {openSection === 'specs' && (
                                        <div style={{ padding: '16px 0' }}>
                                            {[
                                                { label: locale === 'ar' ? 'مادة القلب' : 'Core Material', value: product.specs.material },
                                                ...(product.specs.dimensions ? [{ label: locale === 'ar' ? 'الأبعاد' : 'Dimensions', value: product.specs.dimensions }] : []),
                                                ...(product.specs.thickness ? [{ label: locale === 'ar' ? 'السماكة' : 'Thickness', value: product.specs.thickness }] : []),
                                                ...(product.specs.fireRating ? [{ label: locale === 'ar' ? 'تصنيف الحريق' : 'Fire Rating', value: product.specs.fireRating }] : []),
                                                ...(product.specs.soundInsulation ? [{ label: locale === 'ar' ? 'عزل الصوت' : 'Sound Insulation', value: product.specs.soundInsulation }] : []),
                                                ...(product.specs.finish ? [{ label: locale === 'ar' ? 'وصف التشطيب' : 'Finish Description', value: product.specs.finish }] : []),
                                            ].map((spec, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
                                                    <span style={{ color: 'var(--text-secondary)' }}>{spec.label}</span>
                                                    <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Shipping & Delivery */}
                                <div>
                                    <button onClick={() => toggleSection('shipping')} style={{
                                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 15, fontWeight: 700, color: 'var(--charcoal)',
                                        borderBottom: '1px solid var(--border-light)',
                                    }}>
                                        {locale === 'ar' ? 'الشحن والتوصيل' : 'Shipping & Delivery'}
                                        <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: openSection === 'shipping' ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                                    </button>
                                    {openSection === 'shipping' && (
                                        <div style={{ padding: '16px 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                            {locale === 'ar'
                                                ? 'التوصيل خلال 4-6 أسابيع للطلبات المخصصة. الشحن متاح لجميع مناطق المملكة العربية السعودية ودول الخليج.'
                                                : 'Delivery within 4-6 weeks for custom orders. Shipping available to all regions of Saudi Arabia and GCC countries.'}
                                        </div>
                                    )}
                                </div>

                                {/* Warranty */}
                                <div>
                                    <button onClick={() => toggleSection('warranty')} style={{
                                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 15, fontWeight: 700, color: 'var(--charcoal)',
                                        borderBottom: '1px solid var(--border-light)',
                                    }}>
                                        {locale === 'ar' ? 'الضمان' : 'Warranty'}
                                        <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: openSection === 'warranty' ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                                    </button>
                                    {openSection === 'warranty' && (
                                        <div style={{ padding: '16px 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                            {locale === 'ar'
                                                ? 'ضمان 10 سنوات على جميع الأبواب ضد عيوب التصنيع. ضمان 5 سنوات على التشطيبات والأجهزة.'
                                                : '10-year warranty on all doors against manufacturing defects. 5-year warranty on finishes and hardware.'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quality Guarantee */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '16px 20px', marginTop: 20,
                                background: '#FFF9E6', borderRadius: 12,
                                border: '1px solid rgba(212,160,23,0.2)',
                            }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: 'rgba(212,160,23,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 18, flexShrink: 0,
                                }}>🏅</div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--charcoal)', marginBottom: 2 }}>
                                        {locale === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}
                                    </p>
                                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        {locale === 'ar'
                                            ? 'معتمد من هيئة المواصفات والمقاييس والجودة السعودية (ساسو)'
                                            : 'Certified by Saudi Standards, Metrology and Quality Organization (SASO).'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Designs Section */}
                <div style={{ background: '#fff', borderTop: '1px solid var(--border-light)' }}>
                    <div className="container" style={{ paddingTop: 48, paddingBottom: 60 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--charcoal)' }}>
                                {locale === 'ar' ? 'تصاميم مشابهة' : 'Similar Designs'}
                            </h2>
                            <Link href="/products" style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                                {locale === 'ar' ? 'عرض كل المجموعة ←' : 'View all collection →'}
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                            {similarProducts.map(p => (
                                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ transition: 'all 0.3s', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <div style={{
                                            borderRadius: 16, overflow: 'hidden',
                                            background: p.image
                                                ? `url(${p.image}) center/cover no-repeat`
                                                : 'linear-gradient(135deg, #8B6914, #C8944A, #D4A017)',
                                            height: 320, marginBottom: 14,
                                        }} />
                                        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 4 }}>
                                            {locale === 'ar' ? p.nameAr : p.nameEn}
                                        </h3>
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                            {locale === 'ar' ? p.seriesAr : p.seriesEn}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
