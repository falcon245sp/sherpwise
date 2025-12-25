"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasRole } from "@/lib/auth/hooks";
import { UserRole } from "@/lib/auth/types";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const canManageUsers = useHasRole([UserRole.DistrictAdmin, UserRole.SiteAdmin]);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Standards",
      href: "/standards",
      icon: BookOpen,
    },
    {
      name: "Classify",
      href: "/classify",
      icon: FileText,
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      requirePermission: canManageUsers,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => item.requirePermission === undefined || item.requirePermission
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r bg-white transition-transform md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 md:hidden border-b">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              O
            </div>
            <span>Ontara</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
