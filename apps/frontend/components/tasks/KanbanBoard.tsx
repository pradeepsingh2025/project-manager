"use client";

import { TaskCard } from "./TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Circle, Clock, CheckCircle2 } from "lucide-react";
import type { Task, TaskStatus, ProjectMember } from "@/lib/types";

interface KanbanBoardProps {
  tasks: Task[];
  isAdmin: boolean;
  members?: ProjectMember[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAssign?: (taskId: string, userId: string | null) => void;
  onDelete?: (taskId: string) => void;
  isUpdating?: boolean;
  isAssigning?: boolean;
  deletingTaskId?: string | null;
}

const COLUMNS: {
  status: TaskStatus;
  label: string;
  icon: typeof Circle;
  color: string;
}[] = [
  {
    status: "PENDING",
    label: "Pending",
    icon: Circle,
    color: "text-zinc-500",
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    status: "COMPLETED",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
];

export function KanbanBoard({
  tasks,
  isAdmin,
  members = [],
  onStatusChange,
  onAssign,
  onDelete,
  isUpdating,
  isAssigning,
  deletingTaskId,
}: KanbanBoardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {COLUMNS.map((column) => {
        const Icon = column.icon;
        const columnTasks = tasks.filter((t) => t.status === column.status);

        return (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <Icon className={`h-4 w-4 ${column.color}`} />
              <h3 className="text-sm font-semibold text-foreground">
                {column.label}
              </h3>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed border-zinc-200 py-8 dark:border-zinc-800">
                  <p className="text-xs text-muted-foreground">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isAdmin={isAdmin}
                    members={members}
                    onStatusChange={onStatusChange}
                    onAssign={onAssign}
                    onDelete={onDelete}
                    isUpdating={isUpdating}
                    isAssigning={isAssigning}
                    isDeleting={deletingTaskId === task.id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, colIdx) => (
        <div key={colIdx} className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
