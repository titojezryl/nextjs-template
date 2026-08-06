import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { requireAdmin } from "@/lib/require-admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar
        userName={session.user.name}
        userEmail={session.user.email}
      />
      <main className="min-h-screen min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
