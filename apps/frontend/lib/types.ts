// ─── Enums ────────────────────────────────────────────────────────────────────
export type Role = "USER" | "ADMIN";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// ─── Entities ─────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  projectId: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  projectId: string;
  joinedAt: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface AdminDashboardStats {
  totalProjects: number;
  totalTasks: number;
  completionRate: number;
}

export interface UserDashboardStats {
  totalAssignedProjects: number;
  totalAssignedTasks: number;
  completionRate: number;
}

export type DashboardStats = AdminDashboardStats | UserDashboardStats;

// ─── Type Guards ──────────────────────────────────────────────────────────────
export function isAdminStats(stats: DashboardStats): stats is AdminDashboardStats {
  return "totalProjects" in stats;
}
