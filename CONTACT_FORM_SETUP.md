# Contact Form Setup Guide

## Overview
The contact form has been redesigned with a mobile-first approach, using `text-blue-600` as the primary color and no gradients. It includes a new phone number field and integrates with Resend for sending emails.

## Setup Steps

### 1. Install Dependencies
```bash
npm install resend
```

### 2. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Resend API Key for sending emails
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
# Replace with your verified domain in Resend
FROM_EMAIL=noreply@edumate.gh
SUPPORT_EMAIL=edumategh@gmail.com
TECH_SUPPORT_EMAIL=edumategh@gmail.com
```

### 3. Resend Configuration
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain (or use the sandbox domain for testing)
4. Update the `from` email in `/app/api/contact/route.ts` with your verified domain

### 4. Update Email Addresses
In `/app/api/contact/route.ts`, update these email addresses:
- Line 45: `from: 'EduMate GH <noreply@edumate.gh>'` - Replace with your verified domain
- Line 46: `to: ['edumategh@gmail.com']` - Support email for contact form submissions

### 5. Test the Form
1. Start your development server: `npm run dev`
2. Navigate to `/contact`
3. Fill out and submit the form
4. Check your email for the notification and confirmation emails

## Features

### Contact Form Fields
- **Name** (required)
- **Email** (required)
- **Phone** (optional)
- **Inquiry Type** (dropdown)
- **Subject** (required)
- **Message** (required)

### Email Templates
- **Notification Email**: Sent to your support team with form details
- **Confirmation Email**: Sent to the user confirming receipt

### Design Updates
- ✅ Mobile-first responsive design
- ✅ `text-blue-600` as primary color
- ✅ No gradients - clean, modern appearance
- ✅ Phone number field added
- ✅ Improved form validation and error handling
- ✅ Professional HTML email templates

## API Endpoint
- **POST** `/api/contact`
- Accepts JSON with form data
- Returns success/error responses
- Sends emails via Resend

## Error Handling
- Form validation (required fields, email format)
- API error responses
- User-friendly error messages
- Loading states during submission

## Customization
You can customize:
- Email templates in `/app/api/contact/route.ts`
- Form validation rules
- Email styling and branding
- Rate limiting and spam protection

## Troubleshooting
- Ensure Resend API key is correct
- Verify domain is authenticated in Resend
- Check browser console for errors
- Verify environment variables are loaded
- Test with valid email addresses
