// lib/api.ts
export async function getTasksByProject(projectId: string) {
  const res = await fetch(`/api/tasks/${projectId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}
