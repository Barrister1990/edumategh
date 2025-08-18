import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Contact API is working!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Test endpoint working',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid JSON',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
