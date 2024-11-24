"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, Code, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { useTypewriter } from "react-simple-typewriter";

const TerminalWindow = ({ children, title = "terminal" }) => (
  <div className="rounded border border-border overflow-hidden backdrop-blur">
    <div className="bg-muted px-4 py-2 flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <div className="ml-2 text-sm text-muted-foreground">{title}</div>
    </div>
    <div className="bg-background p-4 font-mono text-sm">{children}</div>
  </div>
);

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const incrementSize = Math.ceil(end / (duration / 16)); 

    let timer = setInterval(() => {
      start += incrementSize;
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const MessageBubble = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-muted rounded p-4 border border-border"
  >
    {children}
  </motion.div>
);

export default function Component() {
  const [currentCommand, setCurrentCommand] = useState(0);
  const commands = [
    "~ cd hackathon",
    "~ git clone onePorted/hackathon",
    "~ npm install",
    "~ npm run dev",
  ];

  const [text] = useTypewriter({
    words: ["Создавайте инновации.", "Решайте проблемы.", "Меняйте будущее."],
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCommand((prev) => (prev + 1) % commands.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <header className="space-y-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl font-bold">
              OnePorted Hackathon
            </h1>
            <p className="text-2xl h-8">{text}</p>
          </motion.div>

          <div className="flex gap-4">
            <Button
              className="bg-white text-black hover:bg-neutral-200"
              onClick={() => window.location.href = "/hackathon/register"}
            >
              Регистрация
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="space-y-32">
          <section className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <TerminalWindow title="onePorted/hackathon">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCommand}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-neutral-400"
                  >
                    <span className="text-green-500">➜</span>{" "}
                    {commands[currentCommand]}
                  </motion.div>
                </AnimatePresence>
              </TerminalWindow>
              <MessageBubble>Хакатон пройдет с 2 по 9 декабря</MessageBubble>
              <MessageBubble>
                <div className="text-2xl font-bold">
                  <AnimatedCounter value="50000" duration={2000} /> ₸
                </div>
                <div className="text-neutral-400">Призовой фонд</div>
              </MessageBubble>
            </div>
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Бизнес</h3>
                </div>
                <p className="text-muted-foreground">
                  Создайте инновационные решения для оптимизации
                  бизнес-процессов и развития предпринимательства
                </p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Смарт-школа</h3>
                </div>
                <p className="text-muted-foreground">
                  Разработайте технологические решения для модернизации
                  образовательной инфраструктуры
                </p>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8">Расписание</h2>
            <div className="space-y-4">
              {[
                {
                  date: "25.11–01.12",
                  title: "Подготовка",
                  description: "Регистрация команд и анонс тем",
                },
                {
                  date: "02.12",
                  title: "Открытие",
                  description: "Начало работы над проектами",
                },
                {
                  date: "03.12–05.12",
                  title: "Разработка",
                  description: "72 часа интенсивной работы",
                },
                {
                  date: "06.12",
                  title: "Защита",
                  description: "Презентация проектов",
                },
                {
                  date: "09.12",
                  title: "Награждение",
                  description: "Объявление победителей",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="group flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="font-mono text-muted-foreground w-28">
                      {item.date}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Card>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Готовы принять вызов?</h2>
            <p className="text-neutral-400 mb-8">
              Регистрация открыта до 1 декабря. Количество мест ограничено!
            </p>
            <Button className="bg-white text-black hover:bg-neutral-200 border">
              Зарегистрироваться
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}
