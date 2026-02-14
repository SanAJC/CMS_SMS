import AppSidebar from "./AppSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-[72px] min-h-screen p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
