// types.ts

export interface User {
  id: string;
  email: string;
  name?: string | null;
  password: string;
  ownedProjects: Project[];
  assignedTasks: Task[];
  memberships: Membership[];
}
export interface Suggestion {
  id: string;
  name: string;
  email: string;
}
export interface Project {
  id: string;
  name: string;
  ownerId: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  members: Membership[];
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  projectId: string;
  project: Project;
  assignedToId?: string | null;
  assignedTo?: User | null;
  status: string; // could be: "pending", "in_progress", "done" etc.
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  user: User;
  projectId: string;
  project: Project;
  role: string; // could be "owner", "member", "admin", etc.
  createdAt: Date;
  updatedAt: Date;
}
