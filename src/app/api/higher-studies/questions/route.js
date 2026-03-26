import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const examType = searchParams.get('examType');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');

    const where = {};
    if (examType) where.examType = examType;
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;

    const questions = await prisma.examQuestion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get unique topics for the exam
    const topics = await prisma.examQuestion.findMany({
      where: examType ? { examType } : {},
      select: { topic: true },
      distinct: ['topic'],
    });

    return NextResponse.json({
      questions,
      topics: topics.map((t) => t.topic),
      total: questions.length,
    });
  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
