import { NextResponse } from 'next/server';
import { dynamicFormSchema } from '@/lib/schemas/form-schemas';
import { query } from '@/lib/db';

// Handle POST requests to the dynamic form API
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the body against our schema
    const result = dynamicFormSchema.safeParse(body);
    
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
    const formData = result.data;
    
    // Insert into database
    await query(
      'INSERT INTO dynamic_submissions (form_data) VALUES ($1) RETURNING id',
      [JSON.stringify(formData)]
    );
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Form configuration saved successfully' 
    });
  } catch (error) {
    console.error('Error handling dynamic form submission:', error);
    
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