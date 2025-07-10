// app/api/openrouter-response/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "sk-dummy-key-for-openrouter",
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": process.env.SITE_NAME || "EduMate GH",
  },
});

export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only supports POST requests with a prompt.' },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, context = '' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "sk-dummy-key-for-openrouter") {
      return NextResponse.json(
        { message: 'Please configure your OpenRouter API key.' },
        { status: 401 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are EduMate GH AI,  an AI assistant for Ghanaian teachers. You provide professional support including lesson planning, curriculum guidance, assessment strategies, classroom management tips, and educational resources. Your responses should be practical, evidence-based, and aligned with Ghanaian educational standards. You can help with creating teaching materials, explaining pedagogical concepts, and providing administrative support. If you do not know something, say so honestly.",
        },
        ...(context
  ? [{ role: "user" as const, content: `Previous context: ${context}` }]
  : []),

        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiMessage = response.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return NextResponse.json(
      { message: "Sorry, something went wrong with the AI request." },
      { status: 500 }
    );
  }
}
