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
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  Send,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

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

export default function MentorForm() {
  const initialFormState = {
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    github: "",
    itExperience: "",
    mentoringExperience: "",
    generalExperience: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
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
    try {
      const response = await fetch("/api/submit-mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      setSubmitStatus({
        success: data.success,
        message: data.message,
      });

      if (data.success) {
        setFormData(initialFormState);
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Произошла ошибка при отправке формы",
      });
    } finally {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-center">OnePorted</h1>
        <p className="text-lg mb-12 text-center text-muted-foreground">
          Присоединяйтесь к нам в качестве ментора
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
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-background"
            />
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
            <Label htmlFor="github" className="text-sm font-medium">
              Ссылка на GitHub (необязательно)
            </Label>
            <Input
              id="github"
              name="github"
              placeholder="https://github.com/username"
              value={formData.github}
              onChange={handleInputChange}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="itExperience" className="text-sm font-medium">
              Опыт в IT
            </Label>
            <Textarea
              id="itExperience"
              name="itExperience"
              placeholder="Расскажите о вашем опыте работы в IT"
              value={formData.itExperience}
              onChange={handleInputChange}
              required
              rows={4}
              className="bg-background resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="mentoringExperience"
              className="text-sm font-medium"
            >
              Опыт в менторстве
            </Label>
            <Textarea
              id="mentoringExperience"
              name="mentoringExperience"
              placeholder="Расскажите о вашем опыте в менторстве, если есть"
              value={formData.mentoringExperience}
              onChange={handleInputChange}
              rows={4}
              className="bg-background resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="generalExperience" className="text-sm font-medium">
              Общий опыт
            </Label>
            <Textarea
              id="generalExperience"
              name="generalExperience"
              placeholder="Расскажите о вашем общем опыте и навыках"
              value={formData.generalExperience}
              onChange={handleInputChange}
              required
              rows={4}
              className="bg-background resize-none"
            />
          </div>
          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Отправить заявку
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
          Почему стать ментором в OnePorted?
        </h2>
        <ul className="space-y-4">
          <li className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Делитесь своими знаниями и опытом в IT
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Помогайте молодым талантам развиваться
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Развивайте свои лидерские и коммуникативные навыки
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Получите классный extracurricular activity
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Постоянно учитесь новому в процессе обучения других
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Расширяйте свою профессиональную сеть в IT-сообществе
            </span>
          </li>
        </ul>
      </motion.div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {submitStatus?.success ? "Спасибо за заявку!" : "Ошибка отправки"}
            </DialogTitle>
            <DialogDescription>
              {submitStatus?.success ? (
                <>
                  <p>Мы рады, что вы хотите стать ментором в OnePorted! 🎉</p>
                  <p className="mt-2">
                    Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее
                    время.
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
