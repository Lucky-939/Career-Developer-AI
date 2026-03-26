import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCareerAdvice(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function analyzeResume(resumeText) {
  const prompt = `You are a career advisor for engineering students. Analyze this resume and provide:
1. Strengths identified
2. Areas for improvement
3. Suggested job roles
4. Skill gaps to fill
5. Overall rating (1-10)

Resume:
${resumeText}

Respond in JSON format with keys: strengths, improvements, suggestedRoles, skillGaps, rating`;

  return generateCareerAdvice(prompt);
}

export async function generateRoadmap(userProfile) {
  const prompt = `Based on this student profile, create a personalized career roadmap:
- Branch: ${userProfile.branch}
- CGPA: ${userProfile.cgpa}
- Skills: ${userProfile.skills?.join(', ')}
- Interests: ${userProfile.interests?.join(', ')}
- Career Goals: ${userProfile.careerGoals}

Provide a 6-month roadmap with monthly milestones, resources, and projects to build. Respond in JSON format.`;

  return generateCareerAdvice(prompt);
}

export async function chatWithAI(messages, userContext) {
  const systemPrompt = `You are CareerDev AI, an intelligent career advisor for engineering students at VPPCOE. 
You help with: career planning, placement preparation, higher studies guidance, skill development, and resume building.
Be specific, actionable, and encouraging. Use examples when possible.
${userContext ? `Student context: ${JSON.stringify(userContext)}` : ''}`;

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const chat = model.startChat({
    history: messages.map((m) => ({
      role: m.role === 'AI' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  });

  const result = await chat.sendMessage(systemPrompt);
  const response = await result.response;
  return response.text();
}

export default genAI;
