import { NextRequest, NextResponse } from 'next/server';
import { migrateAllData } from '@/lib/firebase/migration';
import { meals } from '@/lib/data/meals';

/**
 * API route to initialize Firestore with data from localStorage and mock data
 * This is used when first setting up the application to migrate existing data
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Migrate all data
    await migrateAllData(userId, meals);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error initializing data:', error);
    
    return NextResponse.json(
      { error: 'Failed to initialize data' },
      { status: 500 }
    );
  }
}
