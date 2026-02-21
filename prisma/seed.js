const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
    const dataPath = path.join(__dirname, '../data-store.json')
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    console.log('Seeding products...')
    for (const product of data.products) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {
                nameEn: product.nameEn,
                nameAr: product.nameAr,
                descEn: product.descEn,
                descAr: product.descAr,
                category: product.category,
                seriesEn: product.seriesEn,
                seriesAr: product.seriesAr,
                badges: product.badges || [],
                image: product.image,
                images: product.images || [],
                finishes: product.finishes,
                specs: product.specs,
                ref: product.ref,
                price: product.price,
                priceTiers: product.priceTiers,
                showInStore: product.showInStore || false,
            },
            create: {
                id: product.id,
                nameEn: product.nameEn,
                nameAr: product.nameAr,
                descEn: product.descEn,
                descAr: product.descAr,
                category: product.category,
                seriesEn: product.seriesEn,
                seriesAr: product.seriesAr,
                badges: product.badges || [],
                image: product.image,
                images: product.images || [],
                finishes: product.finishes,
                specs: product.specs,
                ref: product.ref,
                price: product.price,
                priceTiers: product.priceTiers,
                showInStore: product.showInStore || false,
            },
        })
    }

    console.log('Seeding projects...')
    for (const project of data.projects) {
        await prisma.project.upsert({
            where: { id: project.id },
            update: {
                titleEn: project.titleEn,
                titleAr: project.titleAr,
                descEn: project.descEn,
                descAr: project.descAr,
                category: project.category,
                subcategory: project.subcategory,
                status: project.status,
                tags: project.tags || [],
                images: project.images || [],
                featuredImage: project.featuredImage,
                lastEdited: project.lastEdited,
            },
            create: {
                id: project.id,
                titleEn: project.titleEn,
                titleAr: project.titleAr,
                descEn: project.descEn,
                descAr: project.descAr,
                category: project.category,
                subcategory: project.subcategory,
                status: project.status,
                tags: project.tags || [],
                images: project.images || [],
                featuredImage: project.featuredImage,
                lastEdited: project.lastEdited,
            },
        })
    }

    console.log('Seeding collections...')
    for (const collection of data.collections) {
        await prisma.collection.upsert({
            where: { id: collection.id },
            update: {
                nameEn: collection.nameEn,
                nameAr: collection.nameAr,
                descEn: collection.descEn,
                descAr: collection.descAr,
                image: collection.image,
                productCount: collection.productCount || 0,
            },
            create: {
                id: collection.id,
                nameEn: collection.nameEn,
                nameAr: collection.nameAr,
                descEn: collection.descEn,
                descAr: collection.descAr,
                image: collection.image,
                productCount: collection.productCount || 0,
            },
        })
    }

    console.log('Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
