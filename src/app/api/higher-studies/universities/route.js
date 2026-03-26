import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cgpa, country, budget, examScore, examType } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are an education counselor specializing in overseas university admissions for Indian engineering students.

Based on this student profile:
- CGPA: ${cgpa || 'Not provided'}
- Target Country: ${country || 'USA'}
- Budget (per year in USD): ${budget || 'Not specified'}
- Exam Type: ${examType || 'GRE'}
- Exam Score: ${examScore || 'Not taken yet'}

Provide a list of 6-8 realistic university recommendations. For EACH university, provide:
1. University name
2. Country and city
3. Tier (Tier-1, Tier-2, or Tier-3)
4. Admission chance (High, Medium, or Low) based on the student's profile
5. Approximate annual tuition (in USD)
6. Notable programs/strengths
7. Brief reason for the admission chance rating

IMPORTANT: Respond ONLY with a valid JSON array. No markdown, no explanation outside the JSON.
Format:
[
  {
    "name": "University Name",
    "country": "Country",
    "city": "City",
    "tier": "Tier-1",
    "chance": "High",
    "tuition": "$30,000/year",
    "programs": ["CS", "AI/ML"],
    "reason": "Strong match because..."
  }
]`;

    if (!apiKey) {
      // Return mock data when API key not configured
      const mockUniversities = [
        { name: 'Arizona State University', country: 'USA', city: 'Tempe', tier: 'Tier-2', chance: 'High', tuition: '$31,000/year', programs: ['CS', 'Software Engineering'], reason: `Good match for CGPA ${cgpa || '7.0'}. ASU has high acceptance rate.` },
        { name: 'University of Texas at Dallas', country: 'USA', city: 'Dallas', tier: 'Tier-2', chance: 'Medium', tuition: '$28,000/year', programs: ['CS', 'AI/ML', 'Data Science'], reason: 'Competitive program but achievable with strong GRE score.' },
        { name: 'SUNY Buffalo', country: 'USA', city: 'Buffalo', tier: 'Tier-2', chance: 'High', tuition: '$23,000/year', programs: ['CS', 'Information Systems'], reason: 'Affordable option with good placement record.' },
        { name: 'TU Munich', country: 'Germany', city: 'Munich', tier: 'Tier-1', chance: 'Medium', tuition: '€3,000/year', programs: ['CS', 'Robotics', 'AI'], reason: 'Very affordable but competitive admission.' },
        { name: 'University of Melbourne', country: 'Australia', city: 'Melbourne', tier: 'Tier-1', chance: 'Medium', tuition: '$35,000/year', programs: ['IT', 'Software Engineering'], reason: 'Prestigious but requires strong academic profile.' },
        { name: 'University of Windsor', country: 'Canada', city: 'Windsor', tier: 'Tier-3', chance: 'High', tuition: 'CAD 20,000/year', programs: ['CS', 'Engineering'], reason: 'Good pathway for Canadian PR with affordable tuition.' },
      ];
      return NextResponse.json({ universities: mockUniversities, source: 'mock' });
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
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    // Parse JSON from response (handle markdown code blocks)
    let universities;
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      universities = JSON.parse(cleaned);
    } catch {
      universities = [];
    }

    return NextResponse.json({ universities, source: 'gemini' });
  } catch (error) {
    console.error('University finder error:', error);
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 });
  }
}
