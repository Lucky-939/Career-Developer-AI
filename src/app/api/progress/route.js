import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST: Save user progress on a question
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { questionId, correct } = await request.json();

    const progress = await prisma.userProgress.upsert({
      where: { userId_questionId: { userId: session.user.id, questionId } },
      update: { correct, attemptedAt: new Date() },
      create: { userId: session.user.id, questionId, correct, attempted: true },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

// GET: Fetch user progress summary
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ progress: [], summary: {} });

    const progress = await prisma.userProgress.findMany({
      where: { userId: session.user.id },
      orderBy: { attemptedAt: 'desc' },
    });

    // Calculate weekly activity
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekProgress = progress.filter((p) => new Date(p.attemptedAt) >= weekAgo);

    const summary = {
      totalAttempted: progress.length,
      totalCorrect: progress.filter((p) => p.correct).length,
      accuracy: progress.length > 0 ? Math.round((progress.filter((p) => p.correct).length / progress.length) * 100) : 0,
      thisWeek: weekProgress.length,
    };

    return NextResponse.json({ progress, summary });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ progress: [], summary: {} });
  }
}
