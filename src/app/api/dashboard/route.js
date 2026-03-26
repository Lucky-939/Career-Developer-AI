import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        mockAttempts: { orderBy: { completedAt: 'desc' }, take: 5 },
        examAttempts: true,
        careerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate profile completion
    const fields = ['name', 'email', 'college', 'branch', 'cgpa', 'skills', 'programmingLangs', 'careerGoals', 'currentYear'];
    const filled = fields.filter((f) => {
      const val = user[f];
      if (Array.isArray(val)) return val.length > 0;
      return val != null && val !== '';
    });
    const profileCompletion = Math.round((filled.length / fields.length) * 100);

    // Calculate placement readiness (based on profile + activity)
    let placementScore = 0;
    if (user.cgpa) placementScore += 15;
    if (user.skills?.length > 0) placementScore += 15;
    if (user.programmingLangs?.length > 0) placementScore += 15;
    if (user.mockAttempts?.length > 0) placementScore += 20;
    if (user.examAttempts?.length > 0) placementScore += 15;
    if (user.careerProfile) placementScore += 20;

    // Higher studies summary
    const examAttemptCount = user.examAttempts?.length || 0;
    const correctAnswers = user.examAttempts?.filter((a) => a.isCorrect).length || 0;
    const accuracy = examAttemptCount > 0 ? Math.round((correctAnswers / examAttemptCount) * 100) : 0;

    // Career path recommendation
    let careerRecommendation = 'Complete your profile to get recommendations';
    if (user.careerGoals === 'Job') careerRecommendation = 'Focus on Placement Prep → Mock Tests → Company-specific practice';
    else if (user.careerGoals === 'Higher Studies') careerRecommendation = 'Focus on Exam Prep → University Research → Application Timeline';
    else if (user.careerGoals === 'Both') careerRecommendation = 'Balance placement prep with exam preparation → Keep options open';

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        cgpa: user.cgpa,
        skills: user.skills,
        programmingLangs: user.programmingLangs,
        careerGoals: user.careerGoals,
        currentYear: user.currentYear,
      },
      stats: {
        profileCompletion,
        placementScore,
        questionsAttempted: examAttemptCount,
        mockTestsTaken: user.mockAttempts?.length || 0,
        accuracy,
      },
      careerRecommendation,
      hasCareerProfile: !!user.careerProfile,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
