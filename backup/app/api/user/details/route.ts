import { NextRequest, NextResponse } from 'next/server';
import { 
  getMockUsers, 
  updateMockUser, 
  addDebugLog, 
  getMockUserIndex,
  MockUser 
} from '@/lib/mockData';

// Using addDebugLog imported from mockData.ts

export async function POST(request: NextRequest) {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  addDebugLog(`Received user details update request (Development mode: ${isDev})`);
  
  // Only allow this API to work in development mode
  if (!isDev) {
    addDebugLog('Rejected request: Not in development mode');
    return NextResponse.json(
      { message: 'This API is only available in development mode' },
      { status: 403 }
    );
  }
  
  try {    
    // Parse request body
    let body;
    try {
      body = await request.json();
      const { firstName, lastName, dateOfBirth } = body;
      addDebugLog(`Request body parsed successfully: ${JSON.stringify({ firstName, lastName, dateOfBirth })}`);
    } catch (parseError: any) {
      addDebugLog(`Error parsing request body: ${parseError.message}`);
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { firstName, lastName, dateOfBirth } = body;
    
    // In a real app, we would get the user ID from the session
    // For now, we'll just update the first user in our mock storage
    const mockUsers = getMockUsers();
    if (mockUsers.length === 0) {
      addDebugLog('No users found in mock storage');
      return NextResponse.json(
        { message: 'No user found' },
        { status: 404 }
      );
    }
    
    // Get the first user (in a real app, this would be the authenticated user)
    const userIndex = 0;
    const userId = mockUsers[userIndex].id;
    
    addDebugLog(`Updating user details for user: ${userId}`);
    
    // Update user with the provided details
    const updatedUser: MockUser = {
      ...mockUsers[userIndex],
      firstName,
      lastName,
      dateOfBirth,
    };
    
    updateMockUser(userIndex, updatedUser);
    
    addDebugLog('User details updated successfully');
    
    return NextResponse.json({
      message: 'User details updated successfully',
      user: {
        id: userId,
        email: updatedUser.email,
        firstName,
        lastName,
        dateOfBirth,
      },
      developmentOnly: true
    });
  } catch (error: any) {
    addDebugLog(`Error updating user details: ${error.message}`);
    console.error('Error updating user details:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to update user details' },
      { status: 500 }
    );
  }
}
