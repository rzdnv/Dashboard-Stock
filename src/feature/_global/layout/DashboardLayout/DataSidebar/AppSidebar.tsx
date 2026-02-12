// components/ui/AppSidebar.tsx
"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import TeamSwitcher from "./TeamSwitcher";
import { NavUser } from "./NavUser";
import { NavMain } from "./NavMain";

import { SIDEBAR_ADMIN, SIDEBAR_OPERATOR } from "../DashboardLayout.constants";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  type: "Admin" | "Operator"; // Sesuaikan type
}

const AppSidebar = ({ type, ...props }: AppSidebarProps) => {
  const sidebarItems = type === "Admin" ? SIDEBAR_ADMIN : SIDEBAR_OPERATOR;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher type={type} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain sidebarItems={sidebarItems} />
      </SidebarContent>

      <SidebarFooter className="overflow-visible">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
