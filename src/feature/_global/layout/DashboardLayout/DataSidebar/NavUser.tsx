"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; // Ganti signOut ke useRouter
import { useEffect, useState } from "react"; // Tambah useState dan useEffect

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

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Default jika tidak ada data
  const name = user?.name || "User";
  const role = user?.role || "Unknown";

  const handleLogout = () => {
    // Hapus token dan user dari localStorage
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    // Redirect ke login
    router.push("/login");
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
                    alt={name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">{role}</span>
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
                    alt={name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">{role}</span>
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
