import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Handle GET requests (return method not allowed with helpful message)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'This endpoint only supports POST requests. Please send your prompt via POST request.',
      example: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { prompt: 'Your question here', context: 'Optional context' }
      }
    },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const { prompt, context = '', image } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    // Use gemini-1.5-pro for image support, gemini-1.5-flash for text-only (faster & cheaper)
    const model = genAI.getGenerativeModel({
      model: image ? 'gemini-1.5-pro' : 'gemini-1.5-flash',
      systemInstruction:
        'You are an AI tutor for Ghanaian students called Edumate Gh AI. You provide helpful, educational responses that are appropriate for students. Keep explanations clear, concise, and tailored to the Ghanaian curriculum. If you do not know something, say so honestly.',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Prepare content for generation
    const contentParts = [];
    
    if (context) {
      contentParts.push(`Previous context: ${context}`);
    }
    
    contentParts.push(prompt);

    // Add image if provided
    if (image) {
      try {
        // Handle base64 image data
        const imageData = image.split(',')[1]; // Remove data URL prefix
        const mimeType = image.split(';')[0].split(':')[1]; // Extract MIME type

        contentParts.push({
          inlineData: {
            data: imageData,
            mimeType: mimeType,
          },
        });
      } catch (imageError) {
        console.error('Image processing error:', imageError);
        return NextResponse.json({ 
          message: 'Invalid image format. Please provide a valid base64 image.' 
        }, { status: 400 });
      }
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const aiMessage = response.text();
    
    return NextResponse.json({ message: aiMessage });

  } catch (error) {
    console.error('Gemini error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({
          message: 'API configuration error. Please check server settings.'
        }, { status: 401 });
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json({
          message: 'Service temporarily unavailable. Please try again later.'
        }, { status: 429 });
      }
      
      if (error.message.includes('safety')) {
        return NextResponse.json({
          message: 'Content cannot be processed due to safety guidelines. Please rephrase your request.'
        }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: 'AI failed to respond. Try again later.' },
      { status: 500 }
    );
  }
}