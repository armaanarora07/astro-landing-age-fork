export const prerender = false;

import postmark from 'postmark';
import { openDb } from '../../lib/db.js';
import { config } from '../../config';

// Email validation function
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Basic email validation - should have @ and at least one . in the domain
  const parts = email.split('@');
  return parts.length === 2 && parts[1].includes('.') && email.length >= 5;
}

// Input sanitization to prevent potential XSS
function sanitizeInput(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST({ request }) {
  // Check if contact form is enabled
  if (!config.contactForm.enabled) {
    return new Response(JSON.stringify({ error: 'Contact form is currently disabled' }), { status: 403 });
  }
  
  let db;
  try {
    const { name, email, message, source } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedSource = source ? sanitizeInput(source) : 'Website Contact Form';

    try {
      // Try to store in database
      db = await openDb();
      await db.run(
        'INSERT INTO contacts (name, email, message, source) VALUES (?, ?, ?, ?)',
        [sanitizedName, email, sanitizedMessage, sanitizedSource]
      );
      await db.close();
      db = null;
    } catch (dbError) {
      console.error('Database error storing contact form submission:', dbError);
      // Log database error but continue to try sending email
      if (db) {
        await db.close();
        db = null;
      }
    }

    // Get email configuration from the config object
    const postmarkApiKey = config.email.postmarkApiKey;
    const fromEmail = config.email.fromEmail;
    const notifyEmail = config.contactForm.notifyEmail;

    // In development or if Postmark credentials are missing, just return success
    if (!postmarkApiKey || !fromEmail || !notifyEmail) {
      console.log('Skipping email sending: missing configuration');
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Form submitted successfully (email not sent - missing configuration)'
      }), { status: 200 });
    }

    // Validate notification email
    if (!isValidEmail(notifyEmail)) {
      console.error('Invalid notification email address:', notifyEmail);
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Form submitted successfully (email not sent - invalid recipient)'
      }), { status: 200 });
    }

    // Only try to send email if we have credentials
    try {
      const client = new postmark.ServerClient(postmarkApiKey);

      await client.sendEmail({
        From: fromEmail,
        To: notifyEmail,
        Subject: `New Contact Form Submission from ${sanitizedName}${sanitizedSource !== 'Website Contact Form' ? ` (${sanitizedSource})` : ''}`,
        TextBody: `Name: ${sanitizedName}\nEmail: ${email}\nSource: ${sanitizedSource}\n\n${sanitizedMessage}`
      });
      
      console.log('Contact form email sent successfully');
    } catch (emailError) {
      // Continue and return success since we stored in database
      console.error('Failed to send contact form email:', emailError);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Contact form API error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  } finally {
    // Ensure DB is closed in case of error
    if (db) await db.close();
  }
} 