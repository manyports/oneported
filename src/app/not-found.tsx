'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
          <p className="text-muted-foreground mb-8">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </p>
          <Link href="/">
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 