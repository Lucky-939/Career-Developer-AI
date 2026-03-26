import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Return a helpful mock response when API key is not configured
      const mockResponses = {
        default: `Great question! Here's my career advice:\n\n**Key Points:**\n1. Focus on building practical projects that demonstrate your skills\n2. Contribute to open-source projects on GitHub\n3. Practice DSA consistently on LeetCode/HackerRank\n4. Build a strong LinkedIn profile\n5. Network with alumni and industry professionals\n\n*Note: Connect your Gemini API key in the .env file for personalized AI responses.*`,
      };
      
      return NextResponse.json({ response: mockResponses.default });
    }

    // Call Gemini API
    const systemPrompt = `You are CareerDev AI, an intelligent career advisor for engineering students at VPPCOE.
You help with: career planning, placement preparation, higher studies guidance, skill development, and resume building.
Be specific, actionable, and encouraging. Use examples and formatting (bold, lists) for clarity.
Keep responses concise but comprehensive.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'I understand. I am CareerDev AI, ready to help engineering students with career guidance.' }] },
            ...history.slice(-6).map((m) => ({
              role: m.role === 'AI' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
            { role: 'user', parts: [{ text: message }] },
          ],
        }),
      }
    );

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { response: 'Sorry, I encountered an error. Please try again later.' },
      { status: 500 }
    );
  }
}
