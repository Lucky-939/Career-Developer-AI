import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET: Fetch chat history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ messages: [] });
  }
}

// POST: Send message and get AI response
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get user profile for context injection
    let userContext = '';
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, college: true, branch: true, cgpa: true, skills: true, programmingLangs: true, careerGoals: true, currentYear: true },
      });

      if (user) {
        userContext = `
Student Profile:
- Name: ${user.name}
- College: ${user.college || 'Not set'}
- Branch: ${user.branch || 'Not set'}
- CGPA: ${user.cgpa || 'Not set'}
- Current Year: ${user.currentYear || 'Not set'}
- Skills: ${user.skills?.join(', ') || 'Not set'}
- Programming Languages: ${user.programmingLangs?.join(', ') || 'Not set'}
- Career Goal: ${user.careerGoals || 'Not set'}`;
      }
    }

    const systemPrompt = `You are CareerDev AI, a career advisor for Indian engineering students at VPPCOE.
You help with: career planning, placement preparation, higher studies guidance, skill development, and resume building.
Be specific, actionable, and encouraging. Use examples and formatting (bold, bullet points) for clarity.
Keep responses concise but comprehensive. Personalize advice based on the student's profile.
${userContext}`;

    const apiKey = process.env.GEMINI_API_KEY;

    let aiResponse;

    if (!apiKey) {
      aiResponse = `Great question! Here's my personalized advice:\n\n**Key Recommendations:**\n1. Focus on building practical projects that demonstrate your skills\n2. Practice DSA on LeetCode/HackerRank daily\n3. Build a strong LinkedIn profile and GitHub portfolio\n4. Network with alumni and attend tech meetups\n5. Start applying 3-4 months before placement season\n\n*Note: Connect your Gemini API key in .env for fully personalized AI responses.*`;
    } else {
      const chatHistory = (history || []).slice(-8).map((m) => ({
        role: m.role === 'AI' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt }] },
              { role: 'model', parts: [{ text: 'I understand. I am CareerDev AI, ready to help with personalized career guidance.' }] },
              ...chatHistory,
              { role: 'user', parts: [{ text: message }] },
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );

      const data = await response.json();
      aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';
    }

    // Persist messages to DB if user is authenticated
    if (session?.user?.id) {
      await prisma.chatMessage.createMany({
        data: [
          { userId: session.user.id, role: 'USER', content: message },
          { userId: session.user.id, role: 'AI', content: aiResponse },
        ],
      });
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { response: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE: Clear chat history
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.chatMessage.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear chat error:', error);
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
