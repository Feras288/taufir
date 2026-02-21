/**
 * Server-side data store with PostgreSQL persistence via Prisma.
 * Both the admin panel and public pages read/write through API routes that use this store.
 */

import prisma from './db';
import type { Product, Project, Collection, Inquiry, Order } from '@/data/index';

// Products
export async function getProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
    // Map Prisma models back to our local Product type if necessary
    // Prisma String[] and Json match our types
    return products as unknown as Product[];
}

export async function getProduct(id: string): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({
        where: { id }
    });
    return (product as unknown as Product) || undefined;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...updates,
                // Handle complex fields specifically if needed
                badges: updates.badges,
                images: updates.images,
                finishes: updates.finishes as any,
                specs: updates.specs as any,
                priceTiers: updates.priceTiers as any,
            }
        });
        return product as unknown as Product;
    } catch (e) {
        console.error('Error updating product:', e);
        return null;
    }
}

export async function addProduct(product: Product): Promise<Product> {
    const newProduct = await prisma.product.create({
        data: {
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
            finishes: product.finishes as any,
            specs: product.specs as any,
            ref: product.ref,
            price: product.price,
            priceTiers: product.priceTiers as any,
            showInStore: product.showInStore ?? true,
        }
    });
    return newProduct as unknown as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        await prisma.product.delete({
            where: { id }
        });
        return true;
    } catch {
        return false;
    }
}

// Projects
export async function getProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return projects as unknown as Project[];
}

export async function getProject(id: string): Promise<Project | undefined> {
    const project = await prisma.project.findUnique({
        where: { id }
    });
    return (project as unknown as Project) || undefined;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...updates,
                tags: updates.tags,
                images: updates.images,
            }
        });
        return project as unknown as Project;
    } catch (e) {
        console.error('Error updating project:', e);
        return null;
    }
}

export async function addProject(project: Project): Promise<Project> {
    const newProject = await prisma.project.create({
        data: {
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
        }
    });
    return newProject as unknown as Project;
}

export async function deleteProjectById(id: string): Promise<boolean> {
    try {
        await prisma.project.delete({
            where: { id }
        });
        return true;
    } catch {
        return false;
    }
}

// Collections
export async function getCollections(): Promise<Collection[]> {
    const collections = await prisma.collection.findMany();
    return collections as unknown as Collection[];
}

export async function addCollection(collection: Collection): Promise<Collection> {
    const newCollection = await prisma.collection.create({
        data: {
            id: collection.id,
            nameEn: collection.nameEn,
            nameAr: collection.nameAr,
            descEn: collection.descEn,
            descAr: collection.descAr,
            image: collection.image,
            productCount: collection.productCount || 0,
        }
    });
    return newCollection as unknown as Collection;
}

// Inquiries
export async function getInquiries(): Promise<Inquiry[]> {
    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return inquiries as unknown as Inquiry[];
}

export async function addInquiry(inquiry: Inquiry): Promise<Inquiry> {
    const newInquiry = await prisma.inquiry.create({
        data: {
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            message: inquiry.message,
            productId: inquiry.productId,
            status: inquiry.status || 'pending',
        }
    });
    return newInquiry as unknown as Inquiry;
}

// Orders
export async function getOrders(): Promise<Order[]> {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return orders as unknown as Order[];
}

export async function addOrder(order: Order): Promise<Order> {
    const newOrder = await prisma.order.create({
        data: {
            customerName: order.customerName,
            email: order.email,
            phone: order.phone,
            totalAmount: order.totalAmount,
            items: order.items as any,
            status: order.status || 'pending',
        }
    });
    return newOrder as unknown as Order;
}

export async function updateOrder(id: string, status: Order['status']): Promise<Order | null> {
    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });
        return order as unknown as Order;
    } catch {
        return null;
    }
}

// Reset store - Not recommended for DB but kept as placeholder or for manual purging
export async function resetStore(): Promise<void> {
    await prisma.product.deleteMany();
    await prisma.project.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.order.deleteMany();
}

