import { AuthGuard } from "~/components/AuthGuard";
import { Sidebar } from "~/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="admin">
      <div className="flex h-screen w-full">
        <Sidebar role="admin" />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </AuthGuard>
  );
}
