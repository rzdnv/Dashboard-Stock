// components/ui/NavUser.tsx
"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");

      if (res.status === 200) {
        router.push("/login");
        router.refresh(); // penting untuk clear state
      }
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            asChild
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <DropdownMenuTrigger asChild>
              <div className="flex w-full items-center gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src="https://avatar.iran.liara.run/public"
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.role}</span>
                </div>

                <ChevronsUpDown className="ml-auto size-4" />
              </div>
            </DropdownMenuTrigger>
          </SidebarMenuButton>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src="https://avatar.iran.liara.run/public"
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={handleLogout}
              className="cursor-pointer font-medium hover:text-red-500"
            >
              <LogOut className="text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
