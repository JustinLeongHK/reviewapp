"use client";

import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface MenubarProps {
  className?: string;
}

export default function Menubar({ className }: MenubarProps) {
  const pathname = usePathname();

  return (
    <div className={className}>
      <Button
        variant={pathname === "/" ? "default" : "ghost"}
        className="flex items-center justify-start gap-3 hover:bg-primary hover:text-white"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant={pathname === "/notifications" ? "default" : "ghost"}
        className="flex items-center justify-start gap-3 hover:bg-primary hover:text-white"
        title="Notification"
        asChild
      >
        <Link href="/notifications">
          <Bell />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-primary hover:text-white"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <Mail />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 hover:bg-primary hover:text-white"
        title="Home"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
