"use client"

import { useState, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileIcon, FolderIcon, Plus, ChevronLeft, ChevronRight, X, MoreVertical, Download, Play, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import JSZip from "jszip"
import { useTheme } from "next-themes"
import { MarkdownEditor } from "@/components/markdown-editor"

type FileType = "html" | "css" | "js" | "md" | "txt" | "php"

interface FileData {
  id: string
  name: string
  content: string
  type: FileType
  directory: string
}

interface FormInput {
  name: string;
  type: string;
}

function extractFormInputs(formHtml: string): FormInput[] {
  const inputs: FormInput[] = [];
  const inputRegex = /<input[^>]*>/g;
  let match;
  
  while ((match = inputRegex.exec(formHtml)) !== null) {
    const nameMatch = match[0].match(/name=["']([^"']+)["']/);
    const typeMatch = match[0].match(/type=["']([^"']+)["']/);
    
    if (nameMatch) {
      inputs.push({
        name: nameMatch[1],
        type: typeMatch ? typeMatch[1] : 'text'
      });
    }
  }
  
  return inputs;
}

const defaultHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <meta name="description" content="This is my awesome project">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
  <script src="script.js"></script>
</body>
</html>`

const defaultMarkdownContent = `# Welcome to Markdown Editor

This is a live preview markdown editor. You can write markdown on the left side and see the preview on the right.

## Features

- **Bold** and *italic* text
- Lists and checkboxes
- [Links](https://oneported.vercel.app)
- Code blocks with syntax highlighting

\`\`\`javascript
console.log('Hello from oneported!');
\`\`\`

## Tables

| Feature | Support |
|---------|---------|
| Tables | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Math | ✅ |

Enjoy writing!
`

const executePHP = async (code: string, formData: Record<string, string> = {}) => {
  try {
    let cleanCode = code.trim();
    
    if (cleanCode.includes('<?php')) {
      cleanCode = `<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', '1');
?>
${cleanCode}`;
    } else if (cleanCode.startsWith('<')) {
      cleanCode = `<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', '1');
?>
${cleanCode}`;
    } else {
      cleanCode = `<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', '1');

${cleanCode}
?>`;
    }

    const formDataCode = Object.entries(formData).reduce((acc, [key, value]) => {
      return acc + `$_POST['${key}'] = '${value.replace(/'/g, "\\'")}';` + "\n";
    }, '');

    cleanCode = cleanCode.replace('<?php', `<?php\n${formDataCode}`);

    const response = await fetch('/api/php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code: cleanCode,
        formData 
      })
    });
    
    const data = await response.json();
    
    const filteredError = data.error ? 
      data.error.split('\n')
        .filter(line => 
          line.includes('Fatal error:') || 
          line.includes('Parse error:') || 
          line.includes('Syntax error:')
        )
        .join('\n')
      : '';
    
    return {
      output: data.output || '',
      error: filteredError || ''
    };
  } catch (error) {
    return {
      output: '',
      error: `Failed to execute PHP code: ${error}`
    };
  }
};

function getLanguageFromType(type: FileType | undefined): string {
  switch (type) {
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'js':
      return 'javascript'
    case 'md':
      return 'markdown'
    case 'php':
      return 'php'
    case 'txt':
      return 'plaintext'
    default:
      return 'plaintext'
  }
}

export default function AdvancedEditor() {
  const { theme: appTheme } = useTheme()
  const [files, setFiles] = useState<FileData[]>([
    {
      id: "1",
      name: "index.html",
      content: defaultHtmlContent,
      type: "html",
      directory: "src",
    },
    {
      id: "2",
      name: "styles.css",
      content: "body {\n  font-family: -apple-system, system-ui, sans-serif;\n  padding: 2rem;\n}",
      type: "css",
      directory: "src",
    },
    {
      id: "3",
      name: "script.js",
      content: 'console.log("Hello from oneported!");',
      type: "js",
      directory: "src",
    },
    {
      id: "4",
      name: "README.md",
      content: defaultMarkdownContent,
      type: "md",
      directory: "src",
    },
  ])
  const [activeFile, setActiveFile] = useState<string>("1")
  const [compiledContent, setCompiledContent] = useState<string>("")
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [previewInfo, setPreviewInfo] = useState({ title: "", description: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [phpOutput, setPhpOutput] = useState<string>("")
  const [isPhpRunning, setIsPhpRunning] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    let cleanup: (() => void) | undefined
    
    const compile = async () => {
      const currentFile = files.find(f => f.id === activeFile)
      if (currentFile?.type !== 'php') {
        cleanup = await compileContent()
      }
    }
    
    compile()
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [activeFile])

  useEffect(() => {
    const activeHtmlFile = files.find((f) => f.type === "html" && f.id === activeFile)
    if (activeHtmlFile) {
      const titleMatch = activeHtmlFile.content.match(/<title>(.*?)<\/title>/)
      const descriptionMatch = activeHtmlFile.content.match(/<meta name="description" content="(.*?)"/)
      setPreviewInfo({
        title: titleMatch ? titleMatch[1] : "",
        description: descriptionMatch ? descriptionMatch[1] : "",
      })
    }
  }, [activeFile, files])

  useEffect(() => {
    const currentFile = files.find(f => f.id === activeFile)
    const shouldShowPreview = currentFile?.type === 'html' || currentFile?.type === 'php'
    
    if (window.innerWidth >= 1024) {
      setPreviewVisible(true)
    } else {
      setPreviewVisible(shouldShowPreview)
    }
  }, [activeFile, files])

  const compileContent = async (currentFiles = files) => {
    const phpFiles = currentFiles.filter(f => f.type === "php")
    const activePhpFile = phpFiles.find(f => f.id === activeFile)

    if (activePhpFile) {
      setIsPhpRunning(true)
      try {
        const formData: Record<string, string> = {};
        if (iframeRef.current) {
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
          if (iframeDoc) {
            const inputs = iframeDoc.querySelectorAll('input[name]');
            inputs.forEach((element) => {
              const input = element as HTMLInputElement;
              if (input.name) {
                formData[input.name] = input.value || '';
              }
            });
          }
        }

        const { output, error } = await executePHP(activePhpFile.content, formData)
        
        const isHtmlOutput = output.trim().match(/^<!DOCTYPE|^<html/i)
        
        if (isHtmlOutput && !error) {
          const cssFile = currentFiles.find((f) => f.type === "css")
          if (cssFile) {
            const cssBlob = new Blob([cssFile.content], { type: "text/css" })
            const cssUrl = URL.createObjectURL(cssBlob)
            
            const modifiedOutput = output.replace(
              /<\/head>/i,
              `<link rel="stylesheet" href="${cssUrl}" /></head>`
            )
            
            setCompiledContent(modifiedOutput)
            return () => {
              URL.revokeObjectURL(cssUrl)
            }
          } else {
            setCompiledContent(output)
            return () => {}
          }
        } else {
          setCompiledContent(`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { 
                    font-family: monospace; 
                    padding: 20px; 
                    margin: 0;
                    background: #f5f5f5;
                  }
                  .output, .error { 
                    background: white;
                    padding: 15px;
                    border-radius: 4px;
                    border: 1px solid #eaeaea;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    margin-bottom: 10px;
                  }
                  .error {
                    color: #ff0000;
                    border-color: #ffcdd2;
                    background: #fff5f5;
                    display: ${error ? 'block' : 'none'};
                  }
                  .output:empty {
                    display: none;
                  }
                  .label {
                    font-weight: bold;
                    color: #666;
                    margin-bottom: 5px;
                    display: ${error || output ? 'block' : 'none'};
                  }
                </style>
              </head>
              <body>
                ${error ? `
                  <div class="label">Error:</div>
                  <pre class="error">${error}</pre>
                ` : ''}
                ${output ? `
                  <div class="label">Output:</div>
                  <pre class="output">${output}</pre>
                ` : ''}
                ${!error && !output ? `
                  <div class="output">No output</div>
                ` : ''}
              </body>
            </html>
          `)
        }
        return () => {}
      } catch (error) {
        setCompiledContent(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { 
                  font-family: monospace; 
                  padding: 20px;
                  margin: 0;
                  background: #f5f5f5;
                }
                .error { 
                  color: #ff0000;
                  background: #fff5f5;
                  padding: 15px;
                  border-radius: 4px;
                  border: 1px solid #ffcdd2;
                }
              </style>
            </head>
            <body>
              <div class="error">Failed to execute PHP code: ${error}</div>
            </body>
          </html>
        `)
        return () => {}
      } finally {
        setIsPhpRunning(false)
      }
    }

    const htmlFile = currentFiles.find((f) => f.type === "html")
    const cssFile = currentFiles.find((f) => f.type === "css")
    const jsFile = currentFiles.find((f) => f.type === "js")

    let cssUrl = ""
    let jsUrl = ""
    let cssBlob: Blob | null = null
    let jsBlob: Blob | null = null

    try {
      cssBlob = cssFile ? new Blob([cssFile.content], { type: "text/css" }) : null
      cssUrl = cssBlob ? URL.createObjectURL(cssBlob) : ""

      jsBlob = jsFile ? new Blob([jsFile.content], { type: "application/javascript" }) : null
      jsUrl = jsBlob ? URL.createObjectURL(jsBlob) : ""

      let compiledHtml = htmlFile ? htmlFile.content : defaultHtmlContent
      compiledHtml = compiledHtml.replace('href="styles.css"', `href="${cssUrl}"`)
      compiledHtml = compiledHtml.replace('src="script.js"', `src="${jsUrl}"`)

      setCompiledContent(compiledHtml)

      return () => {
        if (cssBlob) URL.revokeObjectURL(cssUrl)
        if (jsBlob) URL.revokeObjectURL(jsUrl)
      }
    } catch (error) {
      if (cssBlob) URL.revokeObjectURL(cssUrl)
      if (jsBlob) URL.revokeObjectURL(jsUrl)
      return () => {}
    }
  }

  const handleFileChange = (content: string | undefined) => {
    if (content !== undefined) {
      setFiles((prevFiles) => {
        const newFiles = prevFiles.map((f) => (f.id === activeFile ? { ...f, content } : f))
        const currentFile = newFiles.find(f => f.id === activeFile)
        if (currentFile?.type !== 'php') {
          compileContent(newFiles).catch(console.error)
        }
        return newFiles
      })
    }
  }

  const addFile = (type: FileType, directory = "") => {
    const newId = (Math.max(...files.map((f) => Number.parseInt(f.id))) + 1).toString()
    const newFileName = `new_file${newId}.${type}`
    setFiles([
      ...files,
      {
        id: newId,
        name: newFileName,
        content: type === "html" ? defaultHtmlContent : "",
        type,
        directory,
      },
    ])
    setActiveFile(newId)
  }

  const addDirectory = (parentDirectory = "") => {
    const newDirName = prompt("Введите имя новой директории:")
    if (newDirName) {
      const newDir = parentDirectory ? `${parentDirectory}/${newDirName}` : newDirName
      const newId = (Math.max(...files.map((f) => Number.parseInt(f.id))) + 1).toString()
      setFiles([
        ...files,
        {
          id: newId,
          name: ".directory",
          content: "",
          type: "txt",
          directory: newDir,
        },
      ])
    }
  }

  const removeFile = (fileId: string) => {
    const fileToRemove = files.find((f) => f.id === fileId)
    if (!fileToRemove) return

    if (fileToRemove.name === ".directory") {
      const dirToRemove = fileToRemove.directory
      setFiles(files.filter((f) => !f.directory.startsWith(dirToRemove)))
    } else {
      setFiles(files.filter((f) => f.id !== fileId))
    }

    if (activeFile === fileId) {
      setActiveFile(files[0].id)
    }
    setShowDeleteConfirm(false)
    setFileToDelete(null)
  }

  const renameFile = (fileId: string, newName: string) => {
    setFiles(files.map((f) => (f.id === fileId ? { ...f, name: newName } : f)))
  }

  const getDirectories = () => {
    const dirs = new Set(files.map((f) => f.directory))
    return Array.from(dirs).sort()
  }

  const getFileIcon = (type: FileType) => {
    const colors: Record<FileType, string> = {
      html: "text-orange-500",
      css: "text-blue-500",
      js: "text-yellow-500",
      md: "text-purple-500",
      txt: "text-gray-500",
      php: "text-indigo-500",
    }
    return <FileIcon className={cn("w-4 h-4 mr-2", colors[type])} />
  }

  const EditorLoading = () => (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-blue-500 rounded-full"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  )

  const exportProject = async () => {
    const zip = new JSZip()

    files.forEach((file) => {
      if (file.name !== ".directory") {
        const filePath = file.directory ? `${file.directory}/${file.name}` : file.name
        zip.file(filePath, file.content)
      }
    })

    const content = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = "project.zip"
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentFile = files.find((f) => f.id === activeFile)
  const isPhpFile = currentFile?.type === "php"

  return (
    <div className="flex flex-col h-screen bg-background text-foreground pt-20 md:pt-20">
      <div className="flex flex-col lg:flex-row flex-1">
        <AnimatePresence>
          {sidebarVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-b lg:border-r flex flex-col w-full lg:w-64 bg-card max-h-[40vh] lg:max-h-full overflow-auto"
            >
              <div className="h-[72px] flex items-center justify-between px-4 border-b">
                <span className="font-medium">Файлы</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48" sideOffset={8}>
                    <AnimatePresence>
                      {(["html", "css", "js", "php", "md", "txt"] as FileType[]).map((type, index) => (
                        <motion.div
                          key={type}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <DropdownMenuItem onClick={() => addFile(type)}>
                            {getFileIcon(type)}
                            Новый {type.toUpperCase()} Файл
                          </DropdownMenuItem>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 5 * 0.05 }}
                      >
                        <DropdownMenuItem onClick={() => addDirectory()}>
                          <FolderIcon className="w-4 h-4 mr-2" />
                          Новая директория
                        </DropdownMenuItem>
                      </motion.div>
                    </AnimatePresence>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex-1 overflow-auto p-2">
                {getDirectories().map((dir) => (
                  <div key={dir} className="mb-4">
                    <div className="flex items-center justify-between px-2 py-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <FolderIcon className="w-4 h-4 mr-2" />
                        {dir || "Root"}
                      </div>
                      <div className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {(["html", "css", "js", "php", "md", "txt"] as FileType[]).map((type) => (
                              <DropdownMenuItem key={type} onClick={() => addFile(type, dir)}>
                                {getFileIcon(type)}
                                Новый {type.toUpperCase()} Файл
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem onClick={() => addDirectory(dir)}>
                              <FolderIcon className="w-4 h-4 mr-2" />
                              Новая директория
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => {
                            const dirFile = files.find((f) => f.directory === dir && f.name === ".directory")
                            if (dirFile) {
                              setFileToDelete(dirFile.id)
                              setShowDeleteConfirm(true)
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="ml-4">
                      {files
                        .filter((f) => f.directory === dir && f.name !== ".directory")
                        .map((file) => (
                          <div key={file.id} className="flex items-center justify-between group">
                            <button
                              onClick={() => setActiveFile(file.id)}
                              className={cn(
                                "flex items-center w-full px-2 py-1 text-sm rounded-md",
                                activeFile === file.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/50",
                              )}
                            >
                              {getFileIcon(file.type)}
                              {file.name}
                            </button>
                            <FileActions
                              file={file}
                              onRename={renameFile}
                              onDelete={() => {
                                setFileToDelete(file.id)
                                setShowDeleteConfirm(true)
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          <div className={cn(
            "flex flex-col flex-1 min-h-0",
            currentFile?.type === 'md' ? "lg:h-[calc(100vh-5rem)]" : ""
          )}>
            <div className="h-[72px] flex items-center px-4 border-b bg-card">
              <Button variant="ghost" size="sm" onClick={() => setSidebarVisible(!sidebarVisible)} className="mr-4 shrink-0">
                {sidebarVisible ? <ChevronLeft /> : <ChevronRight />}
              </Button>
              <span className="flex-grow truncate">{files.find((f) => f.id === activeFile)?.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                {isPhpFile && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => compileContent().catch(console.error)}
                    disabled={isPhpRunning}
                    className="shrink-0"
                  >
                    {isPhpRunning ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                        <span className="hidden sm:inline">Запуск...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Запустить PHP</span>
                        <span className="sm:hidden">Запустить</span>
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={exportProject} className="shrink-0">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Экспортировать проект</span>
                  <span className="sm:hidden">Экспорт</span>
                </Button>
              </div>
            </div>
            <div className={cn(
              "flex-1 min-h-0",
              currentFile?.type === 'md' ? "h-full overflow-hidden" : ""
            )}>
              {currentFile && (
                <>
                  {currentFile.type === 'md' ? (
                    <div className="h-full overflow-hidden">
                      <MarkdownEditor
                        content={currentFile.content}
                        onChange={(content) => handleFileChange(content)}
                        className="h-full overflow-auto"
                      />
                    </div>
                  ) : (
                    <Editor
                      height="100%"
                      defaultLanguage={getLanguageFromType(currentFile.type)}
                      language={getLanguageFromType(currentFile.type)}
                      value={currentFile.content}
                      onChange={handleFileChange}
                      loading={<EditorLoading />}
                      theme={appTheme === 'dark' ? 'vs-dark' : 'light'}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineHeight: 21,
                        padding: { top: 16 },
                        fontFamily: "Geist Mono, monospace",
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 16,
                        lineNumbersMinChars: 6,
                        renderLineHighlight: "none",
                        scrollbar: {
                          vertical: "visible",
                          horizontal: "visible",
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                      }}
                      className="border-0"
                    />
                  )}
                </>
              )}
            </div>
          </div>
          {currentFile?.type !== 'md' && previewVisible && (
            <div className="flex flex-col lg:w-1/2 border-t lg:border-l min-h-[40vh] lg:min-h-0">
              <div className="h-[72px] flex items-center justify-between px-4 border-b bg-card">
                <span className="text-sm text-muted-foreground">Preview</span>
                <div className="flex items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm font-medium cursor-help">{previewInfo.title}</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{previewInfo.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setIsFullscreen(true)}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Открыть в полный экран</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <iframe
                ref={iframeRef}
                title="Preview"
                srcDoc={compiledContent}
                className="flex-1 w-full border-none bg-white"
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] p-0">
          <div className="h-[72px] flex items-center justify-between px-4 border-b">
            <span className="text-sm font-medium">{currentFile?.name}</span>
          </div>
          <div className="flex-1 h-[calc(90vh-72px)]">
            <iframe
              title="Full Screen Preview"
              srcDoc={compiledContent}
              className="w-full h-full border-none bg-white"
            />
          </div>
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => fileToDelete && removeFile(fileToDelete)}
      />
    </div>
  )
}

interface FileActionsProps {
  file: FileData
  onRename: (id: string, newName: string) => void
  onDelete: () => void
}

function FileActions({ file, onRename, onDelete }: FileActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="relative">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => {
              setIsOpen(true)
              setDropdownOpen(false)
            }}
          >
            Переименовать
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              onDelete()
              setDropdownOpen(false)
            }}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Переименовать Файл</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                onRename(file.id, newName)
                setIsOpen(false)
              }}
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

function DeleteConfirmDialog({ isOpen, onClose, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтвердите удаление</DialogTitle>
          <DialogDescription>
            Вы точно хотите удалить этот файл? Данное действие не может быть отменено.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Удалить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}