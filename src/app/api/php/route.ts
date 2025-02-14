import { NextResponse } from 'next/server'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    const response = await fetch('https://api.paiza.io/runners/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: code,
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

    if (!output) {
      return NextResponse.json({ 
        error: 'No output received. Make sure your code includes echo or print statements.' 
      })
    }

    return NextResponse.json({ output })
  } catch (error: any) {
    console.error('PHP API Error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to execute PHP code'
    }, { status: 500 })
  }
} 