import { NextRequest, NextResponse } from 'next/server';

// Access the global mock users
declare global {
  var mockUsers: Array<{
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    country?: string;
    createdAt?: Date;
  }>;
  var debugLog: string[];
}

// Initialize if not exists
if (!global.mockUsers) {
  global.mockUsers = [];
  console.log('Initialized empty mockUsers array in test route');
}

if (!global.debugLog) {
  global.debugLog = [];
  console.log('Initialized empty debugLog array in test route');
}

// Helper function for debug logging
function addDebugLog(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: [TEST_USER] ${message}`;
  console.log(logEntry);
  global.debugLog.push(logEntry);
  
  // Keep only the last 100 log entries
  if (global.debugLog.length > 100) {
    global.debugLog.shift();
  }
}

// Simple function to generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

export async function POST(request: NextRequest) {
  addDebugLog('Received test user creation request');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      addDebugLog(`Request body parsed successfully: ${JSON.stringify(body)}`);
    } catch (parseError: any) {
      addDebugLog(`Error parsing request body: ${parseError.message}`);
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
    const existingUser = global.mockUsers.find(user => user.email === email);
    
    if (existingUser) {
      addDebugLog(`User already exists: ${email}`);
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user with a simple ID
    const newUser = {
      id: generateId(),
      email,
      password,
      createdAt: new Date()
    };
    
    // Add to our mock database
    global.mockUsers.push(newUser);
    
    addDebugLog(`Test user created successfully: id=${newUser.id}, email=${newUser.email}`);
    addDebugLog(`Current mockUsers count: ${global.mockUsers.length}`);
    
    // Return success without exposing password
    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    addDebugLog(`Error creating test user: ${error.message}`);
    console.error('Error creating test user:', error);
    
    // Return error message
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create test user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  addDebugLog('Received test user list request');
  
  try {
    // Return the current list of users (without passwords)
    const safeUsers = global.mockUsers.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      country: user.country,
      createdAt: user.createdAt
    }));
    
    addDebugLog(`Returning ${safeUsers.length} test users`);
    
    return NextResponse.json({
      success: true,
      users: safeUsers,
      count: safeUsers.length
    });
  } catch (error: any) {
    addDebugLog(`Error listing test users: ${error.message}`);
    console.error('Error listing test users:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to list test users' },
      { status: 500 }
    );
  }
}
