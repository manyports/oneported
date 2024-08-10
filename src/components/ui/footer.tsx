"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { MoonIcon, SunIcon } from 'lucide-react'

export default function Footer(){
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
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 ineedavolunteer. Все права защищены.</p>
        <nav className="sm:ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Условия использования
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Политика конфиденциальности
          </Link>
          <div className="flex items-center space-x-2">
            <SunIcon className="h-4 w-4" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              aria-label="Переключить тему"
            />
            <MoonIcon className="h-4 w-4" />
          </div>
        </nav>
      </footer>
    );
}