const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const productCount = await prisma.product.count();
        console.log(`TOTAL_PRODUCTS: ${productCount}`);
    } catch (e) {
        console.error('DB_ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
