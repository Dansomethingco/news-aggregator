import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Function to create a mock Prisma client that won't crash the app
function createMockPrismaClient() {
  console.warn('Using mock Prisma client - database features will not work');
  return new Proxy({} as PrismaClient, {
    get(target, prop) {
      // For common methods, return functions that resolve with empty data
      if (prop === 'user') {
        return {
          findMany: async () => [],
          findUnique: async () => null,
          create: async () => ({}),
          update: async () => ({}),
          delete: async () => ({}),
        };
      }
      // For any other property access, return a no-op function
      return () => Promise.resolve({});
    },
  });
}

// This approach ensures we don't instantiate too many clients in development
// and provides a fallback for production when DATABASE_URL is not available
function getPrismaClient() {
  try {
    // In production without DATABASE_URL, use mock client
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not found in production environment, using mock client');
      return createMockPrismaClient();
    }
    
    // In development, reuse the existing client
    if (process.env.NODE_ENV !== 'production') {
      if (!global.prisma) {
        global.prisma = new PrismaClient({
          log: ['error'],
        });
        console.log('Development PrismaClient initialized');
      }
      return global.prisma;
    }
    
    // In production with DATABASE_URL, create a new client
    return new PrismaClient({
      log: ['error'],
    });
  } catch (error) {
    console.error('Failed to initialize PrismaClient:', error);
    // Use the mock client instead of crashing
    return createMockPrismaClient();
  }
}

const prisma = getPrismaClient();

export default prisma;
