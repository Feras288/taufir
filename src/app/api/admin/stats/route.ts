import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const [
            productCount,
            inquiryCount,
            projectCount,
            orderCount,
            recentInquiries,
            recentActivity
        ] = await Promise.all([
            prisma.product.count(),
            prisma.inquiry.count(),
            prisma.project.count(),
            prisma.order.count(),
            prisma.inquiry.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' }
            }),
            // compiling recent activity from different tables
            Promise.all([
                prisma.product.findMany({ take: 2, orderBy: { createdAt: 'desc' }, select: { nameEn: true, createdAt: true } }),
                prisma.inquiry.findMany({ take: 2, orderBy: { createdAt: 'desc' }, select: { name: true, createdAt: true, id: true } }),
                prisma.project.findMany({ take: 2, orderBy: { createdAt: 'desc' }, select: { titleEn: true, createdAt: true } }),
                prisma.order.findMany({ take: 2, orderBy: { createdAt: 'desc' }, select: { customerName: true, totalAmount: true, createdAt: true } }),
            ]).then(([productsData, inquiriesData, projectsData, ordersData]) => {
                const activities = [
                    ...productsData.map((p: any) => ({ icon: '📦', text: `New product "${p.nameEn}" added`, time: p.createdAt })),
                    ...inquiriesData.map((i: any) => ({ icon: '💬', text: `Inquiry received from ${i.name}`, time: i.createdAt })),
                    ...projectsData.map((p: any) => ({ icon: '✅', text: `Project "${p.titleEn}" added/updated`, time: p.createdAt })),
                    ...ordersData.map((o: any) => ({ icon: '📋', text: `New order from ${o.customerName} for ${o.totalAmount} SAR`, time: o.createdAt })),
                ];
                return activities
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                    .slice(0, 5);
            })
        ]);

        // Specific inquiry stats for Inquiries page
        const [newInquiries, inProgressInquiries, closedInquiries] = await Promise.all([
            prisma.inquiry.count({ where: { status: 'pending' } }),
            prisma.inquiry.count({ where: { status: 'read' } }), // 'read' maps to In Progress in the UI
            prisma.inquiry.count({ where: { status: 'contacted' } }), // 'contacted' is used for completed/contacted
        ]);

        return NextResponse.json({
            overview: {
                productCount,
                inquiryCount,
                projectCount,
                orderCount,
            },
            recentInquiries: recentInquiries.map((inq: any) => ({
                id: `#INQ-${inq.id.slice(-4).toUpperCase()}`,
                client: inq.name,
                product: inq.productId || 'General Inquiry',
                status: inq.status === 'pending' ? 'New' : inq.status === 'read' ? 'In Progress' : 'Contacted',
                time: inq.createdAt
            })),
            recentActivity: recentActivity.map((a: any) => ({
                ...a,
                time: formatRelativeTime(a.time)
            })),
            inquiryStats: {
                total: inquiryCount,
                new: newInquiries,
                inProgress: inProgressInquiries,
                closed: closedInquiries // Mapping contacted to closed for now or as appropriate
            }
        });
    } catch (error: any) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

function formatRelativeTime(date: Date) {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
}
