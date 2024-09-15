import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import * as Babel from "@babel/standalone";
import { Copy, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";

const CodeBlock: React.FC<{ initialCode: string }> = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { theme } = useTheme();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
        const fullCode = `
          import React from 'react';
          import ReactDOM from 'react-dom';
          ${code}
          ReactDOM.render(React.createElement(App), document.getElementById('react-root'));
        `;
        const transformedCode = Babel.transform(fullCode, {
          presets: ["react", "typescript"],
        }).code;

        // Use Function constructor to create a new function from the transformed code
        new Function("React", "ReactDOM", transformedCode)(React, ReactDOM);
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

const NextJSTutorial: React.FC = () => {
  return (
    <div className="max-w-full sm:max-w-3xl mx-auto px-4 py-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        Полное руководство по Next.js
      </h1>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в Next.js
        </h2>
        <p className="mb-4">
          Next.js - это фреймворк для React, который позволяет легко создавать
          серверные и статически генерируемые приложения.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Структура проекта
        </h2>
        <p className="mb-4">
          Next.js использует файловую структуру для маршрутизации, где каждая
          страница представляет собой файл в папке <code>pages</code>.
        </p>
        <CodeBlock
          initialCode={`import React from 'react';
import Link from 'next/link';

const App: React.FC = () => {
  return (
    <div>
      <h1>Добро пожаловать в Next.js!</h1>
      <p>Это главная страница.</p>
      <Link href="/about">
        <a>Узнать больше о нас</a>
      </Link>
    </div>
  );
};

export default App;`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Клиентские компоненты
        </h2>
        <p className="mb-4">
          Вы можете использовать клиентские компоненты для интерактивных
          элементов, таких как формы и кнопки.
        </p>
        <CodeBlock
          initialCode={`import React, { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Текущее значение: {count}</p>
      <button onClick={() => setCount(count + 1)}>Увеличить</button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <h1>Добро пожаловать в Next.js!</h1>
      <Counter />
    </div>
  );
};

export default App;`}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Заключение</h2>
        <p className="mb-4">
          Мы рассмотрели основные концепции и функции Next.js, включая создание
          проекта, структуру папок, маршрутизацию и использование клиентских
          компонентов. Используя эти знания, вы сможете создавать мощные и
          современные веб-приложения с помощью Next.js.
        </p>
      </section>
    </div>
  );
};

export default NextJSTutorial;
