import { NextResponse } from 'next/server';
import { multiStepFormSchema } from '@/lib/schemas/form-schemas';
import { query } from '@/lib/db';

/**
 * Handle POST requests to the multi-step form API
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the body against our schema
    const result = multiStepFormSchema.safeParse(body);
    
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
    const { 
      firstName, 
      lastName, 
      email, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      preferences 
    } = result.data;
    
    // Insert into database
    await query(
      `INSERT INTO multistep_submissions (
        first_name, last_name, email, 
        address_line1, address_line2, city, state, postal_code, country, 
        phone, preferences
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        firstName, lastName, email, 
        addressLine1, addressLine2 || null, city, state, postalCode, country, 
        phone || null, JSON.stringify(preferences)
      ]
    );
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully' 
    });
  } catch (error) {
    console.error('Error handling multi-step form submission:', error);
    
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