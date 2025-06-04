import { NextResponse } from 'next/server';
import { getMockUsers, getDebugLogs } from '@/lib/mockData';

export async function GET() {
  try {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isDev) {
      return NextResponse.json({
        message: 'Debug API is only available in development mode',
      }, { status: 403 });
    }
    
    // Return the current state of mockUsers and logs
    // In a real app, you would never expose this information
    const mockUsers = getMockUsers();
    const debugLogs = getDebugLogs();
    
    return NextResponse.json({
      users: mockUsers.map(user => ({
        ...user,
        password: '********' // Don't expose real passwords
      })),
      userCount: mockUsers.length,
      logs: debugLogs,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    });
  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Debug endpoint error' },
      { status: 500 }
    );
  }
}
