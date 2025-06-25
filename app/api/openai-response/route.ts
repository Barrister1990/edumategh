import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your .env
});

// Handle GET requests for browser access or debugging
export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only supports POST requests with a prompt.' },
    { status: 405 }
  );
}

// Handle POST requests from your Expo app
export async function POST(req: NextRequest) {
  try {
    const { prompt, context = '' } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI tutor for Ghanaian students. You provide helpful, educational responses that are appropriate for students. Keep explanations clear, concise, and tailored to the Ghanaian curriculum. If you do not know something, say so honestly.',
        },
        ...(context
          ? [{ role: 'user' as const, content: `Previous context: ${context}` }]
          : []),
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = response.choices[0]?.message?.content || 'No response generated.';
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json(
      { message: 'AI failed to respond. Try again later.' },
      { status: 500 }
    );
  }
}
