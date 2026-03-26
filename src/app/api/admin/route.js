import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  return user?.role === 'ADMIN' ? session : null;
}

// GET: Admin dashboard stats
export async function GET(request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';

    if (action === 'stats') {
      const [totalUsers, totalQuestions, totalCompanies, totalMockAttempts, totalChats] = await Promise.all([
        prisma.user.count(),
        prisma.examQuestion.count(),
        prisma.company.count(),
        prisma.mockTestAttempt.count(),
        prisma.chatMessage.count(),
      ]);

      const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true, role: true },
      });

      return NextResponse.json({
        stats: { totalUsers, totalQuestions, totalCompanies, totalMockAttempts, totalChats },
        recentUsers,
      });
    }

    if (action === 'users') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, college: true, branch: true, cgpa: true, createdAt: true },
      });
      return NextResponse.json({ users });
    }

    if (action === 'questions') {
      const questions = await prisma.examQuestion.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return NextResponse.json({ questions });
    }

    if (action === 'companies') {
      const companies = await prisma.company.findMany({
        include: { _count: { select: { questions: true, experiences: true } } },
      });
      return NextResponse.json({ companies });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Admin create/update actions
export async function POST(request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

    const { action, ...data } = await request.json();

    if (action === 'updateRole') {
      await prisma.user.update({ where: { id: data.userId }, data: { role: data.role } });
      return NextResponse.json({ success: true });
    }

    if (action === 'addQuestion') {
      const question = await prisma.examQuestion.create({ data: data.question });
      return NextResponse.json({ question }, { status: 201 });
    }

    if (action === 'deleteQuestion') {
      await prisma.examQuestion.delete({ where: { id: data.questionId } });
      return NextResponse.json({ success: true });
    }

    if (action === 'addCompany') {
      const company = await prisma.company.create({ data: data.company });
      return NextResponse.json({ company }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
