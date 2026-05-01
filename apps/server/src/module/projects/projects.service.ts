import { prisma } from "@repo/db";

export async function createProject(name: string, description?: string) {
  return prisma.project.create({
    data: { 
      name, 
      ...(description !== undefined && { description }) 
    },
  });
}

export async function updateProject(id: string, name: string, description?: string) {
  return prisma.project.update({
    where: { id },
    data: { 
      name, 
      ...(description !== undefined && { description }) 
    },
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}

export async function addTeamMember(projectId: string, userId: string) {
  return prisma.teamMember.create({
    data: {
      projectId,
      userId,
    },
  });
}

export async function removeTeamMember(projectId: string, userId: string) {
  return prisma.teamMember.delete({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
}

export async function createProjectTask(
  projectId: string,
  title: string,
  description?: string,
  assignedTo?: string,
  dueDate?: Date
) {
  return prisma.task.create({
    data: {
      projectId,
      title,
      ...(description !== undefined && { description }),
      ...(assignedTo !== undefined && { assignedTo }),
      ...(dueDate !== undefined && { dueDate }),
    },
  });
}

export async function getProjects(userId: string, role: string) {
  if (role === "ADMIN") {
    return prisma.project.findMany();
  }
  return prisma.project.findMany({
    where: {
      teamMembers: {
        some: { userId },
      },
    },
  });
}

export async function getProjectById(projectId: string, userId: string, role: string) {
  if (role === "ADMIN") {
    return prisma.project.findUnique({ where: { id: projectId } });
  }
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      teamMembers: {
        some: { userId },
      },
    },
  });
  if (!project) throw Object.assign(new Error("Project not found or forbidden"), { status: 403 });
  return project;
}

export async function getProjectTasks(projectId: string, userId: string, role: string) {
  if (role === "ADMIN") {
    return prisma.task.findMany({ where: { projectId } });
  }
  const projectAccess = await prisma.project.findFirst({
    where: {
      id: projectId,
      teamMembers: { some: { userId } },
    },
  });
  if (!projectAccess) throw Object.assign(new Error("Project not found or forbidden"), { status: 403 });
  
  return prisma.task.findMany({ where: { projectId } });
}
