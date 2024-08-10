"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { HandIcon, MenuIcon } from 'lucide-react'

  
export default function Header(){
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    if (!mounted) {
        return null
    }
  
    return(
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
            <Link className="flex items-center justify-center" href="/">
              <HandIcon className="h-6 w-6" />
              <span className="ml-2 text-lg font-bold">ineedavolunteer</span>
            </Link>
            <div className="ml-auto flex items-center">
              <nav className="hidden md:flex gap-6">
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
                  О нас
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/search">
                  Поиск
                </Link>
              </nav>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/" onClick={() => setIsOpen(false)}>
                      О нас
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/search" onClick={() => setIsOpen(false)}>
                      Поиск
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </header>
    )
}