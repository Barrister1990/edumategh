import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
// You'll need to add RESEND_API_KEY to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, type } = await request.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'EduMate GH <noreply@edumategh.com>', // Replace with your verified domain
      to: ['edumategh@gmail.com', 'edumategh@gmail.com'], // Replace with your actual support emails
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }
            .logo {
              background-color: #3b82f6;
              color: white;
              width: 60px;
              height: 60px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 15px;
              font-size: 24px;
              font-weight: bold;
            }
            .title {
              color: #1e293b;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              color: #64748b;
              font-size: 16px;
              margin: 5px 0 0 0;
            }
            .form-details {
              background-color: #f1f5f9;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 25px;
            }
            .form-row {
              display: flex;
              margin-bottom: 15px;
              align-items: center;
            }
            .form-row:last-child {
              margin-bottom: 0;
            }
            .label {
              font-weight: 600;
              color: #475569;
              min-width: 120px;
              font-size: 14px;
            }
            .value {
              color: #1e293b;
              font-size: 14px;
              flex: 1;
            }
            .message-section {
              background-color: #f8fafc;
              border-radius: 8px;
              padding: 20px;
              border-left: 4px solid #3b82f6;
            }
            .message-title {
              font-weight: 600;
              color: #475569;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .message-content {
              color: #1e293b;
              font-size: 14px;
              line-height: 1.6;
              white-space: pre-wrap;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 12px;
            }
            .cta-button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin-top: 15px;
            }
            @media (max-width: 600px) {
              .form-row {
                flex-direction: column;
                align-items: flex-start;
              }
              .label {
                margin-bottom: 5px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">E</div>
              <h1 class="title">New Contact Form Submission</h1>
              <p class="subtitle">Someone has reached out to EduMate GH</p>
            </div>
            
            <div class="form-details">
              <div class="form-row">
                <span class="label">Name:</span>
                <span class="value">${name}</span>
              </div>
              <div class="form-row">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              ${phone ? `<div class="form-row">
                <span class="label">Phone:</span>
                <span class="value">${phone}</span>
              </div>` : ''}
              <div class="form-row">
                <span class="label">Inquiry Type:</span>
                <span class="value">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
              <div class="form-row">
                <span class="label">Subject:</span>
                <span class="value">${subject}</span>
              </div>
            </div>
            
            <div class="message-section">
              <div class="message-title">Message:</div>
              <div class="message-content">${message}</div>
            </div>
            
            <div class="footer">
              <p>This message was sent from the EduMate GH contact form.</p>
              <p>Please respond to the user at: <strong>${email}</strong></p>
              <a href="mailto:${email}" class="cta-button">Reply to User</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Also send a confirmation email to the user
    await resend.emails.send({
      from: 'EduMate GH <noreply@edumategh.com>', // Replace with your verified domain
      to: [email],
      subject: 'Thank you for contacting EduMate GH',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for contacting EduMate GH</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }
            .logo {
              background-color: #3b82f6;
              color: white;
              width: 60px;
              height: 60px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 15px;
              font-size: 24px;
              font-weight: bold;
            }
            .title {
              color: #1e293b;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              color: #64748b;
              font-size: 16px;
              margin: 5px 0 0 0;
            }
            .content {
              color: #1e293b;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 25px;
            }
            .highlight {
              background-color: #f1f5f9;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #3b82f6;
            }
            .highlight-title {
              font-weight: 600;
              color: #475569;
              margin-bottom: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 14px;
            }
            .cta-button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">E</div>
              <h1 class="title">Thank you for contacting us!</h1>
              <p class="subtitle">We've received your message</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>Thank you for reaching out to EduMate GH. We've received your message and our team will get back to you within 24 hours.</p>
              
              <div class="highlight">
                <div class="highlight-title">Your inquiry details:</div>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
              </div>
              
              <p>In the meantime, you might find answers to common questions in our FAQ section or by checking our help documentation.</p>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>The EduMate GH Team</p>
              <a href="https://edumategh.com" class="cta-button">Visit Our Website</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
