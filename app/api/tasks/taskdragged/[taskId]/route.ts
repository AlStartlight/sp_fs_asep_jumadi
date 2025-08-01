// app/api/tasks/[taskId]/route.ts
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  // 1. Verifikasi session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Ambil new status dari body
  const { status } = await req.json();
  if (typeof status !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid status' }, { status: 400 });
  }

  // 3. Temukan task dan project-nya
  const task = await prisma.task.findUnique({
    where: { id: params.taskId },
    include: { project: { include: { members: true } } },
  });
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // 4. Cek akses: harus owner atau member project
  const project = task.project;
  const isOwner = project.ownerId === userId;
  const isMember = project.members.some(m => m.userId === userId);
  if (!isOwner && !isMember) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // 5. Update status
  try {
    const updated = await prisma.task.update({
      where: { id: params.taskId },
      data: { status },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        projectId: true,
        assigneeId: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Failed to update task status:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
