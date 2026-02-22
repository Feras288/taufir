export interface ProductFinish {
    name: string;
    color: string;
    imageIndex?: number;
}

export interface Product {
    id: string;
    nameEn: string;
    nameAr: string;
    descEn: string;
    descAr: string;
    category: 'interior' | 'exterior' | 'fire-rated' | 'custom';
    seriesEn: string;
    seriesAr: string;
    badges: string[];
    image: string;
    images: string[];
    finishes: ProductFinish[];
    specs: {
        material: string;
        dimensions: string;
        fireRating?: string;
        finish: string;
        soundInsulation?: string;
        thickness?: string;
    };
    ref: string;
    catalog?: string;
    price?: number;
    priceTiers?: { min: number; price: number }[];
    showInStore?: boolean;
}

export interface Project {
    id: string;
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
    category: string;
    subcategory: string;
    status: 'published' | 'draft';
    tags: string[];
    images: string[];
    featuredImage: string;
    lastEdited: string;
}

export interface Collection {
    id: string;
    nameEn: string;
    nameAr: string;
    descEn: string;
    descAr: string;
    image: string;
    productCount: number;
}

export interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    productId?: string;
    status: 'pending' | 'read' | 'contacted';
    createdAt?: string;
}


export interface Order {
    id: string;
    customerName: string;
    email: string;
    phone?: string;
    totalAmount: number;
    items: any; // Simplified for DB storage
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt?: string;
}


export const products: Product[] = [];


export const projects: Project[] = [];

export const collections: Collection[] = [];

