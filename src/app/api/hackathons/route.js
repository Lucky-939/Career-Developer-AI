import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET: Fetch hackathons (upcoming AI-generated or user's registrations)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'upcoming';

    if (tab === 'my' && session?.user?.id) {
      const hackathons = await prisma.hackathon.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      });
      const stats = {
        total: hackathons.length,
        won: hackathons.filter((h) => h.status === 'WON').length,
        ongoing: hackathons.filter((h) => h.status === 'ONGOING').length,
        completed: hackathons.filter((h) => h.status === 'COMPLETED').length,
      };
      return NextResponse.json({ hackathons, stats });
    }

    // Generate upcoming hackathons (mock data - would use Gemini in production)
    const upcoming = [
      { name: 'Smart India Hackathon 2026', date: '2026-08-15', platform: 'SIH Portal', prize: '₹1,00,000', difficulty: 'Medium', tags: ['AI/ML', 'Web Dev', 'IoT'], registrationUrl: '#', description: 'India\'s biggest student hackathon organized by AICTE & Government of India.' },
      { name: 'HackWithInfy', date: '2026-07-01', platform: 'Infosys', prize: 'Pre-placement + ₹2,00,000', difficulty: 'Medium', tags: ['Coding', 'DSA', 'Development'], registrationUrl: '#', description: 'Infosys coding challenge with pre-placement interviews for winners.' },
      { name: 'TCS CodeVita', date: '2026-06-20', platform: 'TCS', prize: '$10,000 + Job Offer', difficulty: 'Hard', tags: ['Competitive Coding', 'Algorithms'], registrationUrl: '#', description: 'Global coding competition by TCS for engineering students worldwide.' },
      { name: 'Google Solution Challenge', date: '2026-09-01', platform: 'Google', prize: 'Mentorship + Swag', difficulty: 'Hard', tags: ['Google Cloud', 'Flutter', 'ML'], registrationUrl: '#', description: 'Annual Google challenge to solve real-world problems using Google technologies.' },
      { name: 'MLH Fellowship Hackathon', date: '2026-05-10', platform: 'MLH', prize: 'Fellowship Opportunity', difficulty: 'Medium', tags: ['Open Source', 'Full Stack', 'DevOps'], registrationUrl: '#', description: 'Major League Hacking hackathon for aspiring open-source contributors.' },
      { name: 'Microsoft Imagine Cup', date: '2026-10-01', platform: 'Microsoft', prize: '$100,000', difficulty: 'Hard', tags: ['Azure', 'AI', 'Cloud'], registrationUrl: '#', description: 'Microsoft\'s global student technology competition.' },
      { name: 'Amazon ML Challenge', date: '2026-07-20', platform: 'Amazon', prize: '₹5,00,000 + Pre-placement', difficulty: 'Hard', tags: ['Machine Learning', 'Data Science'], registrationUrl: '#', description: 'Amazon\'s ML challenge for Indian engineering students.' },
      { name: 'AngelHack Global', date: '2026-06-01', platform: 'AngelHack', prize: 'Accelerator Program', difficulty: 'Medium', tags: ['Startup', 'Blockchain', 'FinTech'], registrationUrl: '#', description: 'Global hackathon series focused on building startup-ready products.' },
      { name: 'ICPC Regionals', date: '2026-11-01', platform: 'ICPC', prize: 'World Finals Qualification', difficulty: 'Hard', tags: ['Competitive Programming', 'Algorithms'], registrationUrl: '#', description: 'International Collegiate Programming Contest — the Olympics of programming.' },
      { name: 'VPPCOE Internal Hackathon', date: '2026-04-15', platform: 'VPPCOE', prize: '₹25,000 + Certificate', difficulty: 'Easy', tags: ['Web Dev', 'App Dev', 'IoT'], registrationUrl: '#', description: 'College-level hackathon for VPPCOE students. Great for building portfolio.' },
    ];

    return NextResponse.json({ hackathons: upcoming });
  } catch (error) {
    console.error('Hackathons API error:', error);
    return NextResponse.json({ error: 'Failed to fetch hackathons' }, { status: 500 });
  }
}

// POST: Register for a hackathon
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, date, platform, teamSize, status } = await request.json();

    const hackathon = await prisma.hackathon.create({
      data: {
        userId: session.user.id,
        name,
        date: date ? new Date(date) : null,
        platform: platform || null,
        teamSize: teamSize ? parseInt(teamSize) : null,
        status: status || 'REGISTERED',
      },
    });

    return NextResponse.json({ hackathon }, { status: 201 });
  } catch (error) {
    console.error('Hackathon register error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}

// PATCH: Update hackathon status
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status, result } = await request.json();

    const hackathon = await prisma.hackathon.update({
      where: { id, userId: session.user.id },
      data: { status, result },
    });

    return NextResponse.json({ hackathon });
  } catch (error) {
    console.error('Hackathon update error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
