import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const productCount = await prisma.product.count();
        const inquiryCount = await prisma.inquiry.count();
        const projectCount = await prisma.project.count();
        console.log(`Products: ${productCount}`);
        console.log(`Inquiries: ${inquiryCount}`);
        console.log(`Projects: ${projectCount}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
