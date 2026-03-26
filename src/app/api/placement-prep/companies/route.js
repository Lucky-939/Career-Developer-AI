import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: { select: { questions: true, experiences: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Companies API error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
