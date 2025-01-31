"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen as BookOpenIcon,
  Calendar as CalendarIcon,
  Code as CodeIcon,
  ContainerIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Instagram,
  Github,
} from "lucide-react";
import Link from "next/link";
import { Container } from "postcss";
import { useState } from "react";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);

  const leftMenuItems = [
    { name: "Главная", icon: HomeIcon, href: "/" },
    { name: "Обучение", icon: BookOpenIcon, href: "/learn" },
    { name: "События", icon: CalendarIcon, href: "/hackathon" },
  ];

  const rightMenuItems = [
    { name: "Утилиты", icon: ContainerIcon, href: "/tools" },
    { name: "Вступить в клуб", icon: FolderIcon, href: "/join" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-20 px-4">
        <div className="hidden md:flex items-center space-x-4">
          {leftMenuItems.map((item) => (
            <Button
              key={item.name}
              variant="outline"
              size="sm"
              className="text-sm rounded-full text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
        <span className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2 text-foreground">OnePorted</span>
        <div className="hidden md:flex items-center space-x-4">
          {rightMenuItems.map((item) => (
            <Button
              key={item.name}
              variant="outline"
              size="sm"
              className="text-sm rounded-full text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden rounded-full text-muted-foreground hover:text-foreground"
            >
              <MenuIcon className="h-4 w-4" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border">
            <nav className="flex flex-col gap-4 pt-6">
              {[...leftMenuItems, ...rightMenuItems].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
              
              <div className="mt-8 flex items-center gap-4 px-2">
                <Link 
                  href="https://instagram.com/oneported" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link 
                  href="https://github.com/manyports" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
