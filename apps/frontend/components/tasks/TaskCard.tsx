"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Loader2, UserCircle2 } from "lucide-react";
import type { Task, TaskStatus, ProjectMember } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  isAdmin: boolean;
  members?: ProjectMember[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAssign?: (taskId: string, userId: string | null) => void;
  onDelete?: (taskId: string) => void;
  isUpdating?: boolean;
  isAssigning?: boolean;
  isDeleting?: boolean;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  PENDING: { label: "Pending", variant: "outline" },
  IN_PROGRESS: { label: "In Progress", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "default" },
};

export function TaskCard({
  task,
  isAdmin,
  members = [],
  onStatusChange,
  onAssign,
  onDelete,
  isUpdating,
  isAssigning,
  isDeleting,
}: TaskCardProps) {
  const statusInfo = STATUS_CONFIG[task.status];

  // Find assigned member's name for display
  const assignedMember = members.find((m) => m.userId === task.assignedTo);
  const assignedName = assignedMember?.user.name ?? null;

  return (
    <Card className="group transition-all duration-150 hover:shadow-sm">
      <CardContent className="pt-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-sm font-medium text-foreground">
                {task.title}
              </h4>
              <Badge variant={statusInfo.variant} className="shrink-0 text-[10px] px-1.5 py-0">
                {statusInfo.label}
              </Badge>
            </div>

            {task.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {/* Assignee display */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <UserCircle2 className="h-3 w-3" />
                <span>{assignedName ?? "Unassigned"}</span>
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isAdmin && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>

        <div className="mt-3 space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {/* Status select */}
          <Select
            value={task.status}
            onValueChange={(value) => {
              if (value) onStatusChange(task.id, value as TaskStatus);
            }}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-7 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Assignee select — admin only, only shown if members exist */}
          {isAdmin && onAssign && members.length > 0 && (
            <Select
              value={task.assignedTo ?? "unassigned"}
              onValueChange={(val) => {
                if (val !== undefined) {
                  onAssign(task.id, val === "unassigned" ? null : val);
                }
              }}
              disabled={isAssigning}
            >
              <SelectTrigger className="h-7 w-full text-xs">
                <SelectValue placeholder="Assign to…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
