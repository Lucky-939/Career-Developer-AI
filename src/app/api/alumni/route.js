import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET: Fetch alumni profiles + questions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const branch = searchParams.get('branch');
    const batchYear = searchParams.get('batchYear');

    const where = {};
    if (filter) where.company = { contains: filter, mode: 'insensitive' };
    if (branch) where.user = { branch };
    if (batchYear) where.batchYear = parseInt(batchYear);

    const profiles = await prisma.alumniProfile.findMany({
      where,
      include: { user: { select: { name: true, email: true, branch: true, image: true } } },
      orderBy: { batchYear: 'desc' },
    });

    const questions = await prisma.alumniQuestion.findMany({
      include: {
        student: { select: { name: true } },
        answers: { include: { alumni: { include: { user: { select: { name: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ profiles, questions });
  } catch (error) {
    console.error('Alumni API error:', error);
    return NextResponse.json({ profiles: [], questions: [] });
  }
}

// POST: Ask a question or submit an answer
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, ...data } = await request.json();

    if (action === 'ask') {
      const question = await prisma.alumniQuestion.create({
        data: { studentId: session.user.id, title: data.title, question: data.question, tags: data.tags || [] },
      });
      return NextResponse.json({ question }, { status: 201 });
    }

    if (action === 'answer') {
      // Check if user is alumni
      const profile = await prisma.alumniProfile.findUnique({ where: { userId: session.user.id } });
      if (!profile) return NextResponse.json({ error: 'Only alumni can answer' }, { status: 403 });

      const answer = await prisma.alumniAnswer.create({
        data: { questionId: data.questionId, alumniId: profile.id, answer: data.answer },
      });

      // Create notification for the student who asked
      const question = await prisma.alumniQuestion.findUnique({ where: { id: data.questionId } });
      if (question) {
        await prisma.notification.create({
          data: {
            userId: question.studentId,
            type: 'ALUMNI_REPLY',
            title: 'Alumni replied to your question!',
            message: `An alumni answered: "${data.answer.substring(0, 100)}..."`,
          },
        });
      }

      return NextResponse.json({ answer }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Alumni POST error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
