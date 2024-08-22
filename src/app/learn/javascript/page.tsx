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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export default function JavaScriptTutorial() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { theme } = useTheme();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ initialCode }: { initialCode: string }) => {
    const [code, setCode] = useState(initialCode);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const executeCode = useCallback(() => {
      const previewDiv = document.getElementById("preview-content");
      if (previewDiv) {
        previewDiv.innerHTML = `
          <style>
            #preview-content * {
              color: ${theme === "dark" ? "white" : "black"};
            }
          </style>
          <div id="js-playground"></div>
          <pre id="js-output"></pre>
        `;
        const playground = document.getElementById("js-playground");
        const output = document.getElementById("js-output");

        try {
          const originalLog = console.log;
          console.log = (...args) => {
            if (output) {
              output.innerHTML +=
                args
                  .map((arg) =>
                    typeof arg === "object" ? JSON.stringify(arg) : arg
                  )
                  .join(" ") + "\n";
            }
            originalLog(...args);
          };
          new Function("playground", code)(playground);
          console.log = originalLog;
        } catch (error: any) {
          if (output) {
            output.innerHTML = `Error: ${error.message}`;
          }
        }
      }
    }, [code, theme]);

    useEffect(() => {
      if (isDialogOpen) {
        executeCode();
      }
    }, [isDialogOpen, executeCode]);

    useEffect(() => {
      const debounceTimer = setTimeout(() => {
        if (isDialogOpen) {
          executeCode();
        }
      }, 500);

      return () => clearTimeout(debounceTimer);
    }, [code, isDialogOpen, executeCode]);

    return (
      <div className="relative mb-4">
        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
          <code>{code}</code>
        </pre>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(code)}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copiedCode === code ? "Скопировано!" : "Копировать"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Предпросмотр
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full sm:max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto w-full">
              <DialogHeader>
                <DialogTitle>Предпросмотр кода</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-sm min-h-[300px]"
                />
                <div
                  className={`border p-4 rounded-md ${
                    theme === "dark"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    Результат выполнения:
                  </h3>
                  <div id="preview-content" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 py-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        Полное руководство по JavaScript
      </h1>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в JavaScript
        </h2>
        <p className="mb-4">
          JavaScript - это мощный, интерпретируемый язык программирования,
          который позволяет добавлять интерактивность на веб-страницы. Он
          является одним из трех основных языков веб-разработки, наряду с HTML и
          CSS.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Переменные и типы данных
        </h2>
        <p className="mb-4">
          В JavaScript есть несколько способов объявления переменных:{" "}
          <code>var</code>, <code>let</code> и <code>const</code>. JavaScript -
          динамически типизированный язык, что означает, что переменные могут
          хранить значения разных типов.
        </p>
        <CodeBlock
          initialCode={`// Объявление переменных
let name = "John";
const age = 30;
var isStudent = true;

// Вывод значений
console.log("Имя:", name);
console.log("Возраст:", age);
console.log("Студент:", isStudent);

// Изменение значения
name = "Jane";
console.log("Новое имя:", name);

// Попытка изменить константу вызовет ошибку
// age = 31; // Раскомментируйте эту строку, чтобы увидеть ошибку

// Типы данных
console.log("Тип name:", typeof name);
console.log("Тип age:", typeof age);
console.log("Тип isStudent:", typeof isStudent);`}
        />

        <h3 className="text-lg font-semibold mt-4 mb-2">
          Основные типы данных в JavaScript
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Тип</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Пример</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>String</TableCell>
              <TableCell>Текстовые данные</TableCell>
              <TableCell>
                <code>"Hello"</code> или <code>'World'</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>
                Числовые данные (целые и с плавающей точкой)
              </TableCell>
              <TableCell>
                <code>42</code> или <code>3.14</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Boolean</TableCell>
              <TableCell>Логические значения</TableCell>
              <TableCell>
                <code>true</code> или <code>false</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Undefined</TableCell>
              <TableCell>
                Переменная объявлена, но значение не присвоено
              </TableCell>
              <TableCell>
                <code>undefined</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Null</TableCell>
              <TableCell>Намеренное отсутствие значения</TableCell>
              <TableCell>
                <code>null</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Object</TableCell>
              <TableCell>Сложный тип данных для хранения коллекций</TableCell>
              <TableCell>
                <code>{'{ name: "John", age: 30 }'}</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Array</TableCell>
              <TableCell>Упорядоченный список значений</TableCell>
              <TableCell>
                <code>[1, 2, 3, 4]</code>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Операторы</h2>
        <p className="mb-4">
          JavaScript поддерживает различные типы операторов для выполнения
          операций над переменными и значениями.
        </p>
        <CodeBlock
          initialCode={`// Арифметические операторы
let a = 10;
let b = 3;
console.log("a + b =", a + b);
console.log("a - b =", a - b);
console.log("a * b =", a * b);
console.log("a / b =", a / b);
console.log("a % b =", a % b);

// Операторы сравнения
console.log("a > b:", a > b);
console.log("a < b:", a < b);
console.log("a >= b:", a >= b);
console.log("a <= b:", a <= b);
console.log("a === b:", a === b);
console.log("a !== b:", a !== b);

// Логические операторы
let x = true;
let y = false;
console.log("x && y:", x && y);
console.log("x || y:", x || y);
console.log("!x:", !x);

// Оператор объединения с null (??)
let value = null;
let defaultValue = "Default";
console.log("value ?? defaultValue:", value ?? defaultValue);`}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Функции</h2>
        <p className="mb-4">
          Функции в JavaScript позволяют организовывать код, делая его более
          структурированным и повторно используемым. Вот несколько примеров:
        </p>
        <CodeBlock
          initialCode={`// Объявление функции
function greet(name) {
  return "Привет, " + name + "!";
}

// Вызов функции
console.log(greet("Мир"));

// Функция с параметрами по умолчанию
function greetWithDefault(name = "Гость") {
  return "Привет, " + name + "!";
}

console.log(greetWithDefault());
console.log(greetWithDefault("Алекс"));

// Стрелочные функции
const add = (a, b) => a + b;
console.log("Результат сложения:", add(5, 3));`}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Объекты и массивы
        </h2>
        <p className="mb-4">
          Объекты и массивы являются ключевыми структурами данных в JavaScript.
          Вот несколько примеров работы с ними:
        </p>
        <CodeBlock
          initialCode={`// Создание объекта
const person = {
  name: "John",
  age: 30,
  greet() {
    console.log("Привет, меня зовут " + this.name);
  }
};

// Доступ к свойствам объекта
console.log("Имя:", person.name);
console.log("Возраст:", person.age);
person.greet();

// Создание массива
const numbers = [1, 2, 3, 4, 5];

// Доступ к элементам массива
console.log("Первый элемент:", numbers[0]);
console.log("Последний элемент:", numbers[numbers.length - 1]);

// Добавление и удаление элементов массива
numbers.push(6);
console.log("Массив после добавления элемента:", numbers);
numbers.pop();
console.log("Массив после удаления элемента:", numbers);`}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Циклы</h2>
        <p className="mb-4">
          Циклы позволяют повторять выполнение блока кода определённое
          количество раз или до тех пор, пока выполняется условие.
        </p>
        <CodeBlock
          initialCode={`// Цикл for
for (let i = 0; i < 5; i++) {
  console.log("Цикл for, итерация:", i);
}

// Цикл while
let count = 0;
while (count < 5) {
  console.log("Цикл while, значение count:", count);
  count++;
}

// Цикл do...while
let j = 0;
do {
  console.log("Цикл do...while, итерация:", j);
  j++;
} while (j < 5);`}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Асинхронное программирование
        </h2>
        <p className="mb-4">
          Асинхронное программирование позволяет выполнять операции, которые
          могут занять некоторое время, без блокировки основного потока
          выполнения кода.
        </p>
        <CodeBlock
          initialCode={`// Пример с использованием setTimeout
console.log("Начало");

setTimeout(() => {
  console.log("Асинхронная операция выполнена");
}, 2000);

console.log("Конец");

// Работа с промисами
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Данные получены");
    }, 3000);
  });
};

fetchData().then((data) => {
  console.log(data);
}).catch((error) => {
  console.error("Ошибка:", error);
});

// Асинхронная функция (async/await)
async function getData() {
  try {
    const data = await fetchData();
    console.log("Данные:", data);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

getData();`}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Модули (В одном файле)
        </h2>
        <p className="mb-4">
          В среде с поддержкой нескольких файлов можно было бы разделить код на
          модули. В данном случае мы симулируем модули в одном файле, используя
          функции для разделения логики.
        </p>
        <CodeBlock
          initialCode={`// "Экспорт" функции (условно)
// Пример: В отдельном файле greet.js
// export function greet(name) {
//   return "Привет, " + name + "!";
// }

// "Импорт" функции (в текущем файле)
// Пример: В другом файле main.js
// import { greet } from './greet.js';
// console.log(greet("Мир"));

// В нашем случае все в одном файле:
function greet(name) {
  return "Привет, " + name + "!";
}

console.log(greet("Мир"));`}
        />
        <p className="mt-4">
          В более сложных сценариях можно организовывать код в модули, а затем
          объединять их в один файл с помощью различных сборщиков.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Обработка ошибок
        </h2>
        <p className="mb-4">
          Обработка ошибок важна для предотвращения сбоев в работе приложения и
          улучшения пользовательского опыта.
        </p>
        <CodeBlock
          initialCode={`// Обработка ошибок с использованием try...catch
try {
  // Потенциально опасный код
  let result = 10 / 0;
  if (result === Infinity) {
    throw new Error("Деление на ноль!");
  }
  console.log("Результат:", result);
} catch (error) {
  console.error("Ошибка:", error.message);
} finally {
  console.log("Этот блок выполнится в любом случае");
}

// Пример с использованием асинхронной функции
async function fetchData() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Ошибка сети");
    }
    let data = await response.json();
    console.log("Данные получены:", data);
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error.message);
  }
}

fetchData();`}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Манипуляция с DOM
        </h2>
        <p className="mb-4">
          JavaScript позволяет динамически изменять содержимое и стили
          HTML-элементов. Вот пример, демонстрирующий некоторые базовые
          манипуляции с DOM:
        </p>
        <CodeBlock
          initialCode={`// Создаем новый элемент
const newElement = document.createElement('div');
newElement.textContent = 'Это новый элемент, созданный с помощью JavaScript';
newElement.style.color = 'blue';
newElement.style.marginBottom = '10px';
playground.appendChild(newElement);

// Изменяем существующий элемент
const existingElement = document.createElement('p');
existingElement.textContent = 'Это существующий элемент';
playground.appendChild(existingElement);

setTimeout(() => {
  existingElement.style.backgroundColor = 'yellow';
  existingElement.textContent = 'Текст и стиль этого элемента были изменены';
}, 2000);

// Добавляем обработчик события
const button = document.createElement('button');
button.textContent = 'Нажми меня';
button.addEventListener('click', () => {
  alert('Кнопка была нажата!');
});
playground.appendChild(button);

console.log('Код выполнен успешно!');`}
        />
      </section>
    </div>
  );
}
