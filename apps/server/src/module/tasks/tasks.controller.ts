import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { updateTask, deleteTask, updateTaskStatus } from "./tasks.service.js";

const updateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional(),
  dueDate: z.string().datetime().optional(), // Expected ISO string
});

const updateTaskStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

export async function updateTaskHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const { title, description, status, assignedTo, dueDate } = parsed.data;
    const parsedDate = dueDate ? new Date(dueDate) : undefined;

    const task = await updateTask(
      req.params.id as string,
      title,
      description,
      status,
      assignedTo,
      parsedDate
    );
    return res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTaskHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteTask(req.params.id as string);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateTaskStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateTaskStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const { status } = parsed.data;
    
    const task = await updateTaskStatus(
      req.params.id as string,
      status,
      req.user!.id,
      req.user!.role
    );
    return res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}
