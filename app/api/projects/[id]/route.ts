// app/api/projects/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const projects = await prisma.project.findUnique({
        where: { id: params.id },
    });
    if (!projects) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(projects);
}
