import { NextRequest, NextResponse } from 'next/server';
import { getProjects, addProject, updateProject, deleteProjectById } from '@/lib/store';
import type { Project } from '@/data/index';

export async function GET() {
    const projects = await getProjects();
    return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const project: Project = {
            id: body.id || `project-${Date.now()}`,
            titleEn: body.titleEn || '',
            titleAr: body.titleAr || '',
            descEn: body.descEn || '',
            descAr: body.descAr || '',
            category: body.category || '',
            subcategory: body.subcategory || '',
            status: body.status || 'draft',
            tags: body.tags || [],
            images: body.images || [],
            featuredImage: body.featuredImage || '',
            lastEdited: 'Just now',
        };
        await addProject(project);
        return NextResponse.json(project, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const updated = await updateProject(id, { ...updates, lastEdited: 'Just now' });
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const deleted = await deleteProjectById(id);
        if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

