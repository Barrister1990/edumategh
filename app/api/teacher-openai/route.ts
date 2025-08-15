import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
    const { prompt, context = '', image } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    // Use gemini-1.5-pro for image support, gemini-1.5-flash for text-only
    const model = genAI.getGenerativeModel({
      model: image ? 'gemini-1.5-pro' : 'gemini-1.5-flash',
      systemInstruction:
        'You are EduMate GH AI, an AI assistant for Ghanaian teachers. You provide professional support including lesson planning, curriculum guidance, assessment strategies, classroom management tips, and educational resources. Your responses should be practical, evidence-based, and aligned with Ghanaian educational standards. You can help with creating teaching materials, explaining pedagogical concepts, and providing administrative support. If you do not know something, say so honestly.',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    // Prepare content array for generation
    const contentParts = [];

    // Add context if provided
    if (context) {
      contentParts.push(`Previous context: ${context}`);
    }

    // Add text prompt
    contentParts.push(prompt);

    // Add image if provided
    if (image) {
      // Assuming image is provided as base64 string with data URL format
      // e.g., "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      const imageData = image.split(',')[1]; // Remove data URL prefix
      const mimeType = image.split(';')[0].split(':')[1]; // Extract MIME type

      contentParts.push({
        inlineData: {
          data: imageData,
          mimeType: mimeType,
        },
      });
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const aiMessage = response.text() || 'No response generated.';

    return NextResponse.json({ message: aiMessage });

  } catch (error) {
    console.error('Gemini error:', error);
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          message: 'Invalid API key. Please check your Gemini API configuration.' 
        }, { status: 401 });
      }
      if (error.message.includes('quota')) {
        return NextResponse.json({ 
          message: 'API quota exceeded. Please try again later.' 
        }, { status: 429 });
      }
      if (error.message.includes('safety')) {
        return NextResponse.json({ 
          message: 'Content filtered by safety settings. Please try rephrasing your request.' 
        }, { status: 400 });
      }
      if (error.message.includes('image')) {
        return NextResponse.json({ 
          message: 'Image processing failed. Please ensure the image is in a supported format (JPEG, PNG, WebP, HEIC, HEIF).' 
        }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: 'AI failed to respond. Try again later.' },
      { status: 500 }
    );
  }
}