'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Order } from '@/data/index';

const statusColors = {
    new: { bg: '#EBF8FF', text: '#2B6CB0' },
    processing: { bg: '#FAF5FF', text: '#805AD5' },
    completed: { bg: '#F0FFF4', text: '#2F855A' },
    cancelled: { bg: '#FFF5F5', text: '#C53030' },
};

export default function OrdersManagement() {
    const { locale } = useI18n();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading orders:', err);
                setLoading(false);
            });
    }, []);

    const updateStatus = async (newStatus: Order['status']) => {
        if (!selectedOrder) return;
        setStatusUpdating(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedOrder.id, status: newStatus }),
            });

            if (res.ok) {
                const updated = await res.json();
                setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
                setSelectedOrder(updated);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setStatusUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center text-gray-400">
                {locale === 'ar' ? 'جاري تحميل الطلبات...' : 'Loading orders...'}
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-56px)] flex bg-[#FAFAF8]">
            {/* Orders List */}
            <div className="w-[380px] border-r border-[#E8E8E4] bg-white flex flex-col">
                <div className="p-5 border-b border-[#E8E8E4]">
                    <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">
                        {locale === 'ar' ? 'الطلبات' : 'Orders'}
                    </h2>
                    <p className="text-xs text-gray-500">
                        {orders.length} {locale === 'ar' ? 'طلب' : 'orders found'}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {orders.length === 0 ? (
                        <div className="text-center p-10 text-gray-400 text-sm">
                            {locale === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                        </div>
                    ) : (
                        orders.map(order => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-4 mb-2 rounded-lg cursor-pointer border transition-all ${selectedOrder?.id === order.id
                                    ? 'border-[var(--gold)] bg-[#FFFBF0]'
                                    : 'border-transparent hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs font-bold text-gray-500">
                                        {order.id}
                                    </span>
                                    <span
                                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                                        style={{
                                            backgroundColor: statusColors[order.status]?.bg || '#eee',
                                            color: statusColors[order.status]?.text || '#666'
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-[#1A1A1A] text-sm mb-1">
                                    {order.customerName}
                                </h3>
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>{new Date(order.createdAt || '').toLocaleDateString()}</span>
                                    <span className="font-bold text-[#1A1A1A]">
                                        {(order.totalAmount || 0).toLocaleString()} SAR
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Order Details */}
            <div className="flex-1 overflow-y-auto bg-[#FAFAF8] p-8">
                {selectedOrder ? (
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-bold text-[#1A1A1A]">
                                        Order #{selectedOrder.id}
                                    </h1>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                        style={{
                                            backgroundColor: statusColors[selectedOrder.status as keyof typeof statusColors]?.bg || '#eee',
                                            color: statusColors[selectedOrder.status as keyof typeof statusColors]?.text || '#666'
                                        }}
                                    >
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Placed on {new Date(selectedOrder.createdAt || '').toLocaleString()}
                                </p>
                            </div>

                            <select
                                value={selectedOrder.status}
                                onChange={(e) => updateStatus(e.target.value as any)}
                                disabled={statusUpdating}
                                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                            >
                                <option value="pending">New</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="col-span-2 space-y-6">
                                {/* Items */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#E8E8E4] overflow-hidden">
                                    <div className="p-4 border-b border-[#E8E8E4] bg-gray-50 font-bold text-sm text-[#1A1A1A]">
                                        {locale === 'ar' ? 'المنتجات' : 'Items'}
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx) => (
                                            <div key={idx} className="p-4 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                                    📦
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm text-[#1A1A1A]">Product ID: {item.productId}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Finish: {item.finish || 'Default'} • Qty: {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="font-bold text-sm">
                                                    {(item.price * item.quantity).toLocaleString()} SAR
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-gray-50 border-t border-[#E8E8E4] flex justify-between items-center">
                                        <span className="font-bold text-gray-600">Total</span>
                                        <span className="font-bold text-xl text-[#1A1A1A]">{(selectedOrder.totalAmount || 0).toLocaleString()} SAR</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#E8E8E4] p-5">
                                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">
                                        {locale === 'ar' ? 'بيانات العميل' : 'Customer'}
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <div className="font-bold text-[#1A1A1A]">
                                                {selectedOrder.customerName}
                                            </div>
                                            <div className="text-gray-500">{selectedOrder.email}</div>
                                            <div className="text-gray-500">{selectedOrder.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="text-6xl mb-4">📋</span>
                        <p>{locale === 'ar' ? 'اختر طلباً لعرض التفاصيل' : 'Select an order to view details'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
