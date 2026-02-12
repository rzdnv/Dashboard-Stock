"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

interface SidebarItem {
  key: string;
  label: string;
  href: string;
  icon: JSX.Element;
}

interface PropTypes {
  sidebarItems: SidebarItem[];
}

export function NavMain({ sidebarItems }: PropTypes) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className={`h-10 justify-start rounded-xl px-4 ${
                    isActive
                      ? "bg-blue-400 hover:bg-cerise-red-700 text-white hover:text-white"
                      : "hover:bg-muted text-slate-800"
                  } `}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
