"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/app/providers";
import { useLogout } from "@/lib/hooks/useAuth";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-50">
          <FolderKanban className="h-5 w-5 text-white dark:text-zinc-900" />
        </div>
        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          ProjectFlow
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <UserIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {user.name}
            </span>
            <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.role}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          onClick={() => logout()}
          disabled={isPending}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
