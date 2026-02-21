import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/store';
import type { Product } from '@/data/index';

// GET all products
export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

// POST - add new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const product: Product = {
            id: body.id || `product-${Date.now()}`,
            nameEn: body.nameEn || '',
            nameAr: body.nameAr || '',
            descEn: body.descEn || '',
            descAr: body.descAr || '',
            category: body.category || 'interior',
            seriesEn: body.seriesEn || '',
            seriesAr: body.seriesAr || '',
            badges: body.badges || [],
            image: body.image || '',
            images: body.images || [],
            finishes: body.finishes || [],
            specs: body.specs || { material: '', dimensions: '', finish: '' },
            ref: body.ref || `WDF-NEW-${Date.now()}`,
            price: body.price || 0,
            priceTiers: body.priceTiers || [],
            showInStore: body.showInStore !== undefined ? body.showInStore : true,
        };
        await addProduct(product);
        return NextResponse.json(product, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

// PUT - update existing product
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
        const updated = await updateProduct(id, updates);
        if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

// DELETE - remove product
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
        const deleted = await deleteProduct(id);
        if (!deleted) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

