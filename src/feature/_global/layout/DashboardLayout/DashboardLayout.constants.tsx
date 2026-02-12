// components/ui/DashboardLayout.constants.ts
import { BarChart3, Package, ArrowLeftRight, Users } from "lucide-react"; // Import icon dari lucide-react

export const SIDEBAR_ADMIN = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    key: "barang",
    label: "Barang",
    href: "/admin/dashboard/barang",
    icon: <Package className="h-4 w-4" />,
  },
  {
    key: "transaksi",
    label: "Transaksi",
    href: "/admin/dashboard/transaksi",
    icon: <ArrowLeftRight className="h-4 w-4" />,
  },
  {
    key: "user",
    label: "User",
    href: "/admin/dashboard/users",
    icon: <Users className="h-4 w-4" />,
  },
];

export const SIDEBAR_OPERATOR = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/operator/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    key: "barang",
    label: "Barang",
    href: "/operator/dashboard/barang",
    icon: <Package className="h-4 w-4" />,
  },
  {
    key: "transaksi",
    label: "Transaksi",
    href: "/operator/dashboard/transaksi",
    icon: <ArrowLeftRight className="h-4 w-4" />,
  },
];
