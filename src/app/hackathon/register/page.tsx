"use client";

import { LoadingDots } from "@/components/LoadingDots";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Code, ArrowUp, ArrowDown } from "lucide-react";

type Question = {
  id: number;
  question: string;
  type: "text" | "email" | "tel" | "select";
  required?: boolean;
  options?: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: "Давайте знакомиться! Укажите ФИО",
    type: "text",
    required: true,
  },
  {
    id: 2,
    question: "Ваш email для связи",
    type: "email",
    required: true,
  },
  {
    id: 3,
    question: "Номер телефона",
    type: "tel",
    required: true,
  },
  {
    id: 4,
    question: "В каком классе вы учитесь?",
    type: "select",
    required: true,
    options: ["7 класс", "8 класс", "9 класс", "10 класс", "11 класс", "12 класс"],
  },
  {
    id: 5,
    question: "Выберите вашу школу",
    type: "select",
    required: true,
    options: [
      "НИШ ФМН г. Семей",
      "НИШ ФМН г. Шымкент"
    ],
  },
  {
    id: 6,
    question: "Название вашей команды",
    type: "text",
    required: true,
  },
  {
    id: 7,
    question: "Сколько человек в вашей команде? (включая вас)",
    type: "select",
    required: true,
    options: ["2", "3", "4", "5"],
  }
];

const generateTeamMemberQuestions = (memberNumber: number) => [
  {
    id: `member${memberNumber}_name`,
    question: `ФИО ${memberNumber}-го участника команды`,
    type: "text",
    required: true,
  },
  {
    id: `member${memberNumber}_class`,
    question: `Класс ${memberNumber}-го участника`,
    type: "select",
    required: true,
    options: ["7 класс", "8 класс", "9 класс", "10 класс", "11 класс", "12 класс"],
  },
  {
    id: `member${memberNumber}_school`,
    question: `Школа ${memberNumber}-го участника`,
    type: "select",
    required: true,
    options: [
      "НИШ ФМН г. Семей",
      "НИШ ФМН г. Шыкент"
    ],
  },
  {
    id: `member${memberNumber}_email`,
    question: `Email ${memberNumber}-го участника`,
    type: "email",
    required: true,
  },
  {
    id: `member${memberNumber}_phone`,
    question: `Телефон ${memberNumber}-го участника`,
    type: "tel",
    required: true,
  },
];

const formatPhoneNumber = (value: string): string => {
  let numbers = value.replace(/\D/g, '');
  if (numbers.startsWith('8')) {
    numbers = '7' + numbers.slice(1);
  }
  if (!numbers.startsWith('7')) {
    numbers = '7' + numbers;
  }
  numbers = numbers.slice(0, 11);
  let formatted = '';
  if (numbers.length > 0) {
    formatted = '+' + numbers[0];
  }
  if (numbers.length > 1) {
    formatted += ' (' + numbers.slice(1, 4);
  }
  if (numbers.length > 4) {
    formatted += ') ' + numbers.slice(4, 7);
  }
  if (numbers.length > 7) {
    formatted += '-' + numbers.slice(7, 9);
  }
  if (numbers.length > 9) {
    formatted += '-' + numbers.slice(9);
  }
  
  return formatted;
};

export default function RegisterForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number | string]: string }>({});
  const [allQuestions, setAllQuestions] = useState<Question[]>(questions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "network" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion]);

  useEffect(() => {
    const teamSize = answers[7];
    if (teamSize) {
      const size = parseInt(teamSize);
      const additionalQuestions = Array.from({ length: size - 1 }, (_, i) => 
        generateTeamMemberQuestions(i + 2)
      ).flat();
      
      setAllQuestions([...questions, ...additionalQuestions]);
      setTimeout(() => {
        setCurrentQuestion(questions.length);
      }, 500);
    }
  }, [answers[7]]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && answers[allQuestions[currentQuestion].id]) {
      e.preventDefault();
      if (currentQuestion === allQuestions.length - 1) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
    }
  };

  const formatInput = (value: string, type: "email" | "tel") => {
    if (type === "tel") {
      return formatPhoneNumber(value);
    }
    return value.toLowerCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, type } = e.target;
    const formattedValue = formatInput(value, type as "email" | "tel");
    setAnswers(prev => ({
      ...prev,
      [allQuestions[currentQuestion].id]: formattedValue,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register-hackathon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      
      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("network");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingDots />
          <p className="text-muted-foreground">Пожалуйста, подождите...</p>
        </div>
      </div>
    );
  }

  if (submitStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="inline-block p-4 bg-green-100 rounded-full">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Спасибо за регистрацию! 🎉</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Мы обязательно добавим вас в группу.</p>
                <p>Вся дополнительная информация будет отправлена капитану.</p>
                <p className="font-medium text-foreground">До встречи на хакатоне!</p>
              </div>
            </motion.div>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500">
              Произошла ошибка при отправке формы.
              <br />
              Пожалуйста, попробуйте позже.
            </p>
          )}
          {submitStatus === "network" && (
            <p className="text-red-500">
              Проверьте подключение к интернету
              <br />
              и попробуйте снова.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-[57px] left-0 w-full h-[2px] bg-muted">
        <motion.div
          className="h-full bg-foreground"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentQuestion + 1) / allQuestions.length) * 100}%`,
          }}
          transition={{ ease: "easeInOut" }}
        />
      </div>
      <main className="flex-1 flex items-center justify-center p-4 mt-[57px] mb-[60px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-xl w-full space-y-6 py-12"
          >
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {currentQuestion + 1} из {allQuestions.length}
              </div>
              <h2 className="text-3xl font-medium">
                {allQuestions[currentQuestion].question}
                {allQuestions[currentQuestion].required && (
                  <span className="text-destructive">*</span>
                )}
              </h2>
            </div>

            {allQuestions[currentQuestion].type === "select" ? (
              <div className="space-y-2 pt-4">
                {allQuestions[currentQuestion].options?.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 rounded-md transition-all ${
                      answers[allQuestions[currentQuestion].id] === option
                        ? "bg-foreground text-background"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => {
                      setAnswers(prev => ({
                        ...prev,
                        [allQuestions[currentQuestion].id]: option,
                      }));
                      setTimeout(handleNext, 300);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="pt-4">
                <div className="relative group">
                  <input
                    ref={inputRef}
                    type={allQuestions[currentQuestion].type}
                    value={answers[allQuestions[currentQuestion].id] || ""}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите ваш ответ..."
                    className="w-full bg-transparent text-lg outline-none py-3 px-4
                    border-2 border-transparent
                    focus:bg-foreground/[0.03]
                    transition-all duration-500"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
                    w-0 h-[2px] bg-foreground
                    group-focus-within:w-full
                    transition-all duration-500 ease-out"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      answers[allQuestions[currentQuestion].id]
                        ? "bg-foreground text-background hover:opacity-90"
                        : "bg-muted text-muted-foreground"
                    }`}
                    onClick={currentQuestion === allQuestions.length - 1 ? handleSubmit : handleNext}
                    disabled={!answers[allQuestions[currentQuestion].id]}
                  >
                    {currentQuestion === allQuestions.length - 1 ? "Отправить" : "Далее"}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    или нажмите Enter ↵
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="fixed bottom-6 right-6 flex gap-2">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="p-2 rounded-md bg-background border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCurrentQuestion(prev => Math.min(allQuestions.length - 1, prev + 1))}
          disabled={currentQuestion === allQuestions.length - 1}
          className="p-2 rounded-md bg-background border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
