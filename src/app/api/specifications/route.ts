import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/specifications.json');

// Helper to read data
function getSpecs() {
    if (!fs.existsSync(dataPath)) {
        return [];
    }
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    try {
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

// Helper to write data
function saveSpecs(specs: any[]) {
    fs.writeFileSync(dataPath, JSON.stringify(specs, null, 4));
}

export async function GET() {
    const specs = getSpecs();
    return NextResponse.json(specs);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation - check if it's an array
        if (!Array.isArray(body)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        saveSpecs(body);
        return NextResponse.json({ success: true, message: 'Specifications saved' });
    } catch (error) {
        console.error('Error saving specs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
