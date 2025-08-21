import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/Task';
import { dbConnect } from '@/models/Task';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Simple validation
    if (!body.dailyMood || !body.energy || !body.discomfort) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTask = new Task({
        dailyMood: body.dailyMood,
        energy: body.energy,
        discomfort: body.discomfort,
        taskRemember: body.taskRemember,
    });

    await newTask.save();

    return NextResponse.json({ message: 'Task created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
