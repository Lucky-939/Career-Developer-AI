import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST: Analyze resume text with Gemini
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { resumeText, userProfile } = await request.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist for Indian engineering students.

Analyze this resume text and return a detailed evaluation:

RESUME TEXT:
${resumeText.substring(0, 4000)}

STUDENT PROFILE (if available):
${userProfile ? JSON.stringify(userProfile) : 'Not provided'}

Respond ONLY with valid JSON:
{
  "score": 72,
  "strengths": ["Strong project section", "Good formatting"],
  "weaknesses": ["No quantifiable achievements", "Missing keywords"],
  "missingKeywords": ["Docker", "System Design", "CI/CD"],
  "suggestedImprovements": ["Add metrics to achievements", "Include a summary section"],
  "atsFriendly": true,
  "targetRoles": ["SDE-1", "Backend Developer"]
}

Score from 0-100: 0-30=Poor, 31-50=Needs Work, 51-70=Average, 71-85=Good, 86-100=Excellent`;

    let analysis;

    if (!apiKey) {
      const wordCount = resumeText.split(/\s+/).length;
      const hasProjects = /project/i.test(resumeText);
      const hasSkills = /skill/i.test(resumeText);
      const hasExperience = /experience|intern/i.test(resumeText);
      let score = 40;
      if (hasProjects) score += 15;
      if (hasSkills) score += 10;
      if (hasExperience) score += 15;
      if (wordCount > 200) score += 10;

      analysis = {
        score: Math.min(score, 95),
        strengths: [
          ...(hasProjects ? ['Includes project descriptions'] : []),
          ...(hasSkills ? ['Technical skills section present'] : []),
          ...(hasExperience ? ['Relevant experience mentioned'] : []),
          'Resume text provided for analysis',
        ],
        weaknesses: [
          ...(!hasProjects ? ['No projects section found'] : []),
          ...(!hasSkills ? ['Skills section missing'] : []),
          'Consider adding quantifiable achievements',
          'Add more industry-specific keywords',
        ],
        missingKeywords: ['Docker', 'Kubernetes', 'CI/CD', 'System Design', 'AWS', 'Agile'],
        suggestedImprovements: [
          'Add metrics (e.g., "Reduced load time by 40%")',
          'Include a professional summary at the top',
          'Use action verbs (Built, Designed, Implemented)',
          'Add relevant certifications',
          'Keep it to 1 page for freshers',
        ],
        atsFriendly: wordCount > 150 && hasSkills,
        targetRoles: ['Software Developer', 'Backend Engineer', 'Full Stack Developer'],
      };
    } else {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.5 },
          }),
        }
      );
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      try {
        analysis = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      } catch {
        analysis = { score: 50, strengths: [], weaknesses: ['Unable to parse analysis'], missingKeywords: [], suggestedImprovements: [], atsFriendly: false, targetRoles: [] };
      }
    }

    // Save to DB if authenticated
    if (session?.user?.id) {
      await prisma.resumeAnalysis.create({
        data: {
          userId: session.user.id,
          score: analysis.score || 0,
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          keywords: analysis.missingKeywords || [],
          suggestions: analysis.suggestedImprovements || [],
          atsFriendly: analysis.atsFriendly || false,
          targetRoles: analysis.targetRoles || [],
        },
      });
    }

    return NextResponse.json({ analysis, source: apiKey ? 'gemini' : 'mock' });
  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}

// GET: Fetch resume analysis history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ analyses: [] });

    const analyses = await prisma.resumeAnalysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Resume history error:', error);
    return NextResponse.json({ analyses: [] });
  }
}
