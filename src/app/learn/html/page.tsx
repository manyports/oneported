"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Copy, Eye } from "lucide-react";
import { useState } from "react";

const baseStyles = `
  body { 
    font-family: system-ui, sans-serif; 
    line-height: 1.5; 
    padding: 20px; 
    max-width: 100%;
    overflow-x: hidden;
  }
  h1 { font-size: 2.5em; margin-bottom: 0.5em; }
  h2 { font-size: 2em; margin-bottom: 0.5em; }
  h3 { font-size: 1.5em; margin-bottom: 0.5em; }
  p { margin-bottom: 1em; }
  a { color: #0000FF; text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul, ol { margin-bottom: 1em; padding-left: 2em; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid #ddd; padding: 8px; }
  img { max-width: 100%; height: auto; }
  pre { white-space: pre-wrap; word-wrap: break-word; }
  @media (max-width: 640px) {
  body { padding: 10px; }
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.1em; }
}
@media (min-width: 641px) and (max-width: 1024px) {
  body { padding: 15px; }
  h1 { font-size: 2em; }
  h2 { font-size: 1.7em; }
  h3 { font-size: 1.3em; }
}
`;

export default function HTMLTutorial() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [useBaseStyles, setUseBaseStyles] = useState(true);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({
    code,
    includeBaseStyles = true,
  }: {
    code: string;
    includeBaseStyles?: boolean;
  }) => (
    <div className="relative mb-4">
      <pre className="bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
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
              <Eye className="h-4 w-4 mr-2" />
              Предпросмотр
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto w-full">
            <DialogHeader>
              <DialogTitle>Предварительный просмотр</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="use-base-styles"
                checked={useBaseStyles}
                onCheckedChange={setUseBaseStyles}
              />
              <Label htmlFor="use-base-styles">
                Использовать базовые стили
              </Label>
            </div>
            <div className="border p-4 rounded-md overflow-x-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    includeBaseStyles && useBaseStyles
                      ? `<style>${baseStyles}</style>${code}`
                      : code,
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
      <div className="w-full max-w-3xl mx-auto px-4 py-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          Полное руководство по HTML
        </h1>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Введение в HTML
          </h2>
          <p className="mb-4">
            HTML (HyperText Markup Language) - это стандартный язык разметки для
            создания веб-страниц. Он используется для определения структуры и
            содержимого веб-документов, включая текст, изображения, ссылки и
            другие элементы.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Основная структура HTML документа
          </h2>
          <CodeBlock
            code={`<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заголовок страницы</title>
</head>
<body>
    <h1>Привет, мир!</h1>
    <p>Это базовая HTML страница.</p>
</body>
</html>`}
          />
          <p className="mb-4">
            Этот пример показывает базовую структуру HTML документа. Давайте
            разберем каждый элемент:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <code>!DOCTYPE html</code>: Объявляет, что это HTML5 документ.
            </li>
            <li>
              <code>html</code>: Корневой элемент HTML страницы.
            </li>
            <li>
              <code>head</code>: Содержит мета-информацию о документе.
            </li>
            <li>
              <code>meta charset="UTF-8"</code>: Указывает кодировку документа.
            </li>
            <li>
              <code>meta name="viewport"</code>: Контролирует отображение на
              мобильных устройствах.
            </li>
            <li>
              <code>title</code>: Заголовок страницы, отображаемый во вкладке
              браузера.
            </li>
            <li>
              <code>body</code>: Содержит видимое содержимое страницы.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Текстовые элементы</h2>
          <h3 className="text-xl font-semibold mb-2">Заголовки</h3>
          <p className="mb-4">
            HTML предоставляет шесть уровней заголовков, от <code>h1</code> до{" "}
            <code>h6</code>:
          </p>
          <CodeBlock
            code={`<h1>Это заголовок первого уровня</h1>
<h2>Это заголовок второго уровня</h2>
<h3>Это заголовок третьего уровня</h3>
<h4>Это заголовок четвертого уровня</h4>
<h5>Это заголовок пятого уровня</h5>
<h6>Это заголовок шестого уровня</h6>`}
          />

          <h3 className="text-xl font-semibold mb-2 mt-6">
            Параграфы и форматирование текста
          </h3>
          <CodeBlock
            code={`<p>Это обычный параграф текста.</p>
<p>Это параграф с <strong>жирным текстом</strong> и <em>курсивом</em>.</p>
<p>А это параграф с <mark>выделенным</mark> и <del>зачеркнутым</del> текстом.</p>`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ссылки и изображения</h2>
          <h3 className="text-xl font-semibold mb-2">Ссылки</h3>
          <CodeBlock
            code={`<p>
  <a href="https://www.example.com">Это ссылка на example.com</a>
</p>
<p>
  <a href="page.html">Относительная ссылка на страницу в том же каталоге</a>
</p>
<p>
  <a href="#section">Ссылка на элемент с id="section" на этой же странице</a>
</p>`}
          />

          <h3 className="text-xl font-semibold mb-2 mt-6">Изображения</h3>
          <CodeBlock
            code={`<img src="https://picsum.photos/200/300" alt="Случайное изображение">
<img src="https://picsum.photos/300/200" alt="Еще одно случайное изображение">`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Списки</h2>
          <h3 className="text-xl font-semibold mb-2">Маркированные списки</h3>
          <CodeBlock
            code={`<ul>
  <li>Элемент списка 1</li>
  <li>Элемент списка 2</li>
  <li>Элемент списка 3</li>
</ul>`}
          />

          <h3 className="text-xl font-semibold mb-2 mt-6">
            Нумерованные списки
          </h3>
          <CodeBlock
            code={`<ol>
  <li>Первый элемент списка</li>
  <li>Второй элемент списка</li>
  <li>Третий элемент списка</li>
</ol>`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Таблицы</h2>
          <CodeBlock
            code={`<table>
  <tr>
    <th>Заголовок 1</th>
    <th>Заголовок 2</th>
  </tr>
  <tr>
    <td>Ячейка 1</td>
    <td>Ячейка 2</td>
  </tr>
  <tr>
    <td>Ячейка 3</td>
    <td>Ячейка 4</td>
  </tr>
</table>`}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Формы</h2>
          <CodeBlock
            code={`<form>
    <div>
        <label for="name">Имя:</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div>
        <label for="message">Сообщение:</label>
        <textarea id="message" name="message"></textarea>
    </div>
    <button type="submit">Отправить</button>
</form>`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Семантические элементы HTML5
          </h2>
          <p className="mb-4">
            HTML5 ввел ряд семантических элементов, которые помогают лучше
            структурировать содержимое страницы:
          </p>
          <CodeBlock
            code={`<header>
    <h1>Заголовок сайта</h1>
    <nav>
        <ul>
            <li><a href="#home">Главная</a></li>
            <li><a href="#about">О нас</a></li>
            <li><a href="#contact">Контакты</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h2>Заголовок статьи</h2>
        <p>Содержание статьи...</p>
    </article>
    
    <aside>
        <h3>Дополнительная информация</h3>
        <p>Какой-то второстепенный контент...</p>
    </aside>
</main>

<footer>
    <p>&copy; 2023 Мой сайт. Все права защищены.</p>
</footer>`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Заключение</h2>
          <p className="mb-4">
            Это базовое введение в HTML. По мере изучения вы обнаружите много
            других элементов и атрибутов, которые помогут вам создавать более
            сложные и интерактивные веб-страницы. Не забывайте практиковаться и
            экспериментировать с различными элементами для лучшего понимания их
            работы.
          </p>
        </section>
      </div>
  );
}
