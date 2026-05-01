"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Loader2, UserMinus } from "lucide-react";
import { useProjectMembers, useAddTeamMember, useRemoveTeamMember } from "@/lib/hooks/useTeam";
import { useAllUsers } from "@/lib/hooks/useUsers";

interface ManageTeamDialogProps {
  projectId: string;
}

export function ManageTeamDialog({ projectId }: ManageTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: members = [], isLoading: loadingMembers } = useProjectMembers(projectId);
  const { data: allUsers = [], isLoading: loadingUsers } = useAllUsers();
  
  const { mutate: addMember, isPending: isAdding } = useAddTeamMember(projectId);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveTeamMember(projectId);

  const [removingId, setRemovingId] = useState<string | null>(null);

  // Filter out users who are already members
  const availableUsers = allUsers.filter(
    (user) => !members.some((m) => m.userId === user.id)
  );

  const handleAddMember = () => {
    if (!selectedUserId) return;
    addMember(selectedUserId, {
      onSuccess: () => {
        setSelectedUserId("");
      },
    });
  };

  const handleRemoveMember = (userId: string) => {
    setRemovingId(userId);
    removeMember(userId, {
      onSettled: () => setRemovingId(null),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Manage Team
        </Button>
      } />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Team</DialogTitle>
          <DialogDescription>
            Add or remove members from this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add Member Section */}
          <div className="space-y-3">
            <Label>Add New Member</Label>
            <div className="flex gap-2">
              <Select
                value={selectedUserId}
                onValueChange={(val) => { if (val != null) setSelectedUserId(val as string); }}
                disabled={loadingUsers || availableUsers.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue 
                    placeholder={
                      loadingUsers 
                        ? "Loading users..." 
                        : availableUsers.length === 0 
                        ? "No users available" 
                        : "Select user..."
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAddMember} 
                disabled={!selectedUserId || isAdding}
              >
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </div>
          </div>

          {/* Current Members List */}
          <div className="space-y-3">
            <Label>Current Members ({members.length})</Label>
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
              {loadingMembers ? (
                <div className="p-4 text-center text-sm text-muted-foreground flex justify-center items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading members...
                </div>
              ) : members.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No members assigned to this project yet.
                </div>
              ) : (
                members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveMember(member.userId)}
                      disabled={isRemoving && removingId === member.userId}
                    >
                      {isRemoving && removingId === member.userId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserMinus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
