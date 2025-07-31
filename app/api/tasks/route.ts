import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Validasi input dengan Zod
import { z } from 'zod';

// Schema validasi
const TaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.string().optional().default("todo"),
  projectId: z.string().min(1, "Project ID is required"),
  assigneeId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validasi input
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

    // Cek apakah project ada
    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Cek assignee jika disediakan
    if (assigneeId) {
      const userExists = await prisma.user.findUnique({
        where: { id: assigneeId },
      });

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
        description: description || null,
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
  } catch (error: any) {
    console.error("Failed to create task:", error);
    
    // Tangani error Prisma secara spesifik
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid foreign key constraint" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to create task",
        details: error.message || "Unknown error"
      }, 
      { status: 500 }
    );
  }
}