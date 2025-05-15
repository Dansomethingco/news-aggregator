import { NextResponse } from 'next/server';
import { getMockUsers } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isDev) {
      return NextResponse.json(
        { message: 'Admin API is only available in development mode' },
        { status: 403 }
      );
    }
    
    // Get mock users instead of using Prisma
    const mockUsers = getMockUsers();
    
    // Map to the format expected by the admin UI
    const users = mockUsers.map(user => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt || new Date(),
    }));
    
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message || 'Unknown error', users: [] },
      { status: 500 }
    );
  }
}
