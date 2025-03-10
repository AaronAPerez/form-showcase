import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { query } from '@/lib/db';

// Handle POST requests to the file upload API
export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Extract values
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const file = formData.get('file') as File;
    
    // Validate that all required fields are present
    if (!name || !email || !file) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        }, 
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File must be JPEG, PNG, or PDF' 
        }, 
        { status: 400 }
      );
    }
    
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File size must be less than 5MB' 
        }, 
        { status: 400 }
      );
    }
    
    // Create a unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const sanitizedName = originalName
      .replace(extension, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    const filename = `${sanitizedName}_${timestamp}${extension}`;
    
    // Define the upload directory - in real app, use blob storage
    // For this example, save to a public uploads folder
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the upload directory exists
    await mkdir(uploadsDir, { recursive: true });
    
    // Define the file path
    const filePath = path.join(uploadsDir, filename);
    
    // Save the file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);
    
    // Create the public URL path
    const publicPath = `/uploads/${filename}`;
    
    // Save to database
    await query(
      'INSERT INTO file_submissions (name, email, file_name, file_path, file_size, file_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, originalName, publicPath, file.size, file.type]
    );
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: originalName,
        path: publicPath,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your upload' 
      }, 
      { status: 500 }
    );
  }
}