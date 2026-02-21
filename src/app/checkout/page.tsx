'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/lib/i18n';
import ClientLayout from '@/components/ClientLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart, updateQuantity } = useCart();
    const { t, locale } = useI18n();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'tabby' | 'tamara'>('cod');
    const COD_FEE = 15;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        finish: item.options?.finish,
                        price: item.product.price
                    })),
                    customer: formData,
                    total: cartTotal + (paymentMethod === 'cod' ? COD_FEE : 0),
                    paymentMethod,
                    locale
                })
            });

            if (!response.ok) throw new Error('Failed to place order');

            // Success
            clearCart();
            alert(locale === 'ar' ? 'تم استلام طلبك بنجاح! سنتواصل معك قريباً.' : 'Order placed successfully! We will contact you shortly.');
            router.push('/');
        } catch (err) {
            setError(locale === 'ar' ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'Error placing order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <ClientLayout>
                <div className="container py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">{locale === 'ar' ? 'سلة المشتريات فارغة' : 'Your Application Cart is Empty'}</h1>
                    <Link href="/store" className="btn btn-gold inline-flex items-center gap-2">
                        {locale === 'ar' ? 'تصفح المتجر' : 'Browse Store'}
                    </Link>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout>
            <div className="bg-[#F5F5F0] min-h-screen py-12">
                <div className="container">
                    <h1 className="text-3xl font-bold mb-8 font-cairo text-[#1A1A1A]">
                        {locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form Section */}
                        <div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-[#D4A017] text-white flex items-center justify-center text-sm">1</span>
                                    {locale === 'ar' ? 'بيانات العميل' : 'Customer Details'}
                                </h2>

                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017] outline-none"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'الاسم الأخير' : 'Last Name'}</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017] outline-none"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017] outline-none"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'رقم الهاتف (واتساب)' : 'Phone Number (WhatsApp)'}</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            placeholder="+966..."
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017] outline-none"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'المدينة' : 'City'}</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017] outline-none"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'العنوان بالتفصيل' : 'Address Details'}</label>
                                        <textarea
                                            name="address"
                                            required
                                            rows={3}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017] outline-none"
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
                                        <textarea
                                            name="notes"
                                            rows={2}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017] outline-none"
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}


                                </form>
                            </div>

                            {/* Payment Method Section */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm mt-8">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-[#D4A017] text-white flex items-center justify-center text-sm">2</span>
                                    {locale === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                                </h2>

                                <div className="space-y-4">
                                    {/* COD */}
                                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#D4A017] bg-[#FFF9E6]' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 w-4 h-4 accent-[#D4A017]" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-[#1A1A1A]">{locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                                                <span className="text-xs font-bold text-[#D4A017] bg-[#D4A017]/10 px-2 py-1 rounded">+15 SAR</span>
                                            </div>
                                            <p className="text-xs text-gray-500">{locale === 'ar' ? 'الدفع نقداً عند استلام الطلب' : 'Pay cash when you receive your order'}</p>
                                        </div>
                                    </label>

                                    {/* Bank Transfer */}
                                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-[#D4A017] bg-[#FFF9E6]' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} className="mt-1 w-4 h-4 accent-[#D4A017]" />
                                        <div className="flex-1">
                                            <span className="font-bold text-[#1A1A1A] block mb-1">{locale === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</span>
                                            {paymentMethod === 'bank_transfer' && (
                                                <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-sm">
                                                    <p className="font-bold mb-1">{locale === 'ar' ? 'تفاصيل الحساب:' : 'Account Details:'}</p>
                                                    <p className="text-gray-600 font-mono text-xs mb-1">Al Rajhi Bank</p>
                                                    <p className="text-gray-600 font-mono text-xs mb-1">SA58 8000 0000 0000 0000 0000</p>
                                                    <p className="text-gray-600 font-mono text-xs">Saudi Wood Factory</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>

                                    {/* Tabby */}
                                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'tabby' ? 'border-[#00E5C0] bg-[#F0FFFB]' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="payment" value="tabby" checked={paymentMethod === 'tabby'} onChange={() => setPaymentMethod('tabby')} className="mt-1 w-4 h-4 accent-[#00E5C0]" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-[#1A1A1A]">{locale === 'ar' ? 'تابي' : 'Tabby'}</span>
                                                <span className="text-[10px] font-bold bg-[#00E5C0] text-black px-2 py-0.5 rounded-full">{locale === 'ar' ? '4 دفعات' : 'Split in 4'}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">{locale === 'ar' ? 'بدون فوائد أو رسوم' : 'No interest or fees'}</p>
                                        </div>
                                    </label>

                                    {/* Tamara */}
                                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'tamara' ? 'border-[#ED7862] bg-[#FFF2F0]' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="payment" value="tamara" checked={paymentMethod === 'tamara'} onChange={() => setPaymentMethod('tamara')} className="mt-1 w-4 h-4 accent-[#ED7862]" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-[#1A1A1A]">{locale === 'ar' ? 'تمارا' : 'Tamara'}</span>
                                                <span className="text-[10px] font-bold bg-[#ED7862] text-white px-2 py-0.5 rounded-full">{locale === 'ar' ? '4 دفعات' : 'Split in 4'}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">{locale === 'ar' ? 'بدون فوائد أو رسوم' : 'No interest or fees'}</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* End Form Section Wrapper */}
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-[#F0F0EC] text-[#1A1A1A] flex items-center justify-center text-sm border border-gray-200">2</span>
                                    {locale === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                                </h2>

                                <div className="space-y-4 mb-6">
                                    {items.map(item => (
                                        <div key={item.product.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-sm text-[#1A1A1A]">{locale === 'ar' ? item.product.nameAr : item.product.nameEn}</h3>
                                                <p className="text-xs text-gray-500 mb-2">{item.options?.finish || 'Default'}</p>

                                                <div className="flex items-center border border-gray-200 rounded-md w-fit bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >-</button>
                                                    <span className="px-2 text-xs font-semibold min-w-[20px] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 text-sm"
                                                    >+</button>
                                                </div>
                                            </div>
                                            <div className="font-bold text-sm">
                                                {(() => {
                                                    let price = item.product.price || 0;
                                                    if (item.product.priceTiers) {
                                                        const tier = item.product.priceTiers
                                                            .sort((a, b) => b.min - a.min)
                                                            .find(t => item.quantity >= t.min);
                                                        if (tier) price = tier.price;
                                                    }
                                                    return (price * item.quantity).toLocaleString();
                                                })()} SAR
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                        <span>{cartTotal.toLocaleString()} SAR</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
                                        <span className="text-green-600 text-sm">{locale === 'ar' ? 'مجاني لفترة محدودة' : 'Free (Limited Time)'}</span>
                                    </div>
                                    {paymentMethod === 'cod' && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>{locale === 'ar' ? 'رسوم الدفع عند الاستلام' : 'COD Fee'}</span>
                                            <span>{COD_FEE} SAR</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold text-[#1A1A1A] pt-2 border-t border-gray-100 mt-2">
                                        <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                        <span>{(cartTotal + (paymentMethod === 'cod' ? COD_FEE : 0)).toLocaleString()} SAR</span>
                                    </div>
                                </div>
                                <div className="mt-6 bg-[#FFF9E6] p-4 rounded-xl border border-[#D4A017]/20 flex gap-3">
                                    <span className="text-xl">🛡️</span>
                                    <p className="text-xs text-[#8B6914] leading-relaxed">
                                        {locale === 'ar'
                                            ? 'تسوقك آمن 100%. جميع المنتجات مضمونة من المصنع مباشرة مع ضمان استبدال أو استرجاع.'
                                            : 'Your shopping is 100% secure. All products are guaranteed directly from the factory with a replacement or return warranty.'
                                        }
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#D4A017] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {isSubmitting
                                        ? (locale === 'ar' ? 'جاري الإرسال...' : 'Processing...')
                                        : (locale === 'ar' ? `تأكيد الطلب (${(cartTotal + (paymentMethod === 'cod' ? COD_FEE : 0)).toLocaleString()} ر.س)` : `Place Order (${(cartTotal + (paymentMethod === 'cod' ? COD_FEE : 0)).toLocaleString()} SAR)`)
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
