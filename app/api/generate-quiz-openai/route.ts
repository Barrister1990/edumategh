import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator for the Ghana Education Service (GES) curriculum.
You generate high-quality quiz questions based on the following structure:

- **Strand**: A major learning area or theme (e.g., Number, Algebra, ICT Tools).
- **Sub-strand**: A specific topic under the strand (e.g., Number and Numeration).
- **Content Standard**: Describes what learners should know and be able to do by the end of a phase.
- **Indicator**: A measurable skill or performance objective under a content standard.

Your questions must align with the Ghanaian curriculum, follow Bloom’s Taxonomy levels (Remember, Understand, Apply, Analyze, Evaluate, Create), and be age-appropriate. Questions should be clear, concise, and relevant to the GES standards.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.error?.message || 'Quiz generation failed.' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return NextResponse.json({ message: content });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ message: 'Internal server error while generating quiz.' }, { status: 500 });
  }
}
