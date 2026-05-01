"use client";

import { useAuthContext } from "@/app/providers";
import { useDashboardStats } from "@/lib/hooks/useDashboard";
import { isAdminStats } from "@/lib/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/dashboard/StatCardSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  ListChecks,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <Badge variant="secondary" className="text-xs font-medium">
            {user?.role}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Here&apos;s an overview of your workspace.
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          message={error?.message || "Failed to load dashboard stats."}
          onRetry={() => refetch()}
        />
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isAdminStats(stats) ? (
            <>
              <StatCard
                label="Total Projects"
                value={stats.totalProjects}
                icon={FolderKanban}
                description="Across your workspace"
              />
              <StatCard
                label="Total Tasks"
                value={stats.totalTasks}
                icon={ListChecks}
                description="All tasks created"
              />
              <StatCard
                label="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={TrendingUp}
                description="Tasks completed"
              />
            </>
          ) : (
            <>
              <StatCard
                label="Assigned Projects"
                value={stats.totalAssignedProjects}
                icon={FolderKanban}
                description="Projects you belong to"
              />
              <StatCard
                label="Assigned Tasks"
                value={stats.totalAssignedTasks}
                icon={ListChecks}
                description="Tasks assigned to you"
              />
              <StatCard
                label="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={TrendingUp}
                description="Your task completion"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
