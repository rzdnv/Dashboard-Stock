import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/feature/_global/layout/DashboardLayout";

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayout title="Users" type="Admin">
        {children}
      </DashboardLayout>
    </SidebarProvider>
  );
}
