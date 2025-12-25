"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex items-center gap-2 font-semibold">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              O
            </div>
            <span className="hidden md:inline-block">Ontara</span>
          </Link>
        </div>

        <nav className="ml-8 hidden md:flex gap-6">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/dashboard")
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/standards"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/standards")
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            Standards
          </Link>
          <Link
            href="/classify"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/classify")
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            Classify
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
