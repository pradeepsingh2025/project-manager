import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import type { ProjectMember, TeamMember } from "@/lib/types";

export function useProjectMembers(projectId: string) {
  return useQuery<ProjectMember[]>({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => apiFetch<ProjectMember[]>(`/api/projects/${projectId}/members`),
    enabled: !!projectId,
  });
}


export function useAddTeamMember(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch<TeamMember>(`/api/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}

export function useRemoveTeamMember(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/api/projects/${projectId}/members/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}
