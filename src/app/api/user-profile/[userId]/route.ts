import { NextRequest, NextResponse } from 'next/server';
import UserProfile from '@/models/UserProfile';
import { dbConnect } from '@/models/UserProfile'; // Assuming dbConnect is exported from here

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const { userId } = params;

    const userProfile = await UserProfile.findById(userId);

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}