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

const htmlPreviews = {
  basicCSS: `<div class="container">
    <h1>Заголовок первого уровня</h1>
    <p>Это параграф с <strong>жирным текстом</strong> и <em>курсивом</em>.</p>
    <a href="#">Это ссылка</a>
    <div class="box">Это блок</div>
  </div>`,
  selectors: `<div class="box">Box with class</div>
<div id="unique-box">Box with ID</div>`,
  layouts: `<div class="flex-container">
    <div class="flex-item">Item 1</div>
    <div class="flex-item">Item 2</div>
    <div class="flex-item">Item 3</div>
  </div>
  <div class="grid-container">
    <div class="grid-item">Item 1</div>
    <div class="grid-item">Item 2</div>
    <div class="grid-item">Item 3</div>
    <div class="grid-item">Item 4</div>
  </div>`,
  animations: `<div class="animated-box">Animated Box</div>`,
  transformations: `<div class="transform">Rotated Box</div>`,
  pseudoClasses: `<a href="#" class="link">Hover over me</a><input type="text" class="input" placeholder="Focus on me" />`,
  pseudoElements: `<p class="pseudo-element">This paragraph has a pseudo-element</p>`,
};

export default function CSSTutorial() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [useBaseStyles, setUseBaseStyles] = useState(true);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({
    code,
    previewKey,
    includeBaseStyles = true,
  }: {
    code: string;
    previewKey: keyof typeof htmlPreviews;
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
            <div className="border p-4 rounded-md preview-container mt-4">
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
        Полное руководство по CSS
      </h1>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Введение в CSS
        </h2>
        <p className="mb-4">
          CSS (Cascading Style Sheets) - это язык стилей, который используется
          для оформления веб-страниц. Он позволяет задавать стили для HTML
          элементов, таких как цвет, шрифт, расположение и многие другие
          свойства.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Встроенные стили (Inline CSS)
        </h2>
        <p className="mb-4">
          Встроенные стили применяются непосредственно к HTML элементам с
          помощью атрибута <code>style</code>. Этот метод удобен для быстрого
          применения стилей, но менее предпочтителен для крупных проектов.
        </p>
        <CodeBlock
          code={`<p style="color: red; font-weight: bold;">Это текст с встроенным стилем</p>`}
          previewKey="basicCSS"
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Внутренние стили (Internal CSS)
        </h2>
        <p className="mb-4">
          Внутренние стили задаются в разделе <code>&lt;style&gt;</code> внутри
          HTML документа. Этот метод полезен для стилей, которые применяются
          только на одной странице.
        </p>
        <CodeBlock
          code={`<style>
  p {
    color: blue;
    font-size: 18px;
  }
</style>
<p>Это текст с внутренними стилями</p>`}
          previewKey="basicCSS"
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Внешние стили (External CSS)
        </h2>
        <p className="mb-4">
          Внешние стили подключаются к HTML документу с помощью тега
          <code>&lt;link&gt;</code>. Это наиболее предпочтительный метод для
          крупных проектов, так как позволяет разделять контент и оформление.
        </p>
        <CodeBlock
          code={`<link rel="stylesheet" href="styles.css">
<p class="styled-text">Это текст с внешними стилями</p>`}
          previewKey="basicCSS"
        />
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Цвета и Шрифты
        </h2>
        <CodeBlock
          code={`<style>
.text-color {
  color: #3498db;
}
.background-color {
  background-color: #ecf0f1;
}
.font-size {
  font-size: 20px;
}
.font-family {
  font-family: 'Arial', sans-serif;
}
</style>

<p class="text-color">Этот текст окрашен в синий цвет.</p>
<div class="background-color">Этот блок имеет светло-серый фон.</div>
<p class="font-size">Этот текст имеет увеличенный размер шрифта.</p>
<p class="font-family">Этот текст использует определенный шрифт.</p>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          В этом разделе рассмотрены свойства для задания цвета текста, фона,
          размера шрифта и шрифта. Свойство <code>color</code> задает цвет
          текста, <code>background-color</code> — цвет фона,{" "}
          <code>font-size</code> — размер шрифта, а <code>font-family</code> —
          шрифт.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Модель Коробки (Box Model)
        </h2>
        <CodeBlock
          code={`<style>
.box-model {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #333;
  margin: 15px;
  background-color: #f39c12;
}
</style>

<div class="box-model">Пример модели коробки</div>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          Модель коробки описывает как браузер рассчитывает размеры элементов.
          Она включает в себя ширину, высоту, внутренние отступы (padding),
          границы (border) и внешние отступы (margin). Это важное понятие для
          понимания расположения и размеров элементов на странице.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Flexbox Layout
        </h2>
        <CodeBlock
          code={`<style>
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #2ecc71;
}
.flex-item {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
}
</style>

<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          Flexbox — это метод для создания макетов, который позволяет легко
          выравнивать элементы и управлять их пространством внутри контейнера.
          Свойство <code>display: flex</code> используется для включения
          Flexbox, а <code>justify-content</code> и <code>align-items</code>{" "}
          управляют выравниванием элементов.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Грид Layout</h2>
        <CodeBlock
          code={`<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.grid-item {
  background-color: #9b59b6;
  color: white;
  padding: 20px;
  border-radius: 5px;
}
</style>

<div class="grid-container">
  <div class="grid-item">Grid Item 1</div>
  <div class="grid-item">Grid Item 2</div>
  <div class="grid-item">Grid Item 3</div>
</div>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          Грид Layout позволяет создавать сложные макеты с помощью сетки.
          Свойство <code>display: grid</code> активирует Грид, а{" "}
          <code>grid-template-columns</code> и <code>gap</code> управляют
          количеством колонок и промежутками между элементами.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Медиа Запросы
        </h2>
        <CodeBlock
          code={`<style>
.responsive-text {
  font-size: 16px;
}
@media (min-width: 768px) {
  .responsive-text {
    font-size: 24px;
  }
}
@media (min-width: 1024px) {
  .responsive-text {
    font-size: 32px;
  }
}
</style>

<p class="responsive-text">Размер этого текста меняется в зависимости от ширины экрана.</p>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          Медиа запросы позволяют применять стили в зависимости от характеристик
          устройства, таких как ширина экрана. Это позволяет создать адаптивный
          дизайн, который изменяется в зависимости от размеров экрана.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Отступы и Паддинги
        </h2>
        <CodeBlock
          code={`<style>
.margin-padding-example {
  margin: 20px;
  padding: 15px;
  background-color: #3498db;
  color: white;
}
</style>

<div class="margin-padding-example">Этот блок имеет отступы и паддинги.</div>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          Отступы (margin) и паддинги (padding) управляют пространством вокруг
          элементов. Отступы создают пространство вне границ элемента, а
          паддинги — внутри границ элемента.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Селекторы и Свойства
        </h2>
        <CodeBlock
          code={`<style>
p {
  color: green;
  font-size: 16px;
}
</style>

<p>Это текст параграфа.</p>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          CSS селекторы используются для выбора элементов на странице, к которым
          будут применяться стили. Свойства определяют, как выбранные элементы
          будут стилизованы. Например, селектор <code>p</code> выбирает все
          абзацы, а свойство <code>color</code> изменяет их цвет.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Классы и Идентификаторы
        </h2>
        <CodeBlock
          code={`<style>
.text-green {
  color: green;
}
#main-title {
  font-size: 24px;
  font-weight: bold;
}
</style>

<h1 id="main-title">Главный Заголовок</h1>
<p class="text-green">Текст с классом text-green.</p>`}
          previewKey="selectors"
        />
        <p className="mb-4">
          Классы и идентификаторы позволяют применить стили к определенным
          элементам. Классы обозначаются через точку (<code>.</code>), а
          идентификаторы через решетку (<code>#</code>). Классы можно
          использовать многократно, а идентификаторы должны быть уникальными для
          каждого элемента.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Порядок Применения Стили
        </h2>
        <CodeBlock
          code={`<style>
#main-title {
  color: blue;
}

h1 {
  color: red;
}
</style>

<h1 id="main-title">Этот заголовок будет синим</h1>`}
          previewKey="selectors"
        />
        <p className="mb-4">
          CSS использует каскадный порядок для применения стилей. Это означает,
          что если к элементу применяются несколько стилей, будет использован
          стиль с большей специфичностью или последний по порядку. Важно
          понимать, как работает специфичность, чтобы правильно управлять
          стилями.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Наследование</h2>
        <CodeBlock
          code={`<style>
div {
  color: blue;
}

p {
  font-size: 18px;
}
</style>

<div>
  <p>Это параграф внутри div.</p>
</div>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          В CSS некоторые свойства наследуются дочерними элементами от своих
          родительских элементов. Это означает, что дочерний элемент может
          автоматически принимать стили от родителя, если они не переопределены.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Группировка Селекторов
        </h2>
        <CodeBlock
          code={`<style>
h1, h2, h3 {
  color: navy;
  font-family: Arial, sans-serif;
}
</style>

<h1>Заголовок H1</h1>
<h2>Заголовок H2</h2>
<h3>Заголовок H3</h3>`}
          previewKey="basicCSS"
        />
        <p className="mb-4">
          Для применения одного и того же стиля к нескольким элементам можно
          использовать группировку селекторов. Это упрощает код и снижает
          количество повторяющихся стилей.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Макеты и Выравнивание
        </h2>
        <CodeBlock
          code={`<style>
.flex-container {
  display: flex;
  justify-content: space-around;
}
.flex-item {
  background-color: pink;
  padding: 10px;
  margin: 5px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.grid-item {
  background-color: lightcoral;
  padding: 10px;
}
</style>

<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>
<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <div class="grid-item">Item 4</div>
</div>`}
          previewKey="layouts"
        />
        <p className="mb-4">
          В этом разделе рассмотрены методы выравнивания элементов с помощью{" "}
          <code>flexbox</code> и <code>grid</code> макетов.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Анимации</h2>
        <CodeBlock
          code={`<style>
.animated-box {
width: 100px;
height: 100px;
background-color: purple;
animation: spin 2s linear infinite;
}
@keyframes spin {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}
</style>

<div class="animated-box">Animated Box</div>`}
          previewKey="animations"
        />
        <p className="mb-4">
          Пример CSS анимации с использованием @keyframes для вращения элемента.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Трансформации
        </h2>
        <CodeBlock
          code={`<style>
.transform {
width: 100px;
height: 100px;
background-color: teal;
transform: rotate(45deg);
}
</style>

<div class="transform">Rotated Box</div>`}
          previewKey="transformations"
        />
        <p className="mb-4">
          Пример применения CSS трансформаций для изменения формы элемента.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Псевдоклассы</h2>
        <CodeBlock
          code={`<style>
.link {
  color: blue;
  text-decoration: none;
}
.link:hover {
  color: red;
  text-decoration: underline;
}
.input {
  padding: 8px;
  border: 1px solid #ccc;
}
.input:focus {
  border-color: blue;
  outline: none;
}
</style>

<a href="#" class="link">Hover over me</a>
<input type="text" class="input" placeholder="Focus on me" />`}
          previewKey="pseudoClasses"
        />
        <p className="mb-4">
          Псевдоклассы позволяют изменять стили элементов в зависимости от их
          состояния. В этом примере использованы псевдоклассы{" "}
          <code>:hover</code> и <code>:focus</code>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Псевдоэлементы
        </h2>
        <CodeBlock
          code={`<style>
.pseudo-element {
  position: relative;
  padding: 20px;
  border: 1px solid #ccc;
}
.pseudo-element::after {
  content: " - Псевдоэлемент";
  color: grey;
  position: absolute;
  right: 0;
  top: 0;
}
</style>

<p class="pseudo-element">This paragraph has a pseudo-element</p>`}
          previewKey="pseudoElements"
        />
        <p className="mb-4">
          Псевдоэлементы, такие как <code>::after</code> и <code>::before</code>
          , используются для добавления стилизованного контента до или после
          элемента. В этом примере показано использование <code>::after</code>.
        </p>
      </section>
    </div>
  );
}
