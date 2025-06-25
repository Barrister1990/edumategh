import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || '',
        'X-Title': process.env.SITE_NAME || '',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `You are EduMate GH AI, a curriculum expert trained to create high-quality **teacher lesson notes** based on the Ghana Education Service (GES) standards.

Each lesson note must follow NaCCA’s official GES format for teachers:
- **Week**, **Strand**, **Sub-strand**
- **Content Standard**, **Indicator**
- **Lesson Objectives** (SMART objectives)
- **Duration**: At least 45 minutes
- **Phase 1: Introduction** – Revise prior knowledge, starter activity
- **Phase 2: New Learning** – Detailed teacher activities, learner responses
- **Phase 3: Practice** – Guided practice and independent work
- **Assessment** – Formative + summative
- **Core Competencies** (e.g., Critical Thinking, Collaboration)
- **Resources** (materials, ICT tools)
- **Differentiation** – Support for struggling learners, challenges for advanced
- **Homework** (if applicable)
- **Inclusion** – Gender, disability, learning styles
- **Cross-cutting issues** (e.g., child protection, environment)

All output must be in clear markdown with **headings** and **bold labels**. Do not include content meant for students directly.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.error?.message || 'Lesson generation failed.' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return NextResponse.json({ message: content });
  } catch (error) {
    console.error('Teacher lesson generation error (OpenRouter):', error);
    return NextResponse.json({ message: 'Internal server error while generating lesson note.' }, { status: 500 });
  }
}
