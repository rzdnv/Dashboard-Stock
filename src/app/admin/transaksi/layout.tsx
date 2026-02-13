import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardLayout from "@/feature/_global/layout/DashboardLayout";

export default function AdminBarangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayout title="Transaksi" type="Admin">
        {children}
      </DashboardLayout>
    </SidebarProvider>
  );
}
