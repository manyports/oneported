"use client"

import { useState, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Play, Download, Copy, Trash, RotateCcw, Package, AlertTriangle, Info, History, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const defaultPythonContent = `# Python Compiler
# Type your Python code here and click Run to execute it

def greet(name):
    return f"Hello, {name}!"

# Main program
if __name__ == "__main__":
    # Get user input
    name = input("Enter your name: ")
    print(greet(name))
    
    # Get more input
    age = input("Enter your age: ")
    print(f"In 5 years, you will be {int(age) + 5} years old.")
    
    # Basic calculation
    a = 10
    b = 5
    print(f"{a} + {b} = {a + b}")
    print(f"{a} - {b} = {a - b}")
    print(f"{a} * {b} = {a * b}")
    print(f"{a} / {b} = {a / b}")
    
    # List operations
    numbers = [1, 2, 3, 4, 5]
    print(f"List: {numbers}")
    print(f"Sum of list: {sum(numbers)}")
    print(f"Max value: {max(numbers)}")
    print(f"Min value: {min(numbers)}")
`

const commonModules = [
  "math", "random", "datetime", "json", "re", "collections",
  "itertools", "functools", "os", "sys", "time", "string",
  "numpy", "pandas", "requests", "bs4", "matplotlib"
];

const executePython = async (code: string, modules: string[] = [], stdinInput: string = '') => {
  try {
    const response = await fetch('/api/python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, modules, stdinInput })
    });
    
    const data = await response.json();
    
    return {
      output: data.output || '',
      error: data.error || '',
    };
  } catch (error) {
    return {
      output: '',
      error: `Failed to execute Python code: ${error}`,
    };
  }
};

export default function PythonCompiler() {
  const { theme: appTheme } = useTheme()
  const [code, setCode] = useState<string>(defaultPythonContent)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isOutputVisible, setIsOutputVisible] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [modules, setModules] = useState<string[]>([])
  const [showModuleDialog, setShowModuleDialog] = useState<boolean>(false)
  const [newModule, setNewModule] = useState<string>('')
  const [editorLoading, setEditorLoading] = useState<boolean>(true)
  const [stdinInput, setStdinInput] = useState<string>('')
  const [showInputPrompt, setShowInputPrompt] = useState<boolean>(false)
  const editorRef = useRef<any>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const stdinRef = useRef<HTMLTextAreaElement>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setEditorLoading(false);
  }

  const promptForInput = () => {
    if (code.includes("input(")) {
      setShowInputPrompt(true);
    } else {
      setStdinInput('');
      executeCode();
    }
  }

  const executeCode = async () => {
    setIsRunning(true);
    setIsOutputVisible(true);
    setActiveTab("output");
    setOutput('');
    setError('');
    
    try {
      const result = await executePython(code, modules, stdinInput);
      setOutput(result.output);
      setError(result.error);
      
      if (code.trim() && (!history.length || history[0] !== code)) {
        setHistory(prev => [code, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      setError(`Execution error: ${err}`);
      setOutput('');
    } finally {
      setIsRunning(false);
      if (outputRef.current) {
        outputRef.current.scrollTop = 0;
      }
    }
  }

  const runCode = () => {
    promptForInput();
  }

  const addModule = () => {
    if (newModule.trim() && !modules.includes(newModule.trim())) {
      setModules([...modules, newModule.trim()]);
      setNewModule('');
    }
  }

  const removeModule = (moduleName: string) => {
    setModules(modules.filter(m => m !== moduleName));
  }

  const clearCode = () => {
    if (window.confirm("Вы уверены, что хотите очистить текущий код?")) {
      setCode('');
    }
  }

  const resetCode = () => {
    if (window.confirm("Вы уверены, что хотите сбросить код до исходного значения? Это приведет к потере всех несохраненных изменений.")) {
      setCode(defaultPythonContent);
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_code.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert("Код скопирован в буфер обмена!");
    }).catch(err => {
      console.error('Не удалось скопировать код: ', err);
    });
  }

  const loadFromHistory = (historyCode: string) => {
    setCode(historyCode);
    setActiveTab("editor");
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [code, modules]);

  return (
    <div className="flex flex-col h-screen mt-24">
      <Tabs 
        defaultValue="editor" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col h-full"
      >
        <div className="border-b bg-background">
          <div className="px-6 flex items-center justify-center">
            <div className="flex gap-6 py-1.5">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-1.5 py-2 text-sm font-medium relative ${
                  activeTab === "editor"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Редактор
                {activeTab === "editor" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("output")}
                className={`px-1.5 py-2 text-sm font-medium relative ${
                  activeTab === "output"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Вывод
                {activeTab === "output" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("history")}
                className={`px-1.5 py-2 text-sm font-medium relative ${
                  activeTab === "history"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                История
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t px-4 py-2">
          <div className="md:hidden grid grid-cols-4 gap-2">
            <Button 
              variant="default" 
              onClick={runCode} 
              disabled={isRunning}
              className={cn(
                "flex items-center justify-center gap-1",
                isRunning && "opacity-70"
              )}
            >
              <Play className={cn("h-4 w-4", isRunning && "animate-spin")} />
              <span className="md:inline hidden text-primary-foreground">Запустить</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowModuleDialog(true)}
              className={cn(
                "flex items-center justify-center gap-1 relative",
                modules.length > 0 ? "border-primary" : ""
              )}
            >
              <Package className="h-4 w-4" />
              <span className="md:inline hidden">Модули</span>
              {modules.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                  {modules.length}
                </span>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={copyCode}
              className="flex items-center justify-center gap-1"
            >
              <Copy className="h-4 w-4" />
              <span className="md:inline hidden">Копировать</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-1 w-full"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="md:inline hidden">Ещё</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={downloadCode} className="flex items-center gap-2 cursor-pointer">
                  <Download className="h-4 w-4" />
                  <span>Скачать как .py</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearCode} className="flex items-center gap-2 cursor-pointer">
                  <Trash className="h-4 w-4" />
                  <span>Очистить код</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resetCode} className="flex items-center gap-2 cursor-pointer">
                  <RotateCcw className="h-4 w-4" />
                  <span>Сбросить код</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="hidden md:flex md:justify-between md:items-center">
            <div className="flex items-center">
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-md
                  text-sm font-medium text-primary-foreground bg-primary
                  hover:bg-primary/90 
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  transition-all duration-200
                  ${isRunning ? 'opacity-80' : ''}
                `}
              >
                <Play className={cn("h-3.5 w-3.5", isRunning && "animate-spin")} />
                Запустить
              </button>
              
              <div className="mx-4 h-6 w-px bg-border opacity-30"></div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowModuleDialog(true)}
                  className={`
                    inline-flex items-center gap-2 px-2 py-1.5 rounded-md
                    text-sm font-medium relative
                    hover:bg-muted
                    focus:outline-none focus-visible:ring-1
                    transition-colors duration-200
                    ${modules.length > 0 ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  <Package className="h-3.5 w-3.5" />
                  Модули
                  {modules.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 bg-primary text-[10px] text-white rounded-full">
                      {modules.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus-visible:ring-1 transition-colors duration-200"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Копировать
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <button
                onClick={downloadCode}
                className="p-1.5 rounded-md hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-1 transition-colors duration-200"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only">Скачать</span>
              </button>
              
              <button
                onClick={clearCode}
                className="p-1.5 rounded-md hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-1 transition-colors duration-200"
              >
                <Trash className="h-3.5 w-3.5" />
                <span className="sr-only">Очистить</span>
              </button>
              
              <button
                onClick={resetCode}
                className="p-1.5 rounded-md hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-1 transition-colors duration-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="sr-only">Сбросить</span>
              </button>
            </div>
          </div>
        </div>
        
        <TabsContent value="editor" className="flex-1 m-0 p-0 overflow-hidden">
          {modules.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-2 bg-muted flex flex-wrap gap-2 items-center border-b"
            >
              <span className="text-xs font-medium mr-2">Модули:</span>
              <div className="flex flex-wrap gap-2">
                {modules.map(module => (
                  <Badge 
                    key={module} 
                    variant="outline"
                    className="flex items-center gap-1 py-0.5 pl-2 pr-1"
                  >
                    {module}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 rounded-full hover:bg-muted-foreground/20" 
                      onClick={() => removeModule(module)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
          <div className="h-full relative">
            {editorLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-sm">Загрузка редактора...</span>
                </div>
              </div>
            )}
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={appTheme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                padding: { top: 16 },
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                scrollbar: {
                  vertical: 'visible',
                  horizontalScrollbarSize: 12,
                  verticalScrollbarSize: 12,
                },
              }}
              onMount={handleEditorDidMount}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="output" className="flex-1 m-0 p-0 overflow-auto">
          <div 
            ref={outputRef}
            className="h-full p-2 md:p-4 text-sm overflow-auto whitespace-pre-wrap"
          >
            <AnimatePresence mode="wait">
              {isRunning ? (
                <motion.div 
                  key="running"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 md:p-8 flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-base md:text-lg">Выполняется код...</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2">
                    Это может занять несколько секунд
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-2 md:p-0"
                >
                  {error && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <AlertDescription>
                          <div className="font-bold text-destructive mb-2">Ошибка выполнения:</div>
                          <div className="bg-destructive/10 p-2 rounded border border-destructive">
                            <pre className="whitespace-pre-wrap text-xs overflow-auto">{error}</pre>
                          </div>
                          {error.includes('ModuleNotFoundError') && (
                            <div className="mt-2 text-xs md:text-sm flex items-start gap-2">
                              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>
                                На сайте некоторые модули недоступны. Мы поддерживаем стандартные библиотеки Python, но установка произвольных пакетов невозможна.
                              </span>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  
                  {output && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="p-3 md:p-4 bg-card rounded-md border shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <div className="text-xs md:text-sm font-medium flex flex-wrap items-center gap-2">
                          <span>Результат выполнения:</span>
                          {stdinInput && (
                            <Badge variant="outline" className="text-[10px] md:text-xs">
                              <Info className="h-3 w-3 mr-1" />
                              Использован ввод с терминала
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs flex items-center gap-1" 
                          onClick={() => navigator.clipboard.writeText(output)}
                        >
                          <Copy className="h-3 w-3" />
                          <span>Копировать</span>
                        </Button>
                      </div>
                      <Separator className="mb-2" />
                      <pre className="whitespace-pre-wrap bg-muted p-2 md:p-4 rounded-md font-mono text-xs md:text-sm overflow-auto">{output}</pre>
                    </motion.div>
                  )}
                  
                  {!error && !output && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground p-4 md:p-8 flex flex-col items-center"
                    >
                      <Play className="h-8 w-8 md:h-12 md:w-12 mb-4 text-muted-foreground/50" />
                      <p className="text-base md:text-lg mb-2">Нет вывода для отображения</p>
                      <p className="text-xs md:text-sm">Запустите код, чтобы увидеть результаты.</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="flex-1 m-0 p-0 overflow-auto">
          <div className="p-2 md:p-4 space-y-3 md:space-y-4">
            {history.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {history.map((histCode, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-md p-2 md:p-3 shadow-sm hover:shadow-md transition-all bg-card"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <span className="text-xs md:text-sm font-medium flex items-center">
                        <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full text-[10px] md:text-xs mr-2">#{history.length - index}</span>
                        {new Date().toLocaleTimeString()}
                      </span>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => loadFromHistory(histCode)}
                        className="h-7 px-2 text-xs w-full sm:w-auto"
                      >
                        Загрузить
                      </Button>
                    </div>
                    <Separator className="my-2" />
                    <pre className="text-[10px] md:text-xs overflow-hidden max-h-24 md:max-h-32 whitespace-pre-wrap bg-muted p-2 rounded overflow-auto">
                      {histCode.length > 300 
                        ? histCode.substring(0, 300) + '...' 
                        : histCode}
                    </pre>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground p-4 md:p-8 flex flex-col items-center"
              >
                <History className="h-8 w-8 md:h-12 md:w-12 mb-4 text-muted-foreground/50" />
                <p className="text-base md:text-lg mb-2">История пуста</p>
                <p className="text-xs md:text-sm">Запустите код, чтобы сохранить его в историю.</p>
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="w-[95%] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Python Модули</DialogTitle>
            <DialogDescription>
              Добавьте модули Python, которые вы хотите использовать в своем коде.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Введите имя модуля..." 
                value={newModule}
                onChange={(e) => setNewModule(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addModule();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={addModule}>Добавить</Button>
            </div>
            
            <div>
              <Label>Выбранные модули:</Label>
              {modules.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {modules.map(module => (
                    <Badge 
                      key={module} 
                      variant="outline"
                      className="flex items-center gap-1 py-0.5 pl-2 pr-1"
                    >
                      {module}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1 rounded-full hover:bg-muted-foreground/20" 
                        onClick={() => removeModule(module)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Нет выбранных модулей</p>
              )}
            </div>
            
            <div>
              <Label>Доступные модули:</Label>
              <div className="mt-2 flex flex-wrap gap-1 md:gap-2">
                {commonModules.map(module => (
                  <Button
                    key={module}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!modules.includes(module)) {
                        setModules([...modules, module]);
                      }
                    }}
                    disabled={modules.includes(module)}
                    className="text-[10px] md:text-xs h-7 px-2"
                  >
                    {module}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showInputPrompt} onOpenChange={(open) => {
        if (!open) executeCode();
        setShowInputPrompt(open);
      }}>
        <DialogContent className="w-[95%] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              Ввод требуется
            </DialogTitle>
            <DialogDescription>
              Ваш код содержит вызовы input(). Пожалуйста, предоставьте значения ввода ниже.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="border rounded p-1 bg-muted">
              <textarea
                className="w-full h-24 md:h-32 p-2 text-xs md:text-sm font-mono resize-none focus:outline-none bg-transparent"
                placeholder="Введите значения ввода здесь (одно на строку для нескольких вызовов input())..."
                value={stdinInput}
                onChange={(e) => setStdinInput(e.target.value)}
                ref={stdinRef}
                autoFocus
              />
            </div>
            <div className="flex justify-between items-center text-[10px] md:text-xs text-muted-foreground">
              <span>
                Введите каждое значение ввода на новой строке для нескольких вызовов input()
              </span>
              {stdinInput && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStdinInput('')}
                  className="text-xs h-6 md:h-7 px-2"
                >
                  Очистить
                </Button>
              )}
            </div>

            <div className="flex flex-col space-y-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStdinInput('');
                  setShowInputPrompt(false);
                  executeCode();
                }}
                className="text-xs md:text-sm w-full"
              >
                Пропустить
              </Button>
              <Button 
                onClick={() => {
                  setShowInputPrompt(false);
                  executeCode();
                }}
                className="text-xs md:text-sm w-full"
              >
                Продолжить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 