// app/api/projects/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, ownerId } = body;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        ownerId,
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        owner: true,
      },
    });
    return NextResponse.json(projects);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}