"use client";

import { useAuthContext } from "@/app/providers";
import { useProjects } from "@/lib/hooks/useProjects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCardSkeleton } from "@/components/projects/ProjectCardSkeleton";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const { user } = useAuthContext();
  const { data: projects, isLoading, isError, error, refetch } = useProjects();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Manage all projects in your workspace."
              : "Projects you are a member of."}
          </p>
        </div>
        {isAdmin && <CreateProjectDialog />}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <ErrorState
          message={error?.message || "Failed to load projects."}
          onRetry={() => refetch()}
        />
      )}

      {/* Empty */}
      {projects && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <FolderKanban className="h-7 w-7 text-zinc-400" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              No projects yet
            </h3>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Create your first project to get started."
                : "You haven't been added to any projects yet."}
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      {projects && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
