import { NextRequest, NextResponse } from 'next/server';
import { addOrder, getOrders, updateOrder } from '@/lib/store';
import type { Order } from '@/data/index';

export async function GET() {
    const orders = await getOrders();
    return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.items || !body.customer || !body.total) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            customerName: `${body.customer.firstName} ${body.customer.lastName}`,
            email: body.customer.email,
            phone: body.customer.phone,
            totalAmount: body.total,
            items: body.items,
            status: 'pending',
        };

        const savedOrder = await addOrder(newOrder);

        return NextResponse.json(savedOrder, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const updatedOrder = await updateOrder(id, status);
        if (!updatedOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

