"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { HandIcon, SearchIcon, UserIcon, BuildingIcon, HandshakeIcon, MenuIcon, MoonIcon, SunIcon } from 'lucide-react'

export default function Component() {
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <HandIcon className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">ineedavolunteer</span>
        </Link>
        <div className="ml-auto flex items-center">
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              О нас
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Как это работает
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Контакты
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
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="#" onClick={() => setIsOpen(false)}>
                  О нас
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="#" onClick={() => setIsOpen(false)}>
                  Как это работает
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="#" onClick={() => setIsOpen(false)}>
                  Контакты
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
            <h1 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text text-[#8DE469]"
            >
              Соединяем волонтеров и организации
            </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Платформа, где энтузиасты находят возможности, а организации - надежных помощников.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input className="max-w-lg flex-1" placeholder="Поиск возможностей или волонтеров..." type="text" />
                <Button type="submit" className="w-full sm:w-auto">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Поиск
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-[#131313]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#8DE469]">Как это работает</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mx-auto">
                  Наша платформа упрощает процесс поиска волонтеров и волонтерских возможностей.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3 items-start lg:grid-cols-3">
              {[
                { title: "Для волонтеров", icon: UserIcon, description: "Создайте профиль, укажите свои навыки и интересы, и находите подходящие возможности для волонтерства." },
                { title: "Для организаций", icon: BuildingIcon, description: "Размещайте объявления о волонтерских вакансиях и находите энтузиастов, готовых помочь вашему делу." },
                { title: "Соединяем", icon: HandshakeIcon, description: "Наш алгоритм подбирает идеальные совпадения между волонтерами и организациями." },
              ].map((item, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className='text-[#8DE469]'>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center justify-between">
                    <item.icon className="h-12 w-12 mb-4 text-[#8DE469]" />
                    <CardDescription className="text-center">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#8DE469]">Присоединяйтесь сегодня</h2>
                <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Станьте частью нашего сообщества и начните менять мир к лучшему.
                </p>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2">
                <Input placeholder="Ваш email" type="email" />
                <Button type="submit" className="w-full">Зарегистрироваться</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>
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
    </div>
  )
}