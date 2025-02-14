import { NextResponse } from 'next/server'

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
    
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 })
    }

    const resultResponse = await fetch(`https://api.paiza.io/runners/get_details?id=${data.id}&api_key=${process.env.PAIZA_API_KEY || 'guest'}`)
    const resultData = await resultResponse.json()

    if (resultData.error) {
      return NextResponse.json({ error: resultData.error }, { status: 500 })
    }

    const output = [
      resultData.stdout || '',
      resultData.stderr ? `Error: ${resultData.stderr}` : ''
    ].filter(Boolean).join('\n')

    return NextResponse.json({ output })
  } catch (error: any) {
    console.error('PHP API Error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to execute PHP code'
    }, { status: 500 })
  }
} 