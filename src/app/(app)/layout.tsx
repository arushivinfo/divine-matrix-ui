import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-8">{children}</main>
    </div>
  );
}
