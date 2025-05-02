export const prerender = false;

import postmark from 'postmark';
import * as dotenv from 'dotenv';
import { openDb } from '../../lib/db.js';
import { config } from '../../config';

dotenv.config();

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Basic email validation - should have @ and at least one . in the domain
  const parts = email.split('@');
  return parts.length === 2 && parts[1].includes('.') && email.length >= 5;
}

function sanitizeInput(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST({ request }) {
  let db;
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
    }

    let isDuplicate = false;
    
    try {
      db = await openDb();
      
      // Check if email already exists
      const existingEntry = await db.get(
        'SELECT id FROM waitlist WHERE email = ? AND interest = ?',
        [email, 'early-access']
      );
      
      isDuplicate = !!existingEntry;
      
      if (!isDuplicate) {
        // Only insert if not a duplicate
        try {
          await db.run(
            'INSERT OR IGNORE INTO waitlist (email, interest) VALUES (?, ?)',
            [email, 'early-access']
          );
        } catch (insertError) {
          console.error('Insert error:', insertError.message);
          // If we get here, it might be a race condition where another request inserted the same email
          // Mark as duplicate to avoid sending notification email
          isDuplicate = true;
        }
        
        // Only send notification if we didn't hit a constraint error
        if (!isDuplicate) {
          try {
            const apiKey = config.email.postmarkApiKey;
            const fromEmail = config.email.fromEmail;
            const toEmail = config.waitlist.notifyEmail;
            
            if (apiKey) {
              const client = new postmark.ServerClient(apiKey);
              
              await client.sendEmail({
                From: fromEmail,
                To: toEmail,
                Subject: `New Early Access Request`,
                TextBody: `A new user has requested early access:\n\nEmail: ${email}`
              });
            }
          } catch (emailError) {
            console.error('Email notification failed for early access registration:', emailError.message);
            // Continue execution - email failure shouldn't stop the registration
          }
        }
      }
      
      await db.close();
      db = null;
      
    } catch (dbError) {
      console.error('Database error during early access registration:', dbError.message);
      if (db) {
        await db.close();
        db = null;
      }
      throw new Error('Database error');
    }
    
    // Send success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: isDuplicate
        ? "You're already on our early access list!"
        : "Thanks for your interest! You're now on our early access list!"
    }), { status: 200 });
    
  } catch (error) {
    console.error('Server error in early access API:', error.message);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  } finally {
    if (db) await db.close();
  }
} 