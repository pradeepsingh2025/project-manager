"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/app/providers";
import { useProject, useDeleteProject } from "@/lib/hooks/useProjects";
import { useProjectTasks, useUpdateTaskStatus, useDeleteTask, useAssignTask } from "@/lib/hooks/useTasks";
import { useProjectMembers } from "@/lib/hooks/useTeam";
import { KanbanBoard, KanbanBoardSkeleton } from "@/components/tasks/KanbanBoard";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  Trash2,
} from "lucide-react";
import type { TaskStatus } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuthContext();
  const isAdmin = user?.role === "ADMIN";

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
    error: projectErr,
    refetch: refetchProject,
  } = useProject(projectId);

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErr,
    refetch: refetchTasks,
  } = useProjectTasks(projectId);

  const { mutate: updateStatus, isPending: isStatusUpdating } =
    useUpdateTaskStatus(projectId);

  const { mutate: assignTask, isPending: isAssigning } =
    useAssignTask(projectId);

  const { mutate: deleteTask, isPending: isDeleting } =
    useDeleteTask(projectId);

  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const { data: members = [] } = useProjectMembers(projectId);

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateStatus({ taskId, status });
  };

  const handleAssign = (taskId: string, userId: string | null) => {
    assignTask({ taskId, assignedTo: userId });
  };

  const handleDeleteTask = (taskId: string) => {
    setDeletingTaskId(taskId);
    deleteTask(taskId, {
      onSettled: () => setDeletingTaskId(null),
    });
  };

  const handleDeleteProject = () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone."))
      return;
    deleteProject(projectId, {
      onSuccess: () => router.push("/projects"),
    });
  };

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-8">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.push("/projects")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>

      {/* Project Header */}
      {projectLoading && (
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-40" />
        </div>
      )}

      {projectError && (
        <ErrorState
          message={projectErr?.message || "Failed to load project details."}
          onRetry={() => refetchProject()}
        />
      )}

      {project && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {project.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Created{" "}
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                <CreateTaskDialog projectId={projectId} />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={handleDeleteProject}
                  disabled={isDeletingProject}
                >
                  {isDeletingProject ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-zinc-200 dark:border-zinc-800" />

      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Tasks
          </h2>
          {tasks && (
            <Badge variant="secondary" className="text-xs">
              {tasks.length} total
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
            onDelete={isAdmin ? handleDeleteTask : undefined}
            isUpdating={isStatusUpdating}
            isAssigning={isAssigning}
            deletingTaskId={deletingTaskId}
          />
        )}
      </div>
    </div>
  );
}
