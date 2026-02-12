"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./DataSidebar/AppSidebar";

interface DashboardLayoutProps {
  title: string;
  type: "Admin" | "Operator";
  children: React.ReactNode;
}

const DashboardLayout = ({ title, type, children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar type={type} />
        <main className="flex-1 p-2 h-full overflow-auto">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
