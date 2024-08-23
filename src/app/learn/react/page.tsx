"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import * as Babel from "@babel/standalone";
import { Copy, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function ReactTutorial() {
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
            <div id="react-root"></div>
          `;
        const root = document.getElementById("react-root");

        try {
          const fullCode = `${code}\nReactDOM.render(React.createElement(App), document.getElementById('react-root'));`;
          const transformedCode = Babel.transform(fullCode, {
            presets: ["react"],
          }).code;

          const App = new Function(
            "React",
            "ReactDOM",
            `
              ${transformedCode}
              return App;
            `
          )(React, ReactDOM);

          ReactDOM.render(React.createElement(App), root);
        } catch (error: any) {
          if (root) {
            root.innerHTML = `<pre>Error: ${error.message}</pre>`;
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
            className="w-full sm:w-auto"
            onClick={() => copyToClipboard(code)}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copiedCode === code ? "Скопировано!" : "Копировать"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
        Полное руководство по React
      </h1>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в React
        </h2>
        <p className="mb-4">
          React - это JavaScript библиотека для создания пользовательских
          интерфейсов. Она позволяет создавать сложные UI из небольших и
          изолированных частей кода, называемых компонентами.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Компоненты и JSX
        </h2>
        <p className="mb-4">
          Компоненты - это строительные блоки любого React-приложения. Компонент
          - это JavaScript функция, которая возвращает JSX (JavaScript XML) -
          расширение синтаксиса JavaScript.
        </p>
        <CodeBlock
          initialCode={`function App() {
  return (
    <div>
      <h1>Привет, мир!</h1>
      <p>Это мой первый React компонент.</p>
    </div>
  );
}

`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Props</h2>
        <p className="mb-4">
          Props (сокращение от "properties") - это способ передачи данных от
          родительского компонента к дочернему.
        </p>
        <CodeBlock
          initialCode={`function Greeting(props) {
  return <h1>Привет, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Greeting name="Алиса" />
      <Greeting name="Боб" />
    </div>
  );
}

`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Хуки</h2>
        <p className="mb-4">
          Хуки - это функции, которые позволяют вам использовать состояние и
          другие возможности React без написания классов.
        </p>
        <Tabs defaultValue="useState">
          <TabsList>
            <TabsTrigger value="useState">useState</TabsTrigger>
            <TabsTrigger value="useEffect">useEffect</TabsTrigger>
            <TabsTrigger value="useContext">useContext</TabsTrigger>
          </TabsList>
          <TabsContent value="useState">
            <p className="mb-4">
              useState позволяет добавить состояние в функциональные компоненты.
            </p>
            <CodeBlock
              initialCode={`function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>Вы кликнули {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Нажми меня
      </button>
    </div>
  );
}
`}
            />
          </TabsContent>
          <TabsContent value="useEffect">
            <p className="mb-4">
              useEffect позволяет выполнять побочные эффекты в функциональных
              компонентах.
            </p>
            <CodeBlock
              initialCode={`function App() {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>Прошло секунд: {seconds}</div>;
}
`}
            />
          </TabsContent>
          <TabsContent value="useContext">
            <p className="mb-4">
              useContext позволяет использовать контекст React для передачи
              данных через дерево компонентов без необходимости передавать
              пропсы на промежуточных уровнях.
            </p>
            <CodeBlock
              initialCode={`const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = React.useContext(ThemeContext);
  return <button style={{background: theme === 'dark' ? 'black' : 'white', color: theme === 'dark' ? 'white' : 'black'}}>
    Я стилизован темой {theme}
  </button>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

`}
            />
          </TabsContent>
        </Tabs>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Обработка событий
        </h2>
        <p className="mb-4">
          React позволяет легко добавлять обработчики событий к элементам в JSX.
        </p>
        <CodeBlock
          initialCode={`function App() {
  const handleClick = () => {
    alert('Кнопка была нажата!');
  };

  return <button onClick={handleClick}>Нажми меня</button>;
}
`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Условный рендеринг
        </h2>
        <p className="mb-4">
          В React вы можете создавать различные компоненты, которые
          инкапсулируют необходимое вам поведение. Затем вы можете рендерить
          только некоторые из них, в зависимости от состояния вашего приложения.
        </p>
        <CodeBlock
          initialCode={`function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>С возвращением!</h1>;
  }
  return <h1>Пожалуйста, войдите.</h1>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Выйти' : 'Войти'}
      </button>
    </div>
  );
}

`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Списки и ключи
        </h2>
        <p className="mb-4">
          При работе со списками в React важно использовать ключи для
          оптимизации производительности.
        </p>
        <CodeBlock
          initialCode={`function App() {
  const todos = ['Изучить React', 'Создать приложение', 'Развернуть приложение'];

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}
`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Формы</h2>
        <p className="mb-4">
          React позволяет создавать интерактивные формы с использованием
          состояния компонента.
        </p>
        <CodeBlock
          initialCode={`function App() {
  const [name, setName] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Отправленное имя: ' + name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Имя:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <input type="submit" value="Отправить" />
    </form>
  );
}
`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Заключение</h2>
        <p className="mb-4">
          Это базовое введение в React. По мере изучения вы обнаружите много
          других возможностей, таких как работа с API, маршрутизация, управление
          состоянием приложения и многое другое. React предоставляет мощные
          инструменты для создания сложных и интерактивных пользовательских
          интерфейсов.
        </p>
      </section>
    </div>
  );
}
