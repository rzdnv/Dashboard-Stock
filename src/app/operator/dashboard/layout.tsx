import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/feature/_global/layout/DashboardLayout";

export default function OperatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayout title="Dashboard" type="Operator">
        {children}
      </DashboardLayout>
    </SidebarProvider>
  );
}
