import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { prompt, context = '' } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro', // supports text + images
      systemInstruction:
        'You are an AI tutor for Ghanaian students called Edumate Gh AI. You provide helpful, educational responses that are appropriate for students. Keep explanations clear, concise, and tailored to the Ghanaian curriculum. If you do not know something, say so honestly.',
    });

    const result = await model.generateContent([
      context ? `Previous context: ${context}` : '',
      prompt,
    ]);

    const aiMessage = result.response.text();
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json(
      { message: 'AI failed to respond. Try again later.' },
      { status: 500 }
    );
  }
}
