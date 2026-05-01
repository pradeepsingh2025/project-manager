import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as projectsService from "./projects.service.js";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

const addMemberSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional(),
  dueDate: z.string().datetime().optional(), // Expected ISO string
});

export async function createProjectHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const { name, description } = parsed.data;
    const project = await projectsService.createProject(name, description);
    return res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProjectHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const { name, description } = parsed.data;
    const project = await projectsService.updateProject(req.params.id as string, name, description);
    return res.status(200).json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProjectHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await projectsService.deleteProject(req.params.id as string);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function addMemberHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = addMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const { userId } = parsed.data;
    const teamMember = await projectsService.addTeamMember(req.params.id as string, userId);
    return res.status(201).json(teamMember);
  } catch (err) {
    next(err);
  }
}

export async function removeMemberHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, userId } = req.params;
    await projectsService.removeTeamMember(id as string, userId as string);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function createProjectTaskHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    const { title, description, assignedTo, dueDate } = parsed.data;
    const parsedDate = dueDate ? new Date(dueDate) : undefined;
    
    const task = await projectsService.createProjectTask(
      req.params.id as string,
      title,
      description,
      assignedTo,
      parsedDate
    );
    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function getProjectsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await projectsService.getProjects(req.user!.id, req.user!.role);
    return res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProjectByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.getProjectById(req.params.id as string, req.user!.id, req.user!.role);
    return res.status(200).json(project);
  } catch (err) {
    next(err);
  }
}

export async function getProjectTasksHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await projectsService.getProjectTasks(req.params.id as string, req.user!.id, req.user!.role);
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getProjectMembersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const members = await projectsService.getProjectMembers(req.params.id as string, req.user!.id, req.user!.role);
    return res.status(200).json(members);
  } catch (err) {
    next(err);
  }
}
