"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface SiteHeaderNavProps {
  user: {
    name: string;
    role?: string | null;
  } | null;
}

const getFirstName = (name: string) => {
  const first = name.trim().split(/\s+/)[0];
  return first || "there";
};

export const SiteHeaderNav = ({ user }: SiteHeaderNavProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <nav className="flex items-center gap-2" aria-label="Primary">
        <Button asChild variant="ghost">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Get started</Link>
        </Button>
      </nav>
    );
  }

  const isAdmin = user.role === "admin";
  const firstName = getFirstName(user.name);

  if (isAdmin) {
    return (
      <nav className="flex items-center gap-2" aria-label="Primary">
        <Button asChild variant="ghost">
          <Link href="/users">Users</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/audit">Audit</Link>
        </Button>
        <Button asChild>
          <Link href="/users">Dashboard</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          aria-label="Sign out"
        >
          Log out
        </Button>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-3" aria-label="Primary">
      <p className="text-sm text-foreground">
        Hello, <span className="font-medium">{firstName}</span>
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        aria-label="Sign out"
      >
        Log out
      </Button>
    </nav>
  );
};
