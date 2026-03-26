import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cgpa, branch, skills, languages, internship, careerGoal } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are an expert career advisor for Indian engineering students. Analyze this student profile and provide company eligibility analysis:

Student Profile:
- CGPA: ${cgpa || 'Not provided'}
- Branch: ${branch || 'Not provided'}
- Skills: ${skills || 'Not provided'}
- Programming Languages: ${languages || 'Not provided'}
- Internship Experience: ${internship || 'No'}
- Career Goal: ${careerGoal || 'Job'}

For Indian IT companies, analyze:
1. Eligible companies (where this student CAN apply with good chances)
2. Borderline companies (close but missing something - specify what)
3. Companies to avoid right now (and why)
4. Suggested upskilling roadmap (6 months, 3-4 concrete steps)

Respond ONLY with valid JSON:
{
  "eligible": [{"name": "Company", "package": "X LPA", "type": "Service/Product/Startup", "reason": "why eligible"}],
  "borderline": [{"name": "Company", "package": "X LPA", "missing": "what's missing", "action": "what to do"}],
  "avoid": [{"name": "Company", "reason": "why to avoid for now"}],
  "roadmap": [{"month": "Month 1-2", "focus": "Area", "tasks": ["task1", "task2"]}],
  "overallAdvice": "One paragraph of honest, personalized career advice"
}`;

    if (!apiKey) {
      const c = parseFloat(cgpa) || 0;
      return NextResponse.json({
        result: {
          eligible: [
            { name: 'TCS', package: '3.6-7 LPA', type: 'Service', reason: `Accepts CGPA ${c >= 6 ? 'above' : 'near'} 6.0. Strong hiring volume.` },
            { name: 'Infosys', package: '3.6-5 LPA', type: 'Service', reason: 'Mass recruiter, values aptitude skills.' },
            { name: 'Wipro', package: '3.5-6 LPA', type: 'Service', reason: 'Open to most engineering branches.' },
            ...(c >= 6.5 ? [{ name: 'Accenture', package: '4.5-7 LPA', type: 'MNC', reason: 'Good for candidates with communication skills.' }] : []),
          ],
          borderline: [
            ...(c < 7.5 ? [{ name: 'Microsoft', package: '15-44 LPA', missing: `CGPA ${c} vs required 7.5+`, action: 'Focus on competitive programming and strong projects.' }] : []),
            { name: 'Razorpay', package: '12-30 LPA', missing: 'Need strong project portfolio', action: 'Build 2-3 full-stack projects and contribute to open source.' },
          ],
          avoid: [
            ...(c < 8 ? [{ name: 'Google', reason: `CGPA ${c} is below their typical 8.0+ cutoff. Focus on building skills first.` }] : []),
            ...(c < 7 ? [{ name: 'Amazon', reason: `CGPA ${c} below 7.0 requirement. Upskill in DSA first.` }] : []),
          ],
          roadmap: [
            { month: 'Month 1-2', focus: 'Core DSA', tasks: ['Complete Arrays, Strings, LinkedList on LeetCode', 'Solve 50+ Easy problems', 'Learn time/space complexity'] },
            { month: 'Month 3-4', focus: 'Advanced Concepts', tasks: ['Trees, Graphs, DP patterns', 'Solve 50+ Medium problems', 'Build 1 full-stack project'] },
            { month: 'Month 5-6', focus: 'Mock Tests & Applications', tasks: ['Take weekly mock tests', 'Practice aptitude (RS Aggarwal)', 'Apply to target companies', 'Prepare HR interview answers'] },
          ],
          overallAdvice: `With a CGPA of ${c} and ${skills || 'basic'} skills, you're well-positioned for service-based companies. To target product companies, focus on strengthening your DSA skills and building impressive projects. Start with LeetCode Easy problems and gradually move to Medium. Your ${languages || 'programming'} background is a good foundation — leverage it by building real-world projects.`,
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
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let result;
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { eligible: [], borderline: [], avoid: [], roadmap: [], overallAdvice: 'Unable to analyze. Please try again.' };
    }

    return NextResponse.json({ result, source: 'gemini' });
  } catch (error) {
    console.error('Career analyze error:', error);
    return NextResponse.json({ error: 'Failed to analyze career' }, { status: 500 });
  }
}
