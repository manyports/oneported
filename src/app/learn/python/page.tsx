"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Codesandbox, Copy, Terminal } from "lucide-react";
import { useState } from "react";

export default function PythonTutorial() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, output }: { code: string; output: string }) => (
    <div className="relative mb-4">
      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
        <code>{code}</code>
      </pre>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => copyToClipboard(code)}
        >
          <Copy className="h-4 w-4 mr-2" />
          {copiedCode === code ? "Скопировано!" : "Копировать"}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Terminal className="h-4 w-4 mr-2" />
              Выполнить
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto w-full">
            <DialogHeader>
              <DialogTitle>Результат выполнения</DialogTitle>
            </DialogHeader>
            <div className="border p-4 rounded-md bg-black text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
              {output}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 py-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        Полное руководство по Python
      </h1>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в Python
        </h2>
        <p className="mb-4">
          Python — это высокоуровневый язык программирования, известный своей
          простотой и читаемостью кода. Он широко используется в различных
          областях, от веб-разработки до анализа данных и машинного обучения.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Основная структура программы на Python
        </h2>
        <CodeBlock code={`print("Привет, мир!")`} output={`Привет, мир!`} />
        <p className="mb-4">
          Простейшая программа на Python состоит из одной строки, которая
          выводит сообщение на экран. Давайте разберем её:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>print()</code>: Функция вывода текста на экран.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Переменные и типы данных
        </h2>
        <CodeBlock
          code={`age = 25
height = 1.75
name = "Алиса"
is_student = True

print(f"Возраст: {age}")
print(f"Рост: {height} м")
print(f"Имя: {name}")
print(f"Студент: {'Да' if is_student else 'Нет'}")`}
          output={`Возраст: 25
Рост: 1.75 м
Имя: Алиса
Студент: Да`}
        />
        <p className="mb-4">
          Python поддерживает различные типы данных. Вот некоторые из них:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>int</code>: Целые числа
          </li>
          <li>
            <code>float</code>: Числа с плавающей точкой
          </li>
          <li>
            <code>str</code>: Строки
          </li>
          <li>
            <code>bool</code>: Логические значения (True/False)
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Условные операторы
        </h2>
        <CodeBlock
          code={`number = 10

if number > 0:
    print("Число положительное")
elif number < 0:
    print("Число отрицательное")
else:
    print("Число равно нулю")`}
          output={`Число положительное`}
        />
        <p className="mb-4">
          Условные операторы в Python позволяют выполнять разные действия в
          зависимости от условий.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Циклы</h2>
        <CodeBlock
          code={`# Цикл for
for i in range(5):
    print(i, end=" ")
print()

# Цикл while
j = 0
while j < 5:
    print(j, end=" ")
    j += 1`}
          output={`0 1 2 3 4 
0 1 2 3 4`}
        />
        <p className="mb-4">
          Python поддерживает несколько типов циклов для повторения действий:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>for</code>: Используется для итерации по последовательности
          </li>
          <li>
            <code>while</code>: Выполняется, пока условие истинно
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Списки</h2>
        <CodeBlock
          code={`numbers = [1, 2, 3, 4, 5]

for number in numbers:
    print(number, end=" ")
print()`}
          output={`1 2 3 4 5`}
        />
        <p className="mb-4">
          Списки в Python позволяют хранить несколько значений в одном объекте:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>numbers</code>: Объявляет список из пяти элементов.
          </li>
          <li>
            <code>number</code>: Обращение к элементу списка по индексу.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Словари</h2>
        <CodeBlock
          code={`person = {
    "name": "Алиса",
    "age": 25,
    "height": 1.75
}

print(f"Имя: {person['name']}")
print(f"Возраст: {person['age']}")
print(f"Рост: {person['height']} м")`}
          output={`Имя: Алиса
Возраст: 25
Рост: 1.75 м`}
        />
        <p className="mb-4">
          Словари в Python позволяют хранить данные в виде пар "ключ-значение":
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>person</code>: Объявляет словарь с ключами и соответствующими
            значениями.
          </li>
          <li>
            <code>person['name']</code>: Обращение к значению по ключу.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Функции</h2>
        <CodeBlock
          code={`def add(a, b):
    return a + b

def print_message(message):
    print(message)

result = add(5, 3)
print(f"5 + 3 = {result}")

print_message("Привет, функции!")`}
          output={`5 + 3 = 8
Привет, функции!`}
        />
        <p className="mb-4">
          Функции в Python позволяют группировать код, который можно повторно
          использовать:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>def</code>: Ключевое слово для объявления функции.
          </li>
          <li>
            <code>return</code>: Возвращает значение из функции.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Кортежи и множества
        </h2>
        <CodeBlock
          code={`# Кортежи (tuples)
        my_tuple = (1, 2, 3, 4, 5)
        print("Элементы кортежа:", my_tuple)

        # Множества (sets)
        my_set = {1, 2, 3, 4, 4, 5}
        print("Элементы множества:", my_set)`}
          output={`Элементы кортежа: (1, 2, 3, 4, 5)
        Элементы множества: {1, 2, 3, 4, 5}`}
        />
        <p className="mb-4">
          Кортежи — это неизменяемые последовательности, а множества — это
          коллекции уникальных элементов:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>my_tuple</code>: Кортеж с неизменяемыми элементами.
          </li>
          <li>
            <code>my_set</code>: Множество с уникальными элементами.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Работа с файлами
        </h2>
        <CodeBlock
          code={`# Запись в файл
with open('example.txt', 'w') as file:
    file.write('Hello, World!')

# Чтение из файла
with open('example.txt', 'r') as file:
    content = file.read()
    print(content)`}
          output={`Hello, World!`}
        />
        <p className="mb-4">
          Работа с файлами в Python выполняется через контекстные менеджеры{" "}
          <code>with</code>, что позволяет безопасно открывать и закрывать
          файлы:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>open('filename', 'mode')</code>: Открывает файл в указанном
            режиме (например, 'w' для записи, 'r' для чтения).
          </li>
          <li>
            <code>file.read()</code>: Читает содержимое файла.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Исключения и обработка ошибок
        </h2>
        <CodeBlock
          code={`try:
    number = int(input("Введите число: "))
    result = 10 / number
    print("Результат:", result)
except ZeroDivisionError:
    print("Ошибка: Деление на ноль!")
except ValueError:
    print("Ошибка: Некорректный ввод!")
finally:
    print("Завершение работы программы.")`}
          output={`Введите число: 0
Ошибка: Деление на ноль!
Завершение работы программы.`}
        />
        <p className="mb-4">
          Исключения в Python позволяют обрабатывать ошибки, которые могут
          возникнуть во время выполнения программы:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>try</code>: Блок кода, который может вызвать исключение.
          </li>
          <li>
            <code>except</code>: Блок кода для обработки исключений.
          </li>
          <li>
            <code>finally</code>: Выполняется всегда, независимо от наличия
            исключений.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в модули
        </h2>
        <CodeBlock
          code={`import math

print("Квадратный корень из 16:", math.sqrt(16))
print("Площадь круга радиуса 3:", math.pi * 3 ** 2)`}
          output={`Квадратный корень из 16: 4.0
Площадь круга радиуса 3: 28.274333882308138`}
        />
        <p className="mb-4">
          Модули в Python позволяют использовать готовые функции и константы:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>import module_name</code>: Подключает модуль для использования
            в программе.
          </li>
          <li>
            <code>math.sqrt()</code>: Функция для вычисления квадратного корня.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Генераторы списков
        </h2>
        <CodeBlock
          code={`# Генерация списка квадратов чисел от 1 до 10
squares = [x ** 2 for x in range(1, 11)]
print("Квадраты чисел:", squares)`}
          output={`Квадраты чисел: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]`}
        />
        <p className="mb-4">
          Генераторы списков позволяют создавать новые списки на основе
          существующих коллекций:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>[expression for item in iterable]</code>: Основной синтаксис
            для генерации списка.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Обработка данных с использованием Pandas
        </h2>
        <CodeBlock
          code={`import pandas as pd

# Создание DataFrame
data = {'Name': ['Alice', 'Bob', 'Charlie'], 'Age': [25, 30, 35]}
df = pd.DataFrame(data)

# Вывод DataFrame
print("DataFrame:\n", df)

# Фильтрация данных
adults = df[df['Age'] > 30]
print("\nВзрослые:\n", adults)`}
          output={`DataFrame:
        Name  Age
0    Alice   25
1      Bob   30
2  Charlie   35

Взрослые:
      Name  Age
2  Charlie   35`}
        />
        <p className="mb-4">
          Pandas — это мощная библиотека для обработки и анализа данных:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>pd.DataFrame()</code>: Создание таблицы (DataFrame) из данных.
          </li>
          <li>
            <code>df['column']</code>: Доступ к столбцам DataFrame.
          </li>
          <li>
            <code>df[df['column'] &gt; value]</code>: Фильтрация строк по
            условию.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в классы и объекты
        </h2>
        <CodeBlock
          code={`class Car:
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year

    def start(self):
        print(f"{self.make} {self.model} {self.year} запускается!")

car = Car("Toyota", "Camry", 2020)
car.start()`}
          output={`Toyota Camry 2020 запускается!`}
        />
        <p className="mb-4">
          В Python классы используются для создания объектов, которые могут
          иметь свои данные и методы:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>__init__()</code>: Конструктор класса, инициализирует объект.
          </li>
          <li>
            <code>self</code>: Ссылка на текущий экземпляр класса.
          </li>
          <li>
            <code>car.start()</code>: Вызов метода объекта.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Завершение и запуск программы
        </h2>
        <p className="mb-4">
          Теперь вы знаете основы Python. Запуск программы выполняется напрямую
          без компиляции.
        </p>
        <p className="mb-4">Чтобы запустить Python-скрипт:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Сохраните код в файл с расширением <code>.py</code>, например{" "}
            <code>example.py</code>.
          </li>
          <li>Откройте терминал и перейдите в каталог с файлом.</li>
          <li>
            Выполните команду:
            <CodeBlock code={`python example.py`} output={`Это пример.`} />
          </li>
        </ul>
        <p>Python автоматически выполнит код и выведет результат.</p>
      </section>
    </div>
  );
}
