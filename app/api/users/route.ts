// app/api/users/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse ,NextRequest} from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = new URL(request.url).searchParams.get('boardId');
  if (!projectId) {
    return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
  }

  // Cari project + owner + members
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Gabungkan owner + members (hindari duplikat jika owner juga dr membership)
  const allUsersMap: Record<string, { id: string; name: string; email: string }> = {};

  // Tambah owner
  allUsersMap[project.owner.id] = project.owner;

  // Tambah members
  for (const m of project.members) {
    allUsersMap[m.user.id] = m.user;
  }

  const allUsers = Object.values(allUsersMap);
  return NextResponse.json(allUsers);
}
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const projectId = searchParams.get("boardId");
//   let users;
//   if (projectId) {
//     // hanya member di project itu
//     const memberships = await prisma.membership.findMany({
//       where: { projectId },
//       include: { user: true },
//     });
//     console.log(memberships, "memberships");
//     users = memberships.map((m) => m.user);
//     console.log(users, "users in project");
//   } else {
//     // semua user
//     users = await prisma.user.findMany({
//       select: { id: true, name: true, email: true },
//     });
//     console.log(users,"", "all users");
//   }
//   console.log(users,"", "all grails");
//   return NextResponse.json(users);
 
// }
