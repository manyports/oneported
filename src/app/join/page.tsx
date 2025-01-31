"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  Loader2,
  Send,
  Trophy,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  if (!phoneNumber.startsWith("7")) {
    return "+7 ";
  }

  const phoneNumberWithoutCode = phoneNumber.slice(1);
  const phoneNumberLength = phoneNumberWithoutCode.length;

  if (phoneNumberLength < 4) {
    return `+7 (${phoneNumberWithoutCode}`;
  } else if (phoneNumberLength < 7) {
    return `+7 (${phoneNumberWithoutCode.slice(
      0,
      3
    )}) ${phoneNumberWithoutCode.slice(3)}`;
  } else if (phoneNumberLength < 9) {
    return `+7 (${phoneNumberWithoutCode.slice(
      0,
      3
    )}) ${phoneNumberWithoutCode.slice(3, 6)} ${phoneNumberWithoutCode.slice(
      6,
      8
    )}`;
  } else {
    return `+7 (${phoneNumberWithoutCode.slice(
      0,
      3
    )}) ${phoneNumberWithoutCode.slice(3, 6)} ${phoneNumberWithoutCode.slice(
      6,
      8
    )}-${phoneNumberWithoutCode.slice(8, 10)}`;
  }
};

export default function JoinClubForm() {
  const initialFormState = {
    lastName: "",
    firstName: "",
    phone: "+7 ",
    school: "",
    class: "",
    programmingBackground: "",
    bio: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setSubmitStatus("success");
        setFormData(initialFormState);
      } else {
        console.error("Ошибка при отправке");
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-center">OnePorted</h1>
        <p className="text-lg mb-12 text-center text-muted-foreground">
          Присоединяйтесь к нам
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Фамилия
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Введите фамилию"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                Имя
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Введите имя"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="bg-background"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Номер телефона
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+7 (XXX) XXX XX-XX"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school" className="text-sm font-medium">
              Школа
            </Label>
            <Select
              name="school"
              value={formData.school}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, school: value }))
              }
            >
              <SelectTrigger id="school" className="bg-background">
                <SelectValue placeholder="Выберите школу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semey">НИШ ФМН г. Семей</SelectItem>
                <SelectItem value="shymkent">НИШ ФМН г. Шымкент</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class" className="text-sm font-medium">
              Класс
            </Label>
            <Input
              id="class"
              name="class"
              placeholder="Например, 10А"
              value={formData.class}
              onChange={handleInputChange}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="programmingBackground"
              className="text-sm font-medium"
            >
              Опыт в программировании
            </Label>
            <Textarea
              id="programmingBackground"
              name="programmingBackground"
              placeholder="Расскажите о вашем опыте в программировании"
              value={formData.programmingBackground}
              onChange={handleInputChange}
              rows={4}
              className="bg-background resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              О себе
            </Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Расскажите немного о себе и ваших целях"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="bg-background resize-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-12"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Почему OnePorted?
        </h2>
        <ul className="space-y-4">
          <li className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Изучение современных технологий веб-разработки
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Практические проекты и работа в команде
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Менторство от опытных разработчиков
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Участие в хакатонах и конкурсах
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Создание собственного портфолио
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Подготовка к будущей карьере в IT
            </span>
          </li>
        </ul>
      </motion.div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {submitStatus === "success"
                ? "Спасибо за заполнение!"
                : "Ошибка отправки"}
            </DialogTitle>
            <DialogDescription>
              {submitStatus === "success" ? (
                <>
                  <p>Ждем тебя в клубе OnePorted! 🎉</p>
                  <p className="mt-2">
                    Мы свяжемся с тобой в ближайшее время для дальнейших
                    инструкций.
                  </p>
                </>
              ) : (
                <p>
                  К сожалению, произошла ошибка при отправке формы. Пожалуйста,
                  попробуйте еще раз позже или свяжитесь с нами напрямую.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
