import { NextRequest, NextResponse } from 'next/server';
import { 
  addMockUser, 
  findMockUserByEmail, 
  addDebugLog, 
  generateId,
  MockUser
} from '@/lib/mockData';

export async function POST(request: NextRequest) {
  addDebugLog('Received signup request');
  
  try {    
    // Parse request body
    let body;
    try {
      body = await request.json();
      addDebugLog(`Request body parsed successfully: ${JSON.stringify(body)}`);
    } catch (parseError: any) {
      addDebugLog(`Error parsing request body: ${parseError.message || 'Unknown error'}`);
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { email, password } = body;
    
    // Validate input
    if (!email || !password) {
      addDebugLog(`Missing required fields: email=${!!email}, password=${!!password}`);
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = findMockUserByEmail(email);
    
    if (existingUser) {
      addDebugLog(`User already exists: ${email}`);
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user with a simple ID
    const newUser: MockUser = {
      id: generateId(),
      email,
      password,
      createdAt: new Date()
    };
    
    // Add user to our mock storage
    addMockUser(newUser);
    
    addDebugLog(`Created new user: ${email}`);
    
    // In a real app, we would set a session cookie here
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error: any) {
    addDebugLog(`Error creating user: ${error.message}`);
    console.error('Error creating user:', error);
    
    // Return error message
    return NextResponse.json(
      { message: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
