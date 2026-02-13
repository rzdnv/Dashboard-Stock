import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/feature/_global/layout/DashboardLayout";

export default function OperatorBarangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayout title="Barang" type="Operator">
        {children}
      </DashboardLayout>
    </SidebarProvider>
  );
}
