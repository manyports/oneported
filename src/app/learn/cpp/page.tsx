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
import { Copy, Terminal } from "lucide-react";
import { useState } from "react";

export default function CPPTutorial() {
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
          onClick={() => copyToClipboard(code)}
        >
          <Copy className="h-4 w-4 mr-2" />
          {copiedCode === code ? "Скопировано!" : "Копировать"}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Terminal className="h-4 w-4 mr-2" />
              Компилировать
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto w-full">
            <DialogHeader>
              <DialogTitle>Результат компиляции</DialogTitle>
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
        Полное руководство по C++
      </h1>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в C++
        </h2>
        <p className="mb-4">
          C++ - это мощный объектно-ориентированный язык программирования,
          разработанный Бьярне Страуструпом как расширение языка C. C++
          предоставляет возможности для низкоуровневого манипулирования памятью,
          высокопроизводительных вычислений и создания крупномасштабных
          программных систем.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Основная структура программы на C++
        </h2>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    cout << "Привет, мир!" << endl;
    return 0;
}`}
          output={`$ g++ hello_world.cpp -o hello_world
$ ./hello_world
Привет, мир!`}
        />
        <p className="mb-4">
          Это простейшая программа на C++. Давайте разберем каждую строку:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>#include &lt;iostream&gt;</code>: Подключает библиотеку для
            ввода-вывода.
          </li>
          <li>
            <code>using namespace std;</code>: Позволяет избежать явного
            указания пространства имен <code>std</code> перед каждой функцией.
          </li>
          <li>
            <code>int main()</code>: Основная функция, с которой начинается
            выполнение программы.
          </li>
          <li>
            <code>cout &lt;&lt; "Привет, мир!" &lt;&lt; endl;</code>: Выводит
            текст на экран.
          </li>
          <li>
            <code>return 0;</code>: Завершает программу и возвращает код
            успешного выполнения.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Переменные и типы данных
        </h2>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    int age = 25;
    double height = 1.75;
    char grade = 'A';
    bool isStudent = true;

    cout << "Возраст: " << age << endl;
    cout << "Рост: " << height << " м" << endl;
    cout << "Оценка: " << grade << endl;
    cout << "Студент: " << (isStudent ? "Да" : "Нет") << endl;

    return 0;
}`}
          output={`$ g++ variables.cpp -o variables
$ ./variables
Возраст: 25
Рост: 1.75 м
Оценка: A
Студент: Да`}
        />
        <p className="mb-4">
          C++ поддерживает различные типы данных. Вот некоторые из основных:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>int</code>: Целые числа
          </li>
          <li>
            <code>double</code>: Числа с плавающей точкой
          </li>
          <li>
            <code>char</code>: Символы
          </li>
          <li>
            <code>bool</code>: Логические значения (true/false)
          </li>
          <li>
            <code>string</code>: Строки (требуется подключение &lt;string&gt;)
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Условные операторы
        </h2>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    int number = 10;

    if (number > 0) {
        cout << "Число положительное" << endl;
    } else if (number < 0) {
        cout << "Число отрицательное" << endl;
    } else {
        cout << "Число равно нулю" << endl;
    }

    return 0;
}`}
          output={`$ g++ conditions.cpp -o conditions
$ ./conditions
Число положительное`}
        />
        <p className="mb-4">
          Условные операторы позволяют выполнять различные действия в
          зависимости от условий.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Циклы</h2>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    // Цикл for
    for (int i = 0; i < 5; i++) {
        cout << i << " ";
    }
    cout << endl;

    // Цикл while
    int j = 0;
    while (j < 5) {
        cout << j << " ";
        j++;
    }
    cout << endl;

    return 0;
}`}
          output={`$ g++ loops.cpp -o loops
$ ./loops
0 1 2 3 4 
0 1 2 3 4`}
        />
        <p className="mb-4">
          C++ поддерживает несколько типов циклов для повторения действий:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>for</code>: Используется, когда известно количество итераций
          </li>
          <li>
            <code>while</code>: Выполняется, пока условие истинно
          </li>
          <li>
            <code>do-while</code>: Похож на while, но гарантирует хотя бы одно
            выполнение
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Одномерные массивы
        </h2>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    int numbers[5] = {1, 2, 3, 4, 5};

    for (int i = 0; i < 5; i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;

    return 0;
}`}
          output={`$ g++ one_dimensional_array.cpp -o one_dimensional_array
$ ./one_dimensional_array
1 2 3 4 5`}
        />
        <p className="mb-4">
          Одномерный массив в C++ позволяет хранить несколько значений одного
          типа в одном массиве. В примере:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>int numbers[5]</code>: Объявляет массив из пяти целых чисел.
          </li>
          <li>
            <code>numbers[i]</code>: Обращение к элементу массива по индексу.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Двумерные массивы
        </h2>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}`}
          output={`$ g++ two_dimensional_array.cpp -o two_dimensional_array
$ ./two_dimensional_array
1 2 3
4 5 6`}
        />
        <p className="mb-4">
          Двумерный массив в C++ представляет собой массив массивов, что
          позволяет хранить данные в виде таблицы:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>int matrix[2][3]</code>: Объявляет двумерный массив с 2
            строками и 3 столбцами.
          </li>
          <li>
            <code>matrix[i][j]</code>: Обращение к элементу массива по индексам.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Закрепление знаний
        </h2>
        <p className="mb-4">
          Теперь давайте попробуем решить несколько задач, чтобы закрепить
          пройденный материал:
        </p>

        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Задача 1: Сумма элементов массива
        </h3>
        <p className="mb-4">
          Напишите программу, которая вычисляет сумму всех элементов в
          одномерном массиве из 5 целых чисел.
        </p>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    int numbers[5] = {1, 2, 3, 4, 5};
    int sum = 0;

    for (int i = 0; i < 5; i++) {
        sum += numbers[i];
    }

    cout << "Сумма элементов массива: " << sum << endl;

    return 0;
}`}
          output={`$ g++ sum_array.cpp -o sum_array
$ ./sum_array
Сумма элементов массива: 15`}
        />

        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Задача 2: Поиск максимального элемента в двумерном массиве
        </h3>
        <p className="mb-4">
          Напишите программу, которая находит максимальное значение в двумерном
          массиве размером 3x3.
        </p>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

int main() {
    int matrix[3][3] = {
        {3, 8, 2},
        {7, 1, 5},
        {6, 4, 9}
    };
    int maxVal = matrix[0][0];

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (matrix[i][j] > maxVal) {
                maxVal = matrix[i][j];
            }
        }
    }

    cout << "Максимальное значение в массиве: " << maxVal << endl;

    return 0;
}`}
          output={`$ g++ max_in_array.cpp -o max_in_array
$ ./max_in_array
Максимальное значение в массиве: 9`}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Функции</h2>
        <CodeBlock
          code={`#include <iostream>
#include <string>
using namespace std;

int add(int a, int b) {
    return a + b;
}

void printMessage(string message) {
    cout << message << endl;
}

int main() {
        int result = add(5, 3);
    cout << "5 + 3 = " << result << endl;

    printMessage("Привет, функции!");

    return 0;
}
`}
          output={`$ g++ functions.cpp -o functions
$ ./functions
5 + 3 = 8
Привет, функции!`}
        />
        <p className="mb-4">
          Функции в C++ позволяют структурировать код и повторно использовать
          логику. В примере:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>int add(int a, int b)</code>: Возвращает сумму двух чисел.
          </li>
          <li>
            <code>void printMessage(string message)</code>: Выводит строку на
            экран.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в объекты и классы
        </h2>
        <CodeBlock
          code={`#include <iostream>
using namespace std;

class Dog {
public:
    string name;
    int age;

    void bark() {
        cout << name << " говорит: Гав-гав!" << endl;
    }
};

int main() {
    Dog myDog;
    myDog.name = "Бобик";
    myDog.age = 3;
    myDog.bark();

    return 0;
}`}
          output={`$ g++ classes.cpp -o classes
$ ./classes
Бобик говорит: Гав-гав!`}
        />
        <p className="mb-4">
          C++ поддерживает объектно-ориентированное программирование (ООП).
          Классы позволяют объединять данные и методы для работы с ними:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>class Dog</code>: Определяет класс с полями <code>name</code>{" "}
            и <code>age</code>.
          </li>
          <li>
            <code>void bark()</code>: Метод класса, выводящий сообщение на
            экран.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Завершение и компиляция
        </h2>
        <p className="mb-4">
          Теперь вы знаете основы языка C++. Компиляция программы выполняется
          через командную строку с помощью компилятора, такого как{" "}
          <code>g++</code>.
        </p>
      </section>
    </div>
  );
}
