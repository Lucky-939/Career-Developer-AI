import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { difficulty: 'asc' } },
        experiences: { orderBy: { year: 'desc' } },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Company detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}
