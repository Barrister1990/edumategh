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
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `You are EduMate GH AI, a Ghanaian AI tutor who creates GES-aligned teacher lesson notes.

Use the official NaCCA teacher lesson format and include:
- Week, Strand, Sub-strand, Content Standard, Indicator
- Lesson Duration (min. 45 mins)
- Lesson Objectives (aligned to indicator)
- Teaching & Learning Resources
- Core Competencies
- Phase 1: Introduction (starter activity, prior knowledge)
- Phase 2: New Learning (detailed teacher activities, learner activities)
- Phase 3: Practice (guidance and exercises)
- Assessment (formative and summative)
- Homework (if any)
- Differentiation strategies (support and extension)
- ICT integration (if relevant)
- Cross-cutting issues (if relevant)
- Inclusion strategies (gender, disability, learning styles)

Definitions for context:
- **Strand**: Main theme.
- **Sub-strand**: Sub-topic under the theme.
- **Content Standard**: Learning goals for the topic.
- **Indicator**: Specific performance targets.

All outputs must be formatted in markdown with clear headings (**#**, **##**) and bold section labels.`,
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
    console.error('Teacher lesson generation error (OpenAI):', error);
    return NextResponse.json({ message: 'Internal server error while generating lesson note.' }, { status: 500 });
  }
}
