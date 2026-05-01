"use client";

import { useAuthContext } from "@/app/providers";
import { useProjects } from "@/lib/hooks/useProjects";
import { useProjectTasks, useUpdateTaskStatus, useAssignTask } from "@/lib/hooks/useTasks";
import { useProjectMembers } from "@/lib/hooks/useTeam";
import { KanbanBoard, KanbanBoardSkeleton } from "@/components/tasks/KanbanBoard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { TaskStatus } from "@/lib/types";

export default function TasksPage() {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "ADMIN";
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectsErr,
    refetch: refetchProjects,
  } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Pick the first project as default once loaded
  const activeProjectId = selectedProjectId || projects?.[0]?.id || "";

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErr,
    refetch: refetchTasks,
  } = useProjectTasks(activeProjectId);

  const { mutate: updateStatus, isPending: isStatusUpdating } =
    useUpdateTaskStatus(activeProjectId);

  const { data: members = [] } = useProjectMembers(activeProjectId);
  const { mutate: assignTask, isPending: isAssigning } = useAssignTask(activeProjectId);

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateStatus({ taskId, status });
  };

  const handleAssign = (taskId: string, userId: string | null) => {
    assignTask({ taskId, assignedTo: userId });
  };

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage tasks across your projects.
          </p>
        </div>

        {/* Project selector */}
        {projectsLoading && <Skeleton className="h-9 w-48" />}
        {projects && projects.length > 0 && (
          <Select
            value={activeProjectId}
            onValueChange={(val) => { if (val) setSelectedProjectId(val); }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Error states */}
      {projectsError && (
        <ErrorState
          message={projectsErr?.message || "Failed to load projects."}
          onRetry={() => refetchProjects()}
        />
      )}

      {/* Empty */}
      {projects && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
          <p className="text-sm text-muted-foreground">
            No projects found. Tasks are organized within projects.
          </p>
        </div>
      )}

      {/* Tasks board */}
      {activeProjectId && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground">
              {projects?.find((p) => p.id === activeProjectId)?.name}
            </h2>
            {tasks && (
              <Badge variant="secondary" className="text-xs">
                {tasks.length} tasks
              </Badge>
            )}
          </div>

          {tasksLoading && <KanbanBoardSkeleton />}

          {tasksError && (
            <ErrorState
              message={tasksErr?.message || "Failed to load tasks."}
              onRetry={() => refetchTasks()}
            />
          )}

          {tasks && (
            <KanbanBoard
              tasks={tasks}
              isAdmin={isAdmin}
              members={members}
              onStatusChange={handleStatusChange}
              onAssign={isAdmin ? handleAssign : undefined}
              isUpdating={isStatusUpdating}
              isAssigning={isAssigning}
            />
          )}
        </div>
      )}
    </div>
  );
}
