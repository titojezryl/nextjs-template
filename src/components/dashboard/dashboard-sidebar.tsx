"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  userName: string;
  userEmail: string;
}

const navItems = [
  { href: "/users", label: "Users", match: (path: string) => path.startsWith("/users") },
  { href: "/audit", label: "Audit", match: (path: string) => path.startsWith("/audit") },
];

export const DashboardSidebar = ({
  userName,
  userEmail,
}: DashboardSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {navItems.map((item) => {
        const isActive = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "rounded-md px-3 py-2 font-mono text-sm transition-colors",
              isActive
                ? "bg-ink text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-tight text-ink"
        >
          Next.js Template
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="admin-sidebar"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </Button>
      </div>

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full min-h-screen w-64 flex-col border-r border-border bg-white px-4 py-5 transition-transform lg:static lg:min-h-screen lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <Link
          href="/"
          className="mb-8 hidden font-display text-lg font-semibold tracking-tight text-ink lg:block"
        >
          Next.js Template
        </Link>

        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          admin
        </p>

        {nav}

        <div className="mt-auto space-y-3 border-t border-border pt-4">
          <div>
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
};
