import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET() {
    // Only allow this in production if needed, or protect with a secret
    // For now, it's a utility for the user to run once.

    const runCommand = (command: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error: ${error.message}\nStderr: ${stderr}`);
                } else {
                    resolve(stdout || stderr);
                }
            });
        });
    };

    try {
        console.log('Starting migration...');
        const pushResult = await runCommand('npx prisma db push --accept-data-loss');
        console.log('Push result:', pushResult);

        console.log('Starting seed...');
        const seedResult = await runCommand('node prisma/seed.js');
        console.log('Seed result:', seedResult);

        return NextResponse.json({
            success: true,
            push: pushResult,
            seed: seedResult
        });
    } catch (error: any) {
        console.error('Migration failed:', error);
        return NextResponse.json({
            success: false,
            error: error.toString()
        }, { status: 500 });
    }
}
