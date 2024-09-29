"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen as BookOpenIcon,
  Calendar as CalendarIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Главная", icon: HomeIcon, href: "/" },
    { name: "Обучение", icon: BookOpenIcon, href: "/learn" },
    { name: "События", icon: CalendarIcon, href: "/events" },
    { name: "Вступить в клуб", icon: FolderIcon, href: "/join" },
  ];

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <CodeIcon className="h-6 w-6" />
        <span className="ml-2 text-lg font-bold">OnePorted</span>
      </Link>
      <div className="ml-auto flex items-center">
        <nav className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              className="text-sm font-semibold hover:underline underline-offset-4"
              href={item.href}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 pt-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  className="flex items-center p-2 text-lg font-semibold rounded-lg hover:bg-accent"
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
