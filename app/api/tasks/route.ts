// app/api/tasks/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const TaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.string().optional().default("todo"),
  projectId: z.string().min(1, "Project ID is required"),
  assigneeId: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = TaskSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const { title, description, status, projectId, assigneeId } = validation.data;

    // Verifikasi session & akses project
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.ownerId === userId;
    const isMember = project.members.some(m => m.userId === userId);
    if (!isOwner && !isMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Cek assignee jika disediakan
    if (assigneeId) {
      const userExists = await prisma.user.findUnique({ where: { id: assigneeId } });
      if (!userExists) {
        return NextResponse.json(
          { error: "Assignee user not found" },
          { status: 404 }
        );
      }
    }

    // Buat task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        projectId,
        assigneeId: assigneeId || null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        projectId: true,
        assigneeId: true,
        createdAt: true,
      }
    });

    return NextResponse.json(task, { status: 201 });

  } catch (error: unknown) {
    console.error("Failed to create task:", error);
    if (error instanceof Error && 'code' in error && error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid foreign key constraint" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Failed to create task",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  // 1. Verifikasi session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = params.projectId;

  // 2. Pastikan project ada & user owner/member
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  const isOwner = project.ownerId === userId;
  const isMember = project.members.some((m) => m.userId === userId);
  if (!isOwner && !isMember) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // 3. Ambil semua tasks, include relasi assignedTo
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}