import { NextRequest, NextResponse } from 'next/server';

const AVAILABLE_MODULES = [
  'math', 'random', 'datetime', 'json', 're', 'collections',
  'itertools', 'functools', 'os', 'sys', 'time', 'string', 
  'numpy', 'pandas', 'matplotlib', 'requests', 'bs4'
];

export async function POST(req: NextRequest) {
  try {
    const { code, modules = [], stdinInput = '' } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    let modifiedCode = code;
    
    let pipCommands = '';
    for (const module of modules) {
      if (!AVAILABLE_MODULES.includes(module)) {
        pipCommands += `import sys\nimport subprocess\n`;
        pipCommands += `try:\n    import ${module}\nexcept ImportError:\n`;
        pipCommands += `    subprocess.check_call([sys.executable, "-m", "pip", "install", "${module}"])\n`;
        pipCommands += `    import ${module}\n\n`;
      }
    }
    
    const importStatements = modules
      .filter((module: string) => AVAILABLE_MODULES.includes(module))
      .map((module: string) => `import ${module}`)
      .join('\n');
    
    modifiedCode = `${pipCommands}${importStatements}\n\n${code}`;

    console.log("Executing code on Piston API", stdinInput ? "with stdin input" : "without stdin input");
    
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'python3',
        version: '3.10.0',
        files: [
          {
            content: modifiedCode,
          },
        ],
        stdin: stdinInput,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    const data = await response.json();
    if (data.run) {
      const output = data.run.output || '';
      let error = data.run.stderr || '';
      if (error.includes('ModuleNotFoundError')) {
        const errorLines = error.split('\n');
        const missingModule = errorLines.find((line: string) => line.includes('ModuleNotFoundError'))?.match(/No module named '(.+?)'/)?.[1] || '';
        
        if (missingModule) {
          error = `Модуль '${missingModule}' не доступен в текущей среде выполнения. Серверлесс-окружение не позволяет устанавливать произвольные пакеты.`;
        }
      }
      
      return NextResponse.json({
        output,
        error,
      });
    } else if (data.message) {
      return NextResponse.json({
        output: '',
        error: `Execution error: ${data.message}`,
      });
    } else {
      return NextResponse.json({
        output: '',
        error: 'Unknown execution error',
      });
    }
  } catch (error) {
    console.error('Python execution error:', error);
    return NextResponse.json({
      output: '',
      error: `Server error: ${error instanceof Error ? error.message : String(error)}`,
    }, { status: 500 });
  }
} 