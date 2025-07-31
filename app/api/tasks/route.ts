import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}