import { prisma, type TaskStatus } from "@repo/db";

export async function updateTask(
  id: string,
  title?: string,
  description?: string,
  status?: TaskStatus,
  assignedTo?: string,
  dueDate?: Date
) {
  // Undefined values won't be updated by Prisma
  return prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(assignedTo !== undefined && { assignedTo }),
      ...(dueDate !== undefined && { dueDate }),
    },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  userId: string,
  role: string
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw Object.assign(new Error("Task not found"), { status: 404 });
  }

  // Only ADMINs or the specifically assigned user can change task status
  if (role !== "ADMIN" && task.assignedTo !== userId) {
    throw Object.assign(new Error("Forbidden: You are not assigned to this task"), { status: 403 });
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
}
