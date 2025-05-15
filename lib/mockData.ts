// Mock data utilities for development environment
// This provides a more resilient way to handle mock data in serverless environments

// Type definitions
export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  country?: string;
  createdAt?: Date;
}

// In-memory storage that doesn't rely on global variables
let mockUsersStore: MockUser[] = [];
let debugLogStore: string[] = [];

// Initialize with some default data if needed
export function initMockData() {
  // Only initialize if empty
  if (mockUsersStore.length === 0) {
    console.log('Initializing mock data store');
  }
}

// User management functions
export function getMockUsers(): MockUser[] {
  return mockUsersStore;
}

export function addMockUser(user: MockUser): void {
  mockUsersStore.push(user);
}

export function updateMockUser(index: number, user: MockUser): void {
  if (index >= 0 && index < mockUsersStore.length) {
    mockUsersStore[index] = user;
  }
}

export function findMockUserByEmail(email: string): MockUser | undefined {
  return mockUsersStore.find(user => user.email === email);
}

export function findMockUserById(id: string): MockUser | undefined {
  return mockUsersStore.find(user => user.id === id);
}

export function getMockUserIndex(id: string): number {
  return mockUsersStore.findIndex(user => user.id === id);
}

// Debug log functions
export function addDebugLog(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}`;
  console.log(logEntry);
  debugLogStore.push(logEntry);
  
  // Keep log size manageable
  if (debugLogStore.length > 1000) {
    debugLogStore = debugLogStore.slice(-1000);
  }
}

export function getDebugLogs(): string[] {
  return debugLogStore;
}

// Simple ID generator
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Initialize mock data
initMockData();
