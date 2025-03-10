import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/schemas/form-schemas';
import { query } from '@/lib/db';

// Handle POST requests to the contact form API
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the body against our schema
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { 
          success: false, 
          errors: result.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    // Extract validated data
    const { name, email, subject, message } = result.data;
    
    // Insert into database
    await query(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, subject, message]
    );
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully' 
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your submission' 
      }, 
      { status: 500 }
    );
  }
}