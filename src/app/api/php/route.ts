import { NextResponse } from 'next/server'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function extractFormInputs(html: string) {
  const inputs: Array<{name: string, type: string, value?: string}> = [];
  const regex = /<input[^>]*>/gi;
  const textareaRegex = /<textarea[^>]*name=["']([^"']+)["'][^>]*>/gi;
  const selectRegex = /<select[^>]*name=["']([^"']+)["'][^>]*>[\s\S]*?<\/select>/gi;
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    const input = match[0];
    const nameMatch = input.match(/name=["']([^"']+)["']/);
    const typeMatch = input.match(/type=["']([^"']+)["']/);
    const valueMatch = input.match(/value=["']([^"']+)["']/);
    
    if (nameMatch) {
      inputs.push({
        name: nameMatch[1],
        type: typeMatch ? typeMatch[1] : 'text',
        value: valueMatch ? valueMatch[1] : undefined
      });
    }
  }
  
  while ((match = textareaRegex.exec(html)) !== null) {
    inputs.push({
      name: match[1],
      type: 'textarea',
      value: ''
    });
  }
  
  while ((match = selectRegex.exec(html)) !== null) {
    const nameMatch = match[0].match(/name=["']([^"']+)["']/);
    if (nameMatch) {
      inputs.push({
        name: nameMatch[1],
        type: 'select',
        value: ''
      });
    }
  }
  
  return inputs;
}

function generateDefaultValue(type: string) {
  switch(type) {
    case 'number':
      return '0';
    case 'email':
      return 'test@example.com';
    case 'date':
      return '2024-01-01';
    case 'password':
      return 'testpass123';
    case 'checkbox':
    case 'radio':
      return '1';
    case 'textarea':
      return 'Sample text';
    case 'select':
      return '1';
    default:
      return 'test';
  }
}

function generateDebugInfo(code: string, inputs: any[], serverVars: any) {
  return {
    timestamp: new Date().toISOString(),
    php_version: '8.2',
    form_inputs: inputs,
    server_variables: serverVars,
    code_length: code.length,
    has_form: code.includes('<form'),
    execution_mode: 'sandbox'
  };
}

export async function POST(request: Request) {
  try {
    const { code, formData } = await request.json()
    const formMatch = code.match(/<form[^>]*>[\s\S]*?<\/form>/i)
    const inputs = formMatch ? extractFormInputs(formMatch[0]) : [];
    
    const serverVars = {
      'REQUEST_METHOD': 'POST',
      'SCRIPT_NAME': '/index.php',
      'REQUEST_URI': '/',
      'SERVER_PROTOCOL': 'HTTP/1.1',
      'SERVER_SOFTWARE': 'PHP Test Environment',
      'SERVER_NAME': 'localhost',
      'HTTP_HOST': 'localhost',
      'REMOTE_ADDR': '127.0.0.1',
      'REQUEST_TIME': Math.floor(Date.now() / 1000),
      'REQUEST_TIME_FLOAT': Date.now() / 1000,
      'HTTPS': 'on',
      'HTTP_USER_AGENT': 'PHP Test Browser',
      'HTTP_ACCEPT': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'HTTP_ACCEPT_LANGUAGE': 'en-US,en;q=0.5',
      'HTTP_ACCEPT_ENCODING': 'gzip, deflate, br',
      'HTTP_CONNECTION': 'keep-alive',
      'DOCUMENT_ROOT': '/var/www/html',
      'SERVER_ADDR': '127.0.0.1',
      'SERVER_PORT': '443'
    };
    
    const postSetup = formData 
      ? Object.entries(formData).map(([key, value]) => 
          `$_POST['${key}'] = isset($_POST['${key}']) ? (is_numeric($_POST['${key}']) ? (int)$_POST['${key}'] : $_POST['${key}']) : '${String(value).replace(/'/g, "\\'")}';`
        ).join('\n      ')
      : inputs.map(input => {
          const defaultValue = input.value || generateDefaultValue(input.type);
          return `$_POST['${input.name}'] = isset($_POST['${input.name}']) ? (is_numeric($_POST['${input.name}']) ? (int)$_POST['${input.name}'] : $_POST['${input.name}']) : '${defaultValue}';`;
        }).join('\n      ');

    const serverVarsPhp = Object.entries(serverVars)
      .map(([key, value]) => `'${key}'=>'${String(value)}'`)
      .join(',');

    const wrappedCode = `<?php
\$_SERVER = array('REQUEST_METHOD' => 'POST');
\$_POST = array();
${postSetup}
\$_REQUEST = \$_POST;
?>
${code}`

    const response = await fetch('https://api.paiza.io/runners/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: wrappedCode,
        language: 'php',
        input: '',
        api_key: process.env.PAIZA_API_KEY || 'guest', 
      })
    })

    const data = await response.json()
    console.log('Create response:', data)
    
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 })
    }

    let resultData
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      await sleep(1000)
      
      const resultResponse = await fetch(
        `https://api.paiza.io/runners/get_details?id=${data.id}&api_key=${process.env.PAIZA_API_KEY || 'guest'}`
      )
      resultData = await resultResponse.json()
      console.log(`Attempt ${attempts + 1} status:`, resultData.status)

      if (resultData.error) {
        return NextResponse.json({ 
          error: resultData.error,
          details: resultData.build_stderr || resultData.stderr || 'Unknown error'
        }, { status: 500 })
      }

      if (resultData.status === 'completed') {
        console.log('Final result:', resultData)
        break
      }

      attempts++
    }

    if (!resultData || resultData.status !== 'completed') {
      return NextResponse.json({ error: 'Execution timeout' }, { status: 500 })
    }

    if (resultData.build_stderr || resultData.stderr) {
      return NextResponse.json({ 
        error: resultData.build_stderr || resultData.stderr 
      }, { status: 500 })
    }

    const output = [
      resultData.stdout || '',
    ].filter(Boolean).join('\n')

    const debug = generateDebugInfo(code, inputs, serverVars);

    return NextResponse.json({ 
      output,
      debug: process.env.NODE_ENV === 'development' ? debug : undefined
    })
  } catch (error: any) {
    console.error('PHP API Error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to execute PHP code'
    }, { status: 500 })
  }
} 