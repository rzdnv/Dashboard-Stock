// app/admin/dashboard/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/feature/_global/layout/DashboardLayout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayout title="Dashboard" type="Admin">
        {children}
      </DashboardLayout>
    </SidebarProvider>
  );
}
