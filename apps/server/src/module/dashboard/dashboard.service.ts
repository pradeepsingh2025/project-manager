import { prisma } from "@repo/db";

export async function getDashboardStats(userId: string, role: string) {
  if (role === "ADMIN") {
    const totalProjects = await prisma.project.count();
    const totalTasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({
      where: { status: "COMPLETED" },
    });

    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
      totalProjects,
      totalTasks,
      completionRate,
    };
  } else {
    const userProjectsCount = await prisma.teamMember.count({
      where: { userId },
    });

    const totalAssignedTasks = await prisma.task.count({
      where: { assignedTo: userId },
    });

    const completedAssignedTasks = await prisma.task.count({
      where: { assignedTo: userId, status: "COMPLETED" },
    });

    const completionRate =
      totalAssignedTasks === 0
        ? 0
        : Math.round((completedAssignedTasks / totalAssignedTasks) * 100);

    return {
      totalAssignedProjects: userProjectsCount,
      totalAssignedTasks,
      completionRate,
    };
  }
}
