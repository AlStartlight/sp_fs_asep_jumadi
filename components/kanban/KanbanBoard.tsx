"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useDebounce } from '@uidotdev/usehooks';
import InviteMemberDialog from "./upBoard/InviteMemberDialog";

const columns = [
  { id: "todo", title: "To-Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function KanbanDashboard({
  session,
  children,
}: {
  session: any;
  children?: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogMail, setOpenDialogMail] = useState(false); // State untuk mengontrol dialog
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { boardId } = params as { id: string };
  const projectId = boardId; // Sesuaikan dengan nama parameter yang digunakan di route
  const [email, setEmail] = useState("");
  const [projectDetail, setProjectDetail] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const debouncedQuery = useDebounce(searchQuery, 300);
  useEffect(() => {
    async function fetchProjectDetail() {
      setLoading(true);
      try {
        const projectResponse = await fetch(`/api/projects/${boardId}`);
        const projectData = await projectResponse.json();
        setProjectDetail(projectData);

        // Ambil anggota tim
        const usersResponse = await fetch(`/api/users?boardId=${boardId}`);
        // const usersData = await usersResponse.json();
        const members = await usersResponse.json();
        setTeamMembers(members);
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetail();
  }, [boardId]);
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/${projectId}`);
      if (!response.ok)
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

   
  const handleCreateTask = async () => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          projectId,
          assigneeId,
        }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      toast.success("Task created");
      // refresh data and close modal
      await fetchTasks();
      setOpenDialog(false);
      setTitle("");
      setDescription("");
      setStatus("");
      setAssigneeId("");
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error(error.message || "Failed to create task");
    }
  };
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 1) if dropped outside any droppable, do nothing
    if (!destination) return;

    // 2) if dropped back into the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      // 3) optimistically update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggableId
            ? { ...task, status: destination.droppableId }
            : task
        )
      );

      // 4) persist the change on the server
      const res = await fetch(`/api/tasks/taskdragged/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destination.droppableId }),
      });
      if (!res.ok) {
        throw new Error(`Could not update status (${res.status})`);
      }

      // 5) (optional) re-fetch entire list to ensure consistency
      // const updated = await getTasksByProject(projectId);
      // setTasks(updated);
    } catch (err) {
      console.error("Failed to update task status:", err);
      // You might rollback optimistic update here if you like
    }
  };

  // const handleInvite = async () => {
  //   if (!selectedUser) return;
    
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`/api/projects/${boardId}/members`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: selectedUser.email }),
  //     });
      
  //     const data = await res.json();
  //     if (res.ok) {
  //       setOpenDialogMail(false);
  //       toast.success(`${selectedUser.name || selectedUser.email} added to project`);
  //       setSearchQuery('');
  //       setSelectedUser(null);
  //     } else {
  //       throw new Error(data.error || "Failed to invite");
  //     }
  //   } catch (err) {
  //     toast.error(err.message || "Failed to invite");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 flex">
      {/* Sidebar */}
      {children}

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col">
        {/* Welcome header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
          <p className="text-zinc-400">
            Manage your tasks efficiently with our Kanban board
          </p>
        </div>

        {/* Workspace header */}
        <div className="mb-4 flex items-center gap-2">
          <Avatar className="h-6 w-6 bg-green-500">
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <span className="font-medium">{projectDetail?.name}</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="ghost">
              Boards
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpenDialogMail(true)}
            >
              Members
            </Button>
            <Button size="sm" variant="ghost">
              Settings
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <Card
                    key={column.id}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[300px] bg-zinc-800 border-zinc-700"
                  >
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span className="text-white">{column.title}</span>
                        <span className="text-sm text-zinc-400 bg-zinc-700 rounded-full px-2 py-1">
                          {
                            tasks.filter((task) => task.status === column.id)
                              .length
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
                            .map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 cursor-pointer transition-all border border-transparent hover:border-zinc-600"
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 cursor-pointer transition-all border border-transparent hover:border-zinc-600"
                                  >
                                    <h3 className="font-bold text-white mb-1">
                                      {task.title}
                                    </h3>
                                    <p className="text-sm text-zinc-300 mb-2 line-clamp-2">
                                      {task.description}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                      <div className="text-xs text-zinc-400">
                                        {task.dueDate
                                          ? new Date(
                                              task.dueDate
                                            ).toLocaleDateString()
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
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                          {/* PERBAIKAN: Dialog dipindahkan di sini */}
                          <Dialog
                            open={openDialog}
                            onOpenChange={setOpenDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full mt-2 text-zinc-400 hover:text-zinc-100 hover:bg-slate-950"
                                onClick={() => {
                                  // Set status default ke kolom saat ini
                                  setStatus(column.id);
                                }}
                              >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add task
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="dark:bg-zinc-800 bg-white max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-xl">
                                  Create New Task
                                </DialogTitle>
                              </DialogHeader>

                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="title" className="text-right">
                                    Title
                                  </Label>
                                  <Input
                                    id="title"
                                    placeholder="Task title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="col-span-3 dark:text-white text-black"
                                  />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="description"
                                    className="text-right"
                                  >
                                    Description
                                  </Label>
                                  <Input
                                    id="description"
                                    placeholder="Task description"
                                    value={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    className="col-span-3 dark:text-white text-black"
                                  />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="status"
                                    className="text-right"
                                  >
                                    Status
                                  </Label>
                                  <Select
                                    value={status}
                                    onValueChange={setStatus}
                                  >
                                    <SelectTrigger className="col-span-3 dark:text-white text-black">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {columns.map((col) => (
                                        <SelectItem key={col.id} value={col.id}>
                                          {col.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="assignee"
                                    className="text-right"
                                  >
                                    Assign to
                                  </Label>
                                  <Select
                                    value={assigneeId}
                                    onValueChange={setAssigneeId}
                                  >
                                    <SelectTrigger className="col-span-3 dark:text-white text-black">
                                      <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teamMembers.map((member) => (
                                        <SelectItem
                                          key={member.id}
                                          value={member.id}
                                        >
                                          {member.name} ({member.email})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setOpenDialog(false)}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleCreateTask}>
                                  Create Task
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                         <InviteMemberDialog boardId={boardId} open={openDialogMail} setOpen={setOpenDialogMail}/>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
        {/* ... (kode lainnya) ... */}
      </main>

      {/* Profile Simple */}
      <div className="absolute top-4 right-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 bg-zinc-700 cursor-pointer hover:bg-zinc-600 transition-colors">
              <AvatarFallback className="text-white font-medium">
                {session?.user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-zinc-200">
            <DropdownMenuLabel className="flex items-center gap-3">
              <div className="bg-zinc-700 rounded-full p-2">
                <User size={16} />
              </div>
              <div>
                <p className="font-medium text-white">{session?.user?.name}</p>
                <p className="text-xs text-zinc-400">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-zinc-700" />

            <DropdownMenuItem className="flex items-center gap-3 hover:bg-zinc-700 cursor-pointer focus:bg-zinc-700">
              <User size={16} className="text-zinc-400" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 hover:bg-zinc-700 cursor-pointer focus:bg-zinc-700">
              <Settings size={16} className="text-zinc-400" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 hover:bg-zinc-700 cursor-pointer focus:bg-zinc-700">
              <HelpCircle size={16} className="text-zinc-400" />
              <span>Help & Support</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-700" />

            <DropdownMenuItem
              className="flex items-center gap-3 hover:bg-red-500/10 cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
