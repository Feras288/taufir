import { NextRequest, NextResponse } from 'next/server';
import { addInquiry, getInquiries } from '@/lib/store';
import type { Inquiry } from '@/data/index';

export async function GET() {
    const inquiries = await getInquiries();
    return NextResponse.json(inquiries);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        // Use either 'details' or 'message' from body
        const message = body.message || body.details;

        if (!body.name || !body.phone || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const inquiry: Inquiry = {
            id: `inquiry-${Date.now()}`,
            name: body.name,
            email: body.email || '',
            phone: body.phone,
            message: message,
            productId: body.productId,
            status: 'pending'
        };

        const saved = await addInquiry(inquiry);
        return NextResponse.json(saved, { status: 201 });
    } catch (e) {
        console.error('Error processing inquiry:', e);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

