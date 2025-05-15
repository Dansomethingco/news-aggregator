// This file is kept for compatibility but functionality is moved to client components
// for static export compatibility

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'error',
    message: 'API routes are not available in static export mode. Please use the client-side implementation.',
  }, { status: 503 });
}
