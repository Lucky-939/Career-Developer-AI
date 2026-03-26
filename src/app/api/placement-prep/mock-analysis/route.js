import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { score, totalMarks, answers, sectionScores } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are a placement advisor. A student just completed a mock test with these results:
- Score: ${score}/${totalMarks} (${Math.round((score / totalMarks) * 100)}%)
- Section Scores: ${JSON.stringify(sectionScores)}

Analyze the performance and provide:
1. Overall assessment
2. Weak areas that need improvement (list 3-5)
3. Missing skills for top companies
4. Specific study recommendations
5. Suggested companies based on this performance level

Respond ONLY with valid JSON:
{
  "assessment": "string",
  "weakAreas": ["area1", "area2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendations": ["rec1", "rec2"],
  "suggestedCompanies": ["company1", "company2"],
  "overallRating": "Needs Improvement | Average | Good | Excellent"
}`;

    if (!apiKey) {
      const pct = Math.round((score / totalMarks) * 100);
      return NextResponse.json({
        analysis: {
          assessment: pct >= 70 ? 'Good performance! You are on track for service-based companies.' : 'Needs improvement. Focus on weak areas before applying.',
          weakAreas: ['Quantitative Aptitude', 'Data Structures', 'DBMS'],
          missingSkills: ['System Design', 'Advanced DSA', 'Problem Solving Speed'],
          recommendations: ['Practice aptitude daily', 'Solve 2 coding problems/day', 'Revise DBMS concepts', 'Take more mock tests'],
          suggestedCompanies: pct >= 70 ? ['TCS', 'Infosys', 'Wipro', 'Cognizant'] : ['TCS (with more prep)', 'Wipro (with more prep)'],
          overallRating: pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Average' : 'Needs Improvement',
        },
        source: 'mock',
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6 },
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let analysis;
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { assessment: 'Unable to analyze. Please try again.', weakAreas: [], missingSkills: [], recommendations: [], suggestedCompanies: [], overallRating: 'N/A' };
    }

    return NextResponse.json({ analysis, source: 'gemini' });
  } catch (error) {
    console.error('Mock analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze results' }, { status: 500 });
  }
}
