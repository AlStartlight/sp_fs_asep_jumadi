import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      members: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const isOwner = project.ownerId === userId;
  const isMember = project.members.some((m) => m.userId === userId);

  if (!isOwner && !isMember) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const tasks = await prisma.task.findMany({
    where: { projectId: params.projectId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tasks);
}
