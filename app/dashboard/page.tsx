
import '@/app/globals.css'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import KanbanProject from '@/components/kanban/KanbanProject';
import Sidebar from '@/components/kanban/Sidebar';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect di server, lebih aman
    return (
      <div className="p-4 text-center">
        <p>Redirecting to login...</p>
        <script dangerouslySetInnerHTML={{
          __html: `window.location.href = "/login"`,
        }} />
      </div>
    );
  }

  return (
    <KanbanProject session={session}>
      <Sidebar />
    </KanbanProject>
  );
}
