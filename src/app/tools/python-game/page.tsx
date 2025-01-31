"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Challenge {
  id: number;
  question: string;
  answer: string;
  hint: string;
  nextLine: string;
}

const pythonTerms = [
  { value: "basics", label: "Основы Python" },
  { value: "data_types", label: "Типы данных и операции" },
  { value: "conditionals", label: "Условные операторы" },
  { value: "loops", label: "Циклы" },
  { value: "collections", label: "Коллекции" },
  { value: "functions", label: "Функции" },
  { value: "oop", label: "ООП" },
  { value: "modules", label: "Модули и библиотеки" },
  { value: "pygame", label: "PyGame" },
  { value: "exceptions", label: "Обработка исключений" },
];

const challengesByTerm: Record<string, Challenge[]> = {
  basics: [
    {
      id: 1,
      question: "print(",
      answer: '"Hello, World!"',
      hint: "Выведите стандартное приветствие на экран.",
      nextLine: ")",
    },
    {
      id: 2,
      question: "x = 5\ny = 3\nprint(x ",
      answer: "+ y",
      hint: "Сложите x и y и выведите результат.",
      nextLine: ")",
    },
    {
      id: 3,
      question: 'input("Введите ваше имя: ")',
      answer: "",
      hint: "Запросите у пользователя его имя.",
      nextLine: "",
    },
    {
      id: 4,
      question: "x = 3\nprint(type(",
      answer: "x",
      hint: "Выведите тип переменной x.",
      nextLine: "))",
    },
    {
      id: 5,
      question: 'print("Python is", ',
      answer: "easy",
      hint: "Объедините строки и выведите, что Python легкий.",
      nextLine: ")",
    },
    {
      id: 6,
      question: "print(5",
      answer: "** 2",
      hint: "Возведите 5 в квадрат.",
      nextLine: ")",
    },
    {
      id: 7,
      question: "print(10 ",
      answer: "// 3",
      hint: "Выполните целочисленное деление 10 на 3.",
      nextLine: ")",
    },
    {
      id: 8,
      question: 'a = "apple"\nb = "banana"\nprint(a',
      answer: ' + " и " + b',
      hint: "Объедините строки a и b с разделителем ' и '.",
      nextLine: ")",
    },
    {
      id: 9,
      question: 'x = 5\ny = "5"\nprint(x + ',
      answer: "int(y)",
      hint: "Преобразуйте y в целое число и сложите с x.",
      nextLine: ")",
    },
    {
      id: 10,
      question: 'name = "John"\nprint("Привет, " + ',
      answer: "name",
      hint: "Выведите приветствие с использованием переменной name.",
      nextLine: ")",
    },
    {
      id: 11,
      question: 'print("строка".upper())',
      answer: "",
      hint: "Преобразуйте строку в верхний регистр и выведите.",
      nextLine: "",
    },
    {
      id: 12,
      question: 'print(len("apple"))',
      answer: "",
      hint: "Выведите длину строки 'apple'.",
      nextLine: "",
    },
    {
      id: 13,
      question: 'print("word" * ',
      answer: "3",
      hint: "Повторите строку 'word' три раза.",
      nextLine: ")",
    },
    {
      id: 14,
      question: 'print("10" == ',
      answer: '"10"',
      hint: "Проверьте, равны ли строки '10' и '10'.",
      nextLine: ")",
    },
    {
      id: 15,
      question: 'a = "5"\nprint(a.isdigit())',
      answer: "",
      hint: "Проверьте, состоит ли строка a только из цифр.",
      nextLine: "",
    },
    {
      id: 16,
      question: "x = 4\nprint(x",
      answer: "% 2 == 0",
      hint: "Проверьте, является ли x четным числом.",
      nextLine: ")",
    },
    {
      id: 17,
      question: "print(abs(",
      answer: "-10",
      hint: "Выведите модуль числа -10.",
      nextLine: "))",
    },
    {
      id: 18,
      question: "x = -5\nprint(x",
      answer: "+ 10",
      hint: "Сложите x с 10 и выведите результат.",
      nextLine: ")",
    },
    {
      id: 19,
      question: "print(round(3.14159, ",
      answer: "2",
      hint: "Округлите число 3.14159 до двух знаков после запятой.",
      nextLine: ")",
    },
    {
      id: 20,
      question: 'a = "100"\nb = "200"\nprint(int(a)',
      answer: "+ int(b)",
      hint: "Преобразуйте a и b в числа и сложите их.",
      nextLine: ")",
    },
  ],
  data_types: [
    {
      id: 1,
      question: "x = 10\nprint(type(",
      answer: "x",
      hint: "Выведите тип переменной x, которая равна 10.",
      nextLine: "))",
    },
    {
      id: 2,
      question: "y = 3.14\nprint(type(",
      answer: "y",
      hint: "Выведите тип переменной y, которая равна 3.14.",
      nextLine: "))",
    },
    {
      id: 3,
      question: 's = "Привет"\nprint(s[0])',
      answer: "",
      hint: "Выведите первый символ строки s.",
      nextLine: "",
    },
    {
      id: 4,
      question: "x = 5\nprint(x ",
      answer: "* 2",
      hint: "Умножьте x на 2 и выведите результат.",
      nextLine: ")",
    },
    {
      id: 5,
      question: 's = "apple"\nprint(s[-1])',
      answer: "",
      hint: "Выведите последний символ строки s.",
      nextLine: "",
    },
    {
      id: 6,
      question: "x = 10\ny = 3\nprint(x ",
      answer: "/ y",
      hint: "Разделите x на y и выведите результат.",
      nextLine: ")",
    },
    {
      id: 7,
      question: 'x = "123"\nprint(int(',
      answer: "x",
      hint: "Преобразуйте строку x в целое число.",
      nextLine: "))",
    },
    {
      id: 8,
      question: 'x = "apple"\nprint(len(',
      answer: "x",
      hint: "Выведите длину строки x.",
      nextLine: "))",
    },
    {
      id: 9,
      question: "x = 3.75\nprint(int(",
      answer: "x",
      hint: "Преобразуйте число x в целое и выведите.",
      nextLine: "))",
    },
    {
      id: 10,
      question: "x = 7\nprint(x",
      answer: "% 2 == 1",
      hint: "Проверьте, является ли x нечетным числом.",
      nextLine: ")",
    },
    {
      id: 11,
      question: "x = 5\nprint(str(",
      answer: "x",
      hint: "Преобразуйте число x в строку и выведите.",
      nextLine: "))",
    },
    {
      id: 12,
      question: "x = [1, 2, 3]\nprint(len(",
      answer: "x",
      hint: "Выведите длину списка x.",
      nextLine: "))",
    },
    {
      id: 13,
      question: 'a = "10"\nb = "20"\nprint(int(a)',
      answer: "+ int(b)",
      hint: "Сложите два числа, преобразовав их из строк.",
      nextLine: ")",
    },
    {
      id: 14,
      question: 'x = "banana"\nprint(x.upper())',
      answer: "",
      hint: "Преобразуйте строку x в верхний регистр и выведите.",
      nextLine: "",
    },
    {
      id: 15,
      question: 'x = "apple"\nprint(x[0:3])',
      answer: "",
      hint: "Выведите первые три символа строки x.",
      nextLine: "",
    },
    {
      id: 16,
      question: 'x = "100"\nprint(float(',
      answer: "x",
      hint: "Преобразуйте строку x в число с плавающей точкой.",
      nextLine: "))",
    },
    {
      id: 17,
      question: "x = 3\nprint(float(",
      answer: "x",
      hint: "Преобразуйте целое число x в число с плавающей точкой.",
      nextLine: "))",
    },
    {
      id: 18,
      question: 'x = "true"\nprint(bool(',
      answer: "x",
      hint: "Преобразуйте строку x в булевое значение.",
      nextLine: "))",
    },
    {
      id: 19,
      question: "x = 7\ny = 5\nprint(x ",
      answer: "* y",
      hint: "Умножьте x на y и выведите результат.",
      nextLine: ")",
    },
    {
      id: 20,
      question: 'x = "apple"\nprint(x.startswith("a"))',
      answer: "",
      hint: "Проверьте, начинается ли строка x с буквы 'a'.",
      nextLine: "",
    },
  ],
  conditionals: [
    {
      id: 1,
      question: "if x > 5:\n    print(",
      answer: '"больше 5"',
      hint: "Выведите сообщение, если x больше 5.",
      nextLine: ")",
    },
    {
      id: 2,
      question: 'if x == 3:\n    print("x = 3")\nelse:',
      answer: 'print("x не равно 3")',
      hint: "Выведите сообщение в зависимости от значения x.",
      nextLine: "",
    },
    {
      id: 3,
      question: 'if name == "John":\n    ',
      answer: 'print("Привет, Джон!")',
      hint: "Выведите приветствие, если имя равно 'John'.",
      nextLine: "",
    },
    {
      id: 4,
      question: "if a == b:\n    print(",
      answer: '"a равно b"',
      hint: "Выведите сообщение, если a равно b.",
      nextLine: ")",
    },
    {
      id: 5,
      question: "if x != 0:\n    print(",
      answer: '"не равно нулю"',
      hint: "Выведите сообщение, если x не равно 0.",
      nextLine: ")",
    },
    {
      id: 6,
      question: "if age >= 18:\n    ",
      answer: 'print("Совершеннолетний")',
      hint: "Выведите сообщение, если возраст 18 или больше.",
      nextLine: "",
    },
    {
      id: 7,
      question: "if temperature < 0:\n    print(",
      answer: '"На улице холодно"',
      hint: "Выведите сообщение, если температура ниже 0.",
      nextLine: ")",
    },
    {
      id: 8,
      question: 'if "apple" in fruits:\n    print(',
      answer: '"Яблоко есть"',
      hint: "Проверьте, есть ли 'apple' в списке fruits.",
      nextLine: ")",
    },
    {
      id: 9,
      question: "if score >= 90:\n    ",
      answer: 'print("Отлично")',
      hint: "Выведите сообщение, если оценка 90 или выше.",
      nextLine: "",
    },
    {
      id: 10,
      question: "if number % 2 == 0:\n    ",
      answer: 'print("Четное число")',
      hint: "Выведите сообщение, если число четное.",
      nextLine: "",
    },
    {
      id: 11,
      question: 'if password == "admin":\n    ',
      answer: 'print("Пароль верный")',
      hint: "Выведите сообщение, если пароль правильный.",
      nextLine: "",
    },
    {
      id: 12,
      question: 'if grade >= 5:\n    print("Сдал")\nelse:',
      answer: 'print("Не сдал")',
      hint: "Выведите сообщение в зависимости от оценки.",
      nextLine: "",
    },
    {
      id: 13,
      question: 'if "@" in email:\n    print(',
      answer: '"Это email"',
      hint: "Проверьте, содержит ли email символ '@'.",
      nextLine: ")",
    },
    {
      id: 14,
      question: "if speed > 60:\n    ",
      answer: 'print("Скорость превышена")',
      hint: "Выведите сообщение, если скорость больше 60.",
      nextLine: "",
    },
    {
      id: 15,
      question: 'if " " in text:\n    print(',
      answer: '"Это предложение"',
      hint: "Проверьте, содержит ли текст пробел.",
      nextLine: ")",
    },
    {
      id: 16,
      question: "if balance <= 0:\n    ",
      answer: 'print("Недостаточно средств")',
      hint: "Выведите сообщение, если баланс меньше или равен 0.",
      nextLine: "",
    },
    {
      id: 17,
      question: 'if user == "admin" and password == "1234":\n    ',
      answer: 'print("Вход разрешен")',
      hint: "Проверьте, правильные ли имя пользователя и пароль.",
      nextLine: "",
    },
    {
      id: 18,
      question: "if temperature > 30 or humidity > 70:\n    ",
      answer: 'print("Плохая погода")',
      hint: "Выведите сообщение, если температура или влажность высокие.",
      nextLine: "",
    },
    {
      id: 19,
      question: "if not is_raining:\n    ",
      answer: 'print("Можно гулять")',
      hint: "Выведите сообщение, если дождя нет.",
      nextLine: "",
    },
    {
      id: 20,
      question: "if not password:\n    ",
      answer: 'print("Пароль не введен")',
      hint: "Проверьте, введен ли пароль.",
      nextLine: "",
    },
  ],
  loops: [
    {
      id: 1,
      question: "while x > 0:\n    print(x)\n    ",
      answer: "x -= 1",
      hint: "Пока x больше 0, уменьшайте x на 1 и выводите его.",
      nextLine: "",
    },
    {
      id: 2,
      question: "for i in range(5):\n    print(",
      answer: "i",
      hint: "Выведите значения i от 0 до 4.",
      nextLine: ")",
    },
    {
      id: 3,
      question: "while True:\n    print(",
      answer: '"бесконечный цикл"',
      hint: "Выводите сообщение в бесконечном цикле.",
      nextLine: ")",
    },
    {
      id: 4,
      question: 'for char in "hello":\n    print(',
      answer: "char",
      hint: "Выведите каждый символ строки 'hello'.",
      nextLine: ")",
    },
    {
      id: 5,
      question: "for i in range(2, 10, 2):\n    print(",
      answer: "i",
      hint: "Выведите четные числа от 2 до 8.",
      nextLine: ")",
    },
    {
      id: 6,
      question: "x = 10\nwhile x:\n    print(x)\n    ",
      answer: "x -= 1",
      hint: "Пока x не равен 0, выводите x и уменьшайте его на 1.",
      nextLine: "",
    },
    {
      id: 7,
      question: "for i in range(1, 6):\n    ",
      answer: "print(i ** 2)",
      hint: "Выведите квадрат каждого числа от 1 до 5.",
      nextLine: "",
    },
    {
      id: 8,
      question: "for i in range(5):\n    if i == 3:\n        ",
      answer: "break",
      hint: "Прервите цикл, если i равно 3.",
      nextLine: "",
    },
    {
      id: 9,
      question: "for i in range(5):\n    if i == 2:\n        ",
      answer: "continue",
      hint: "Пропустите итерацию, если i равно 2.",
      nextLine: "",
    },
    {
      id: 10,
      question: "x = 5\nwhile x > 0:\n    x -= 1\nelse:\n    ",
      answer: 'print("Цикл завершен")',
      hint: "Выведите сообщение, когда цикл завершится.",
      nextLine: "",
    },
    {
      id: 11,
      question: "for i in range(3):\n    for j in range(2):\n        print(i, ",
      answer: "j",
      hint: "Выведите пары i и j из вложенных циклов.",
      nextLine: ")",
    },
    {
      id: 12,
      question: "while x != 0:\n    ",
      answer: "print(x)",
      hint: "Выводите x, пока он не равен 0.",
      nextLine: "",
    },
    {
      id: 13,
      question: "for num in range(2, 10):\n    if num % 2 == 0:\n        ",
      answer: "print(num)",
      hint: "Выведите четные числа от 2 до 9.",
      nextLine: "",
    },
    {
      id: 14,
      question: "x = 0\nwhile x < 10:\n    x += 1\n    if x == 5:\n        ",
      answer: "continue",
      hint: "Пропустите итерацию, когда x равно 5.",
      nextLine: "",
    },
    {
      id: 15,
      question: 'for letter in "Python":\n    ',
      answer: "print(letter)",
      hint: "Выведите каждый символ строки 'Python'.",
      nextLine: "",
    },
    {
      id: 16,
      question: "x = 1\nwhile x <= 5:\n    ",
      answer: "print(x)\n    x += 1",
      hint: "Выводите x и увеличивайте его на 1, пока x меньше или равно 5.",
      nextLine: "",
    },
    {
      id: 17,
      question: "for i in range(10, 0, -1):\n    ",
      answer: "print(i)",
      hint: "Выведите числа от 10 до 1.",
      nextLine: "",
    },
    {
      id: 18,
      question:
        "x = 1\nwhile x < 10:\n    x += 1\n    if x % 3 == 0:\n        ",
      answer: "print(x)",
      hint: "Выводите x, если оно кратно 3.",
      nextLine: "",
    },
    {
      id: 19,
      question:
        "for i in range(4):\n    for j in range(4):\n        if i == j:\n            ",
      answer: "continue",
      hint: "Пропустите итерацию, если i равно j.",
      nextLine: "",
    },
    {
      id: 20,
      question: "x = 1\nwhile x < 6:\n    print(x, x ** 2)\n    ",
      answer: "x += 1",
      hint: "Выводите x и его квадрат, увеличивая x на 1.",
      nextLine: "",
    },
  ],
  collections: [
    {
      id: 1,
      question: "my_list = [1, 2, 3]\nmy_list.append(",
      answer: "4",
      hint: "Добавьте элемент 4 в конец списка my_list.",
      nextLine: ")",
    },
    {
      id: 2,
      question: "my_list = [1, 2, 3]\nprint(my_list[0])",
      answer: "",
      hint: "Выведите первый элемент списка my_list.",
      nextLine: "",
    },
    {
      id: 3,
      question: "my_list = [1, 2, 3]\nmy_list.insert(1, ",
      answer: "5",
      hint: "Вставьте элемент 5 на позицию 1 в my_list.",
      nextLine: ")",
    },
    {
      id: 4,
      question: "my_list = [1, 2, 3]\nprint(len(",
      answer: "my_list",
      hint: "Выведите количество элементов в my_list.",
      nextLine: "))",
    },
    {
      id: 5,
      question: "my_list = [1, 2, 3]\nprint(max(",
      answer: "my_list",
      hint: "Выведите максимальное значение из my_list.",
      nextLine: "))",
    },
    {
      id: 6,
      question: "my_list = [1, 2, 3]\nmy_list.remove(",
      answer: "2",
      hint: "Удалите элемент 2 из my_list.",
      nextLine: ")",
    },
    {
      id: 7,
      question: "my_list = [1, 2, 3]\nmy_list.reverse()",
      answer: "",
      hint: "Измените порядок элементов в my_list на обратный.",
      nextLine: "",
    },
    {
      id: 8,
      question: "my_list = [1, 2, 3]\nmy_list.clear()",
      answer: "",
      hint: "Очистите все элементы из my_list.",
      nextLine: "",
    },
    {
      id: 9,
      question: "my_list = [1, 2, 3]\nprint(sorted(",
      answer: "my_list",
      hint: "Выведите отсортированный список my_list.",
      nextLine: "))",
    },
    {
      id: 10,
      question: "my_list = [1, 2, 3]\nmy_list.extend([4, 5])",
      answer: "",
      hint: "Добавьте элементы 4 и 5 в конец my_list.",
      nextLine: "",
    },
    {
      id: 11,
      question: 'my_dict = {"a": 1, "b": 2}\nprint(my_dict["a"])',
      answer: "",
      hint: "Выведите значение по ключу 'a' из my_dict.",
      nextLine: "",
    },
    {
      id: 12,
      question: 'my_dict = {"a": 1, "b": 2}\nmy_dict["c"] = 3',
      answer: "",
      hint: "Добавьте элемент с ключом 'c' и значением 3 в my_dict.",
      nextLine: "",
    },
    {
      id: 13,
      question: 'my_dict = {"a": 1, "b": 2}\nprint(my_dict.keys())',
      answer: "",
      hint: "Выведите все ключи из my_dict.",
      nextLine: "",
    },
    {
      id: 14,
      question: 'my_dict = {"a": 1, "b": 2}\nprint(my_dict.values())',
      answer: "",
      hint: "Выведите все значения из my_dict.",
      nextLine: "",
    },
    {
      id: 15,
      question: 'my_dict = {"a": 1, "b": 2}\nmy_dict.pop(',
      answer: '"a"',
      hint: "Удалите элемент с ключом 'a' из my_dict.",
      nextLine: ")",
    },
    {
      id: 16,
      question: 'my_dict = {"a": 1, "b": 2}\nmy_dict.update({"c": 3})',
      answer: "",
      hint: "Обновите my_dict, добавив элемент с ключом 'c' и значением 3.",
      nextLine: "",
    },
    {
      id: 17,
      question: 'my_dict = {"a": 1, "b": 2}\nprint(my_dict.get(',
      answer: '"a"',
      hint: "Получите значение по ключу 'a' из my_dict.",
      nextLine: "))",
    },
    {
      id: 18,
      question: 'my_dict = {"a": 1, "b": 2}\nmy_dict.clear()',
      answer: "",
      hint: "Очистите все элементы из my_dict.",
      nextLine: "",
    },
    {
      id: 19,
      question: 'my_dict = {"a": 1, "b": 2}\nprint("a" in my_dict)',
      answer: "",
      hint: "Проверьте, существует ли ключ 'a' в my_dict.",
      nextLine: "",
    },
    {
      id: 20,
      question: 'my_dict = {"a": 1, "b": 2}\nmy_dict.setdefault("c", 3)',
      answer: "",
      hint: "Установите значение 3 для ключа 'c', если он отсутствует.",
      nextLine: "",
    },
  ],
  functions: [
    {
      id: 1,
      question: "def my_function():\n    ",
      answer: 'print("Hello")',
      hint: "Определите функцию, которая выводит 'Hello'.",
      nextLine: "",
    },
    {
      id: 2,
      question: "def add(x, y):\n    return x ",
      answer: "+ y",
      hint: "Определите функцию, которая возвращает сумму x и y.",
      nextLine: "",
    },
    {
      id: 3,
      question: "def multiply(x, y):\n    return ",
      answer: "x * y",
      hint: "Определите функцию, которая возвращает произведение x и y.",
      nextLine: "",
    },
    {
      id: 4,
      question: 'def greet(name):\n    return "Привет, " + ',
      answer: "name",
      hint: "Определите функцию, которая приветствует по имени.",
      nextLine: "",
    },
    {
      id: 5,
      question: "def square(x):\n    return ",
      answer: "x ** 2",
      hint: "Определите функцию, которая возвращает квадрат числа x.",
      nextLine: "",
    },
    {
      id: 6,
      question: "def is_even(x):\n    return x ",
      answer: "% 2 == 0",
      hint: "Определите функцию, которая проверяет, четное ли число x.",
      nextLine: "",
    },
    {
      id: 7,
      question:
        "def factorial(n):\n    if n == 0:\n        return 1\n    return n * ",
      answer: "factorial(n-1)",
      hint: "Определите рекурсивную функцию для вычисления факториала n.",
      nextLine: "",
    },
    {
      id: 8,
      question: "def my_function():\n    return ",
      answer: "None",
      hint: "Определите функцию, которая ничего не возвращает.",
      nextLine: "",
    },
    {
      id: 9,
      question: "def greet(name):\n    return ",
      answer: '"Hello, " + name',
      hint: "Определите функцию, которая возвращает приветствие с именем.",
      nextLine: "",
    },
    {
      id: 10,
      question: "def my_function(x):\n    return x + ",
      answer: "1",
      hint: "Определите функцию, которая увеличивает x на 1.",
      nextLine: "",
    },
    {
      id: 11,
      question: "def add_numbers(a, b=0):\n    return a + ",
      answer: "b",
      hint: "Определите функцию, которая возвращает сумму a и b (b по умолчанию 0).",
      nextLine: "",
    },
    {
      id: 12,
      question:
        "def multiply_list(lst):\n    result = 1\n    for num in lst:\n        result *= num\n    return ",
      answer: "result",
      hint: "Определите функцию, которая возвращает произведение элементов списка.",
      nextLine: "",
    },
    {
      id: 13,
      question: 'def my_function():\n    print("Executing")\n    return ',
      answer: "None",
      hint: "Определите функцию, которая выполняет действие и ничего не возвращает.",
      nextLine: "",
    },
    {
      id: 14,
      question: "def subtract(a, b):\n    return ",
      answer: "a - b",
      hint: "Определите функцию, которая возвращает разность a и b.",
      nextLine: "",
    },
    {
      id: 15,
      question:
        'def divide(a, b):\n    if b == 0:\n        return "Нельзя делить на ноль"\n    return a ',
      answer: "/ b",
      hint: "Определите функцию, которая делит a на b с проверкой на 0.",
      nextLine: "",
    },
    {
      id: 16,
      question: "def max_number(a, b):\n    return ",
      answer: "a if a > b else b",
      hint: "Определите функцию, которая возвращает большее из двух чисел.",
      nextLine: "",
    },
    {
      id: 17,
      question: "def is_positive(x):\n    return ",
      answer: "x > 0",
      hint: "Определите функцию, которая проверяет, положительное ли число x.",
      nextLine: "",
    },
    {
      id: 18,
      question: "def my_function(x):\n    return x ",
      answer: "* 2",
      hint: "Определите функцию, которая удваивает значение x.",
      nextLine: "",
    },
    {
      id: 19,
      question:
        'def count_vowels(s):\n    return sum(1 for char in s if char in "aeiou")',
      answer: "",
      hint: "Определите функцию, которая считает количество гласных в строке s.",
      nextLine: "",
    },
    {
      id: 20,
      question: "def print_greeting():\n    ",
      answer: 'print("Привет, мир!")',
      hint: "Определите функцию, которая выводит 'Привет, мир!'.",
      nextLine: "",
    },
  ],
  oop: [
    {
      id: 1,
      question: "class Dog:\n    def __init__(self, name):\n        ",
      answer: "self.name = name",
      hint: "Определите конструктор класса Dog, который принимает имя.",
      nextLine: "",
    },
    {
      id: 2,
      question: "class Dog:\n    def bark(self):\n        ",
      answer: 'return "Гав!"',
      hint: "Определите метод bark, который возвращает 'Гав!'.",
      nextLine: "",
    },
    {
      id: 3,
      question: "class Cat(Dog):\n    def meow(self):\n        ",
      answer: 'return "Мяу!"',
      hint: "Определите метод meow для класса Cat, который наследует от Dog.",
      nextLine: "",
    },
    {
      id: 4,
      question: "class Animal:\n    def speak(self):\n        ",
      answer: "raise NotImplementedError",
      hint: "Определите абстрактный метод speak для класса Animal.",
      nextLine: "",
    },
    {
      id: 5,
      question: "class Person:\n    def __init__(self, name):\n        ",
      answer: "self.name = name",
      hint: "Определите конструктор класса Person, который принимает имя.",
      nextLine: "",
    },
    {
      id: 6,
      question: "class Circle:\n    def __init__(self, radius):\n        ",
      answer: "self.radius = radius",
      hint: "Определите конструктор класса Circle, который принимает радиус.",
      nextLine: "",
    },
    {
      id: 7,
      question:
        "class Rectangle:\n    def area(self, width, height):\n        ",
      answer: "return width * height",
      hint: "Определите метод area, который возвращает площадь прямоугольника.",
      nextLine: "",
    },
    {
      id: 8,
      question:
        "class Student:\n    def __init__(self, name, grade):\n        ",
      answer: "self.name = name\n        self.grade = grade",
      hint: "Определите конструктор класса Student, который принимает имя и оценку.",
      nextLine: "",
    },
    {
      id: 9,
      question: "class Vehicle:\n    def start(self):\n        ",
      answer: 'return "Машина заведена"',
      hint: "Определите метод start, который возвращает сообщение о запуске машины.",
      nextLine: "",
    },
    {
      id: 10,
      question: "class Car(Vehicle):\n    def honk(self):\n        ",
      answer: 'return "Бип!"',
      hint: "Определите метод honk для класса Car, который наследует от Vehicle.",
      nextLine: "",
    },
    {
      id: 11,
      question: "class Book:\n    def __init__(self, title):\n        ",
      answer: "self.title = title",
      hint: "Определите конструктор класса Book, который принимает название.",
      nextLine: "",
    },
    {
      id: 12,
      question: "class Library:\n    def __init__(self):\n        ",
      answer: "self.books = []",
      hint: "Определите конструктор класса Library, который инициализирует список книг.",
      nextLine: "",
    },
    {
      id: 13,
      question: "class Employee:\n    def __init__(self, name):\n        ",
      answer: "self.name = name\n        self.salary = 0",
      hint: "Определите конструктор класса Employee, который принимает имя и устанавливает зарплату по умолчанию.",
      nextLine: "",
    },
    {
      id: 14,
      question: "class Shape:\n    def area(self):\n        ",
      answer: "raise NotImplementedError",
      hint: "Определите абстрактный метод area для класса Shape.",
      nextLine: "",
    },
    {
      id: 15,
      question: "class Parent:\n    def __init__(self):\n        ",
      answer: "self.value = 10",
      hint: "Определите конструктор класса Parent, который устанавливает значение по умолчанию.",
      nextLine: "",
    },
    {
      id: 16,
      question: "class Child(Parent):\n    def __init__(self):\n        ",
      answer: "super().__init__()",
      hint: "Вызовите конструктор родительского класса в Child.",
      nextLine: "",
    },
    {
      id: 17,
      question: "class Point:\n    def __init__(self, x, y):\n        ",
      answer: "self.x = x\n        self.y = y",
      hint: "Определите конструктор класса Point, который принимает координаты x и y.",
      nextLine: "",
    },
    {
      id: 18,
      question: "class Counter:\n    def __init__(self):\n        ",
      answer: "self.count = 0",
      hint: "Определите конструктор класса Counter, который инициализирует счетчик.",
      nextLine: "",
    },
    {
      id: 19,
      question: "class Counter:\n    def increment(self):\n        ",
      answer: "self.count += 1",
      hint: "Определите метод increment, который увеличивает счетчик на 1.",
      nextLine: "",
    },
    {
      id: 20,
      question: "class Game:\n    def __init__(self):\n        ",
      answer: "self.score = 0",
      hint: "Определите конструктор класса Game, который инициализирует счет.",
      nextLine: "",
    },
  ],
};

const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, "");

export default function Component() {
  const [currentTerm, setCurrentTerm] = useState("basics");
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentChallenge = challengesByTerm[currentTerm][currentChallengeIndex];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (normalizeString(value) === normalizeString(currentChallenge.answer)) {
      setIsCorrect(true);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } else {
      setIsCorrect(false);
    }
  };

  const goToNextChallenge = () => {
    setCurrentChallengeIndex(
      (prevIndex) => (prevIndex + 1) % challengesByTerm[currentTerm].length
    );
    setInput("");
    setIsCorrect(false);
    setShowAnswer(false);
  };

  const goToPreviousChallenge = () => {
    setCurrentChallengeIndex(
      (prevIndex) =>
        (prevIndex - 1 + challengesByTerm[currentTerm].length) %
        challengesByTerm[currentTerm].length
    );
    setInput("");
    setIsCorrect(false);
    setShowAnswer(false);
  };

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleTermChange = (value: string) => {
    setCurrentTerm(value);
    setCurrentChallengeIndex(0);
    setInput("");
    setIsCorrect(false);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <CardTitle className="text-2xl">Завершите этот код</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={handleTermChange} value={currentTerm}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите тему Python" />
            </SelectTrigger>
            <SelectContent>
              {pythonTerms.map((term) => (
                <SelectItem key={term.value} value={term.value}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-mono">
                  ОТЛИЧНО! ВЫ ОТВЕТИЛИ ПРАВИЛЬНО
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="font-mono text-lg space-y-2">
            <div className="flex flex-col">
              <div className="flex">
                <span className="text-muted-foreground w-8 text-right pr-4 select-none">
                  1
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-primary">
                    {currentChallenge.question}
                  </span>
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    className={`w-40 font-mono text-lg p-0 h-auto bg-transparent border-none focus-visible:ring-0 ${
                      isCorrect ? "text-primary" : "text-muted-foreground"
                    }`}
                    placeholder="_____"
                  />
                </div>
              </div>
              {currentChallenge.nextLine && (
                <div className="flex">
                  <span className="text-muted-foreground w-8 text-right pr-4 select-none">
                    2
                  </span>
                  <span className="text-primary">
                    {currentChallenge.nextLine}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span className="text-sm">
                Подсказка: {currentChallenge.hint}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleShowAnswer}>
              {showAnswer ? "Скрыть ответ" : "Показать ответ"}
            </Button>
          </div>

          {showAnswer && (
            <div className="text-sm text-muted-foreground">
              Ответ:{" "}
              <span className="font-mono">{currentChallenge.answer}</span>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button onClick={goToPreviousChallenge} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Предыдущий
            </Button>
            <Button onClick={goToNextChallenge} variant="outline" size="sm">
              Следующий
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
