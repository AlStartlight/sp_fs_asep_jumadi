"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTasksByProject } from "@/lib/api";
import { Task } from "@/lib/types";
import { PlusIcon } from "lucide-react";

const columns = [
  { id: "pending", title: "Pending" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function KanbanDashboard({ session,children }: { session: any, children?: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const data = await getTasksByProject(session?.ownedProjects?.id);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 flex">
      {/* Sidebar */}
      {children}
      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col">
        {/* Welcome header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome, {session?.user?.email}</h1>
          <p className="text-zinc-400">
            Manage your tasks efficiently with our Kanban board
          </p>
        </div>

        {/* Workspace header */}
        <div className="mb-4 flex items-center gap-2">
          <Avatar className="h-6 w-6 bg-green-500">
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <span className="font-medium">Born in Septembers</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="ghost">
              Boards
            </Button>
            <Button size="sm" variant="ghost">
              Members
            </Button>
            <Button size="sm" variant="ghost">
              Settings
            </Button>
            <Button size="sm" variant="secondary">
              Upgrade
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Card
              key={column.id}
              className="min-w-[300px] bg-zinc-800 border-zinc-700"
            >
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{column.title}</span>
                  <span className="text-sm text-zinc-400 bg-zinc-700 rounded-full px-2 py-1">
                    {
                      tasks.filter((task) => task.status === column.id).length
                    }
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-3 min-h-[400px]">
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-zinc-700/50 rounded p-3 animate-pulse"
                      >
                        <div className="h-5 bg-zinc-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-zinc-600 rounded w-full"></div>
                        <div className="h-3 bg-zinc-600 rounded w-2/3 mt-1"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="bg-zinc-700/50 hover:bg-zinc-700 rounded-lg p-3 cursor-pointer transition-all border border-transparent hover:border-zinc-600"
                        >
                          <h3 className="font-bold mb-1">{task.title}</h3>
                          <p className="text-sm text-zinc-300 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-zinc-400">
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "No due date"}
                            </div>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {task.assignedTo?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                    <Button
                      variant="ghost"
                      className="w-full mt-2 text-zinc-400 hover:text-zinc-100"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add task
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Profile Simple */}
      <div className="absolute top-4 right-6">
        <Avatar className="h-8 w-8 bg-zinc-700">
          <AvatarFallback>
            {session?.user?.email?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}