"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface PropTypes {
  type: "Admin" | "Operator";
}

const TeamSwitcher = (props: PropTypes) => {
  const { type } = props;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="ml-2 grid flex-1 gap-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Dashboard Stok</span>
            <span className="truncate text-xs">{type}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default TeamSwitcher;
