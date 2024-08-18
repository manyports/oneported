import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Code, FileCode, FileJson, Palette } from "lucide-react";
import Link from "next/link";
import path from "path";

const technologies = [
  {
    name: "HTML",
    icon: FileCode,
    description:
      "Изучите основы структурирования веб-страниц, семантическую верстку и работу с формами в HTML5.",
    path: "/learn/html",
  },
  {
    name: "CSS",
    icon: Palette,
    description:
      "Погрузитесь в мир стилизации веб-страниц, изучая Flexbox, Grid, анимации и современные техники CSS.",
    path: "/learn/css",
  },
  {
    name: "JavaScript",
    icon: FileJson,
    description:
      "Освойте основы программирования на JavaScript, работу с DOM, асинхронные запросы и многое другое.",
    path: "/learn/javascript",
  },
  {
    name: "React",
    icon: Code,
    description:
      "Научитесь создавать интерактивные пользовательские интерфейсы с помощью React, включая работу с хуками и управление состоянием.",
    path: "/learn/react",
  },
  {
    name: "Next.js",
    icon: ChevronRight,
    description:
      "Освойте разработку с использованием фреймворка Next.js, включая серверный рендеринг, роутинг и оптимизацию производительности.",
    path: "/learn/nextjs",
  },
  {
    name: "C++",
    icon: ChevronRight,
    description:
      "Изучите основы и продвинутые концепции программирования на C++, включая управление памятью, объектно-ориентированное программирование",
    path: "/learn/cpp",
  },
  {
    name: "Python",
    icon: ChevronRight,
    description:
      "Изучите основы и продвинутые концепции программирования на Python, включая работу с данными.",
    path: "/learn/python",
  },
];

export default function Component() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Обучение веб-разработке
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {technologies.map((tech) => (
          <Card
            key={tech.name}
            className="flex flex-col min-h-[320px] shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <tech.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">{tech.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <CardDescription className="mb-6 flex-grow">
                {tech.description}
              </CardDescription>
              <Link href={tech.path || ""} className="mt-auto">
                <Button className="w-full">
                  Обучиться
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
