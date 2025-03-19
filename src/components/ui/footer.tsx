"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { MoonIcon, SunIcon } from 'lucide-react'
import { CodeIcon, InstagramIcon, Send } from 'lucide-react'

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
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <Link href="/" className="flex items-center">
                            <CodeIcon className="h-6 w-6 mr-2" />
                            <span className="text-lg font-bold">OnePorted</span>
                        </Link>
                        <p className="mt-2 text-sm text-gray-500">Объединяем лучших разработчиков Казахстана</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="https://www.instagram.com/oneported" target="_blank" rel="noopener noreferrer">
                            <InstagramIcon className="h-6 w-6" />
                        </a>
                        <a href="https://t.me/oneported" target="_blank" rel="noopener noreferrer">
                            <Send className="h-6 w-6" />
                        </a>
                        <div className="flex items-center space-x-2">
                            <SunIcon className="h-4 w-4" />
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                            <MoonIcon className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}