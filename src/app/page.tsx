'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import { motion, useScroll, useTransform } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { ArrowRight, Github, Instagram, Code, Users, BookOpen, ArrowUpRight, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const features = [
    {
      title: "Статьи",
      description: "Найдите все категории, руководства, инсайты и многое другое",
      icon: BookOpen,
    },
    {
      title: "Проекты",
      description: "Последние, свежие проекты от нашего активного разработчика",
      icon: Code,
      highlight: true,
    },
    {
      title: "Менторство",
      description: "Свяжитесь с опытными разработчиками и развивайте свои навыки",
      icon: Users,
    },
  ]

  const categories = [
    "React",
    "Next.js",
    "C++",
    "HTML",
    "CSS",
    "JavaScript",
    "Python",
  ]

  const stats = [
    { label: "Активных участников", value: "50" },
    { label: "Проектов сделано", value: "10" },
    { label: "Ментора", value: "4" },
    { label: "Ресурсы обучения", value: "12" },
  ]

  const timeline = [
    { title: 'Путь начинается здесь', description: 'Все начинается с идеи' },
    { title: 'Первое понятие', description: 'Когда вдохновение встречается с планированием' },
    { title: 'Когда дело становится серьезным', description: 'Следующий большой шаг' },
  ]

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground pt-20 md:pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 md:mb-12 flex items-center justify-center text-primary text-sm md:text-base">
          <Sparkles className="mr-2 h-4 w-4" />
          Научись программировать прямо сегодня
        </div>
        <motion.div 
          className="text-center mb-16 md:mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Программирование
            <br />
            это просто
          </h1>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Проекты, ресурсы, и ментора для каждого. Начни уже сегодня
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/learn">
            <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Почитать Ресурсы
            </Button>
          </Link>
          <Link href="/join">
            <Button size="lg" variant="outline" className="rounded-full border-border bg-secondary text-secondary-foreground">
              Вступить в клуб
            </Button>
          </Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border bg-card p-6">
              <div className="mb-2 text-xs md:text-sm text-muted-foreground">За этот месяц</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">10</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Лекций</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">0</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Статьей</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">0</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Постов</div>
                </div>
              </div>
            </Card>
          </motion.div>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <Card className={`border-border bg-card p-6 ${feature.highlight ? 'border-primary/30' : ''}`}>
                <div className="flex items-start gap-4">
                  <feature.icon className={`h-6 w-6 mt-1 ${feature.highlight ? 'text-primary' : 'text-foreground'}`} />
                  <div>
                    <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border bg-card p-6">
              <div className="mb-4 text-sm md:text-base font-medium text-foreground">Наш путь</div>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-primary" />
                    {index !== timeline.length - 1 && (
                      <div className="absolute bottom-0 left-1 top-3 w-[1px] bg-border" />
                    )}
                    <div className="text-sm md:text-base font-medium text-foreground">{item.title}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{item.description}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
        <motion.div 
          className="mb-24 md:mb-32"
          style={{ opacity }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Наше сообщество в цифрах</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-24 md:mb-32">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm rounded-full px-3 md:px-4 border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                <span className="mr-1 md:mr-2 text-primary">★</span>
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-24 md:mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">Новые проекты</h3>
                <p className="text-muted-foreground text-sm">Посмотрите последние работы сообщества</p>
              </div>
              <Code className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">Живые обсуждения</h3>
                <p className="text-muted-foreground text-sm">Присоединяйтесь к еженедельным митапам</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </motion.div>
        <motion.div 
          className="text-center mb-24 md:mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Готовы начать свой путь?</h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Вступите в наше коммьюнити сегодня и возвысте свои навыки на новый уровень
          </p>
          <Link href="/join">
          <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Начать сейчас
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          </Link>
        </motion.div>
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm rounded-full border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-secondary-foreground max-w-[300px] truncate"
          >
            https://oneported.vercel.app
          </Button>
        </div>
      </div>
    </div>
  )
}