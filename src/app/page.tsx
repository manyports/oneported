"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CodeIcon, GlobeIcon, RocketIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ReactTypingEffect from "react-typing-effect";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  OnePorted:{" "}
                  <ReactTypingEffect
                    text={["Код", "Сообщество", "Инновации", "Будущее"]}
                    speed={100}
                    eraseSpeed={50}
                    typingDelay={1000}
                    eraseDelay={2000}
                    className="text-primary"
                  />
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  сообщество веб-разработчиков Казахстана, объединяющее лучшие
                  умы в мире кода
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
                >
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Javascript, React, Next.js..."
                    type="text"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    <CodeIcon className="h-4 w-4 mr-2" />
                    Найти
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
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Почему OnePorted?
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mx-auto">
                    Погрузитесь в мир инновационной разработки и
                    профессионального роста
                  </p>
                </div>
              </div>
              <div className="mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3 items-start lg:grid-cols-3">
                {[
                  {
                    title: "Передовые технологии",
                    icon: RocketIcon,
                    description:
                      "Обучаем Веб-Разработке лишь лучшими технологиями. React, Next.js, Tailwind CSS и многое другое.",
                  },
                  {
                    title: "Коллаборация и нетворкинг",
                    icon: UsersIcon,
                    description:
                      "Объединяйтесь с лучшими разработчиками страны. Создавайте проекты, которые изменят мир, да просто общайтесь.",
                  },
                  {
                    title: "Филиалы",
                    icon: GlobeIcon,
                    description:
                      "Планируем открыть клубы в таких городах, как Семей, Шымкент.",
                  },
                ].map((item, index) => (
                  <Card key={index} className="flex flex-col h-full">
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-between">
                      <item.icon className="h-12 w-12 mb-4" />
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
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Хочешь OnePorted у себя в городе?
                  </h2>
                  <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    помоги нам расширяться и открой филиал нашего сообщества
                    прям в своём городе! Заявку ниже и мы свяжемся с тобой
                  </p>
                </div>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex flex-col gap-2">
                  <Input placeholder="Ваш Telegram" type="text" />
                  <Button type="submit" className="w-full">
                    Войти в мир OnePorted
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
