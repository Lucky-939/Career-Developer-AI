import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, college, branch, cgpa, currentYear, skills, programmingLangs, careerGoals } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        college: college || 'VPPCOE',
        branch: branch || null,
        cgpa: cgpa ? parseFloat(cgpa) : null,
        currentYear: currentYear || null,
        skills: skills || [],
        programmingLangs: programmingLangs || [],
        careerGoals: careerGoals || null,
      },
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
