import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        // Delete all records from all tables
        // Note: Using deleteMany() is safer than TRUNCATE in some hosted environments
        await prisma.order.deleteMany();
        await prisma.inquiry.deleteMany();
        await prisma.product.deleteMany();
        await prisma.project.deleteMany();
        await prisma.collection.deleteMany();

        return NextResponse.json({
            success: true,
            message: 'All data has been cleared successfully.'
        });
    } catch (error: any) {
        console.error('Cleanup error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
