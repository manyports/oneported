import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import Split from 'react-split'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import Editor from "@monaco-editor/react"
import '@/styles/markdown.css'

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

export function MarkdownEditor({ content, onChange, className }: MarkdownEditorProps) {
  const { theme } = useTheme()

  return (
    <Split
      className={cn("flex h-full", className)}
      sizes={[50, 50]}
      minSize={300}
      gutterSize={8}
      gutterStyle={() => ({
        backgroundColor: theme === 'dark' ? '#27272a' : '#e5e7eb',
      })}
    >
      <div className="h-full overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={content}
          onChange={(value) => onChange(value || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            wrappingIndent: 'same',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <div className="h-full overflow-auto bg-background p-4">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </Split>
  )
} 