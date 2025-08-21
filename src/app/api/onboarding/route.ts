import { NextRequest, NextResponse } from 'next/server';
import UserProfile from '@/models/UserProfile';
import { dbConnect } from '@/models/UserProfile';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Simple validation
    if (!body.name || !body.days || !body.firstPregnancy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newUserProfile = new UserProfile({
        fullName: body.name,
        days: body.days,
        firstPreg: body.firstPregnancy === 'Yes',
        complications: body.pastComplications,
        conditions: body.conditions?.join(', '),
        medicines: body.meds,
        symptom: body.recentSymptoms,
        checkups: body.checkupsOnTime,
        dietPreferences: body.dietType,
        dietAllergy: body.allergies,
        meals: body.mealsPerDay,
        waterGoals: body.hydration,
        work: body.workType,
        sleep: body.sleepHours,
        activity: body.exercise,
        stressSource: body.stressors?.join(', '),
        support: body.support,
        motivation: body.motivation,
        location: body.location,
    });

    await newUserProfile.save();

    return NextResponse.json({ message: 'Profile created successfully', userId: newUserProfile._id }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
