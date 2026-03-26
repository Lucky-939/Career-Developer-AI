'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiBookOpen, FiBriefcase, FiTarget, FiCpu,
  FiTrendingUp, FiAward, FiClock, FiArrowRight,
  FiCheckCircle, FiAlertTriangle,
} from 'react-icons/fi';
import { PageSkeleton } from '@/components/Skeleton';
import styles from './dashboard.module.css';

const quickActions = [
  { icon: <FiBookOpen size={24} />, title: 'Higher Studies', desc: 'Practice GATE, GRE, CAT & more', href: '/higher-studies', color: '#8b5cf6' },
  { icon: <FiBriefcase size={24} />, title: 'Placement Prep', desc: 'Company questions & mock drives', href: '/placement-prep', color: '#3b82f6' },
  { icon: <FiTarget size={24} />, title: 'Career Developer', desc: 'Eligibility finder & career paths', href: '/career-dev', color: '#10b981' },
  { icon: <FiCpu size={24} />, title: 'AI Career Chat', desc: 'Get personalized career advice', href: '/ai-chat', color: '#f59e0b' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/dashboard')
        .then((r) => r.json())
        .then((data) => { setDashData(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <PageSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const stats = dashData?.stats || {};
  const user = dashData?.user || {};

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Welcome */}
        <motion.div className={styles.welcomeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, <span className="gradient-text">{session.user?.name?.split(' ')[0] || 'Student'}</span>! 👋
            </h1>
            <p className={styles.welcomeDesc}>
              {user.currentYear ? `${user.currentYear} • ${user.branch || 'Engineering'} • ${user.college || 'VPPCOE'}` : 'Complete your profile for personalized recommendations.'}
            </p>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FiTrendingUp size={20} /></div>
              <div><strong>{stats.questionsAttempted || 0}</strong><span>Questions</span></div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FiAward size={20} /></div>
              <div><strong>{stats.mockTestsTaken || 0}</strong><span>Mock Tests</span></div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><FiClock size={20} /></div>
              <div><strong>{stats.accuracy || 0}%</strong><span>Accuracy</span></div>
            </div>
          </div>
        </motion.div>

        {/* Widgets Row */}
        <div className={styles.widgetsRow}>
          {/* Placement Readiness */}
          <motion.div className={styles.widget} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <h3>📊 Placement Readiness</h3>
            <div className={styles.gaugeWrapper}>
              <div className={styles.gauge}>
                <svg viewBox="0 0 120 120" width="100" height="100">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--purple-500)" strokeWidth="10" strokeDasharray={`${(stats.placementScore || 0) * 3.14} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <span className={styles.gaugeText}>{stats.placementScore || 0}%</span>
              </div>
              <p className={styles.widgetHint}>
                {stats.placementScore >= 70 ? '🎉 You are well prepared!' : stats.placementScore >= 40 ? '⚡ Good progress. Keep going!' : '🚀 Start with mock tests to boost your score.'}
              </p>
            </div>
          </motion.div>

          {/* Higher Studies Summary */}
          <motion.div className={styles.widget} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3>🎓 Higher Studies</h3>
            <div className={styles.widgetBody}>
              <div className={styles.widgetStat}>
                <FiCheckCircle color="#10b981" size={16} />
                <span>{stats.questionsAttempted || 0} exam questions practiced</span>
              </div>
              <div className={styles.widgetStat}>
                <FiCheckCircle color="#10b981" size={16} />
                <span>{stats.accuracy || 0}% accuracy rate</span>
              </div>
              {user.cgpa && (
                <div className={styles.widgetStat}>
                  <FiAlertTriangle color="#f59e0b" size={16} />
                  <span>CGPA {user.cgpa} — {user.cgpa >= 8 ? 'Eligible for Tier-1 universities' : user.cgpa >= 7 ? 'Good for Tier-2 universities' : 'Explore all options in University Finder'}</span>
                </div>
              )}
              <Link href="/higher-studies" className="btn btn-sm btn-secondary" style={{ marginTop: 8 }}>Go to Exam Prep →</Link>
            </div>
          </motion.div>

          {/* Career Path */}
          <motion.div className={styles.widget} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h3>🛤️ Career Path</h3>
            <div className={styles.widgetBody}>
              <p className={styles.careerAdvice}>{dashData?.careerRecommendation || 'Complete your profile for personalized advice.'}</p>
              {user.careerGoals && <span className="badge badge-purple">Goal: {user.careerGoals}</span>}
              {user.skills?.length > 0 && (
                <div className={styles.skillTags}>
                  {user.skills.slice(0, 4).map((s) => <span key={s} className="badge">{s}</span>)}
                  {user.skills.length > 4 && <span className="badge">+{user.skills.length - 4}</span>}
                </div>
              )}
              <Link href="/career-dev" className="btn btn-sm btn-secondary" style={{ marginTop: 8 }}>Analyze Career →</Link>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <motion.div key={action.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
                <Link href={action.href} className={styles.actionCard}>
                  <div className={styles.actionIcon} style={{ color: action.color, background: `${action.color}12` }}>
                    {action.icon}
                  </div>
                  <div className={styles.actionContent}>
                    <h3>{action.title}</h3>
                    <p>{action.desc}</p>
                  </div>
                  <FiArrowRight className={styles.actionArrow} size={18} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Profile Completion */}
        <motion.div className={styles.profileCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className={styles.profileHeader}>
            <h3>{stats.profileCompletion >= 100 ? '✅ Profile Complete' : '📋 Complete Your Profile'}</h3>
            {stats.profileCompletion < 100 && <Link href="/career-dev" className="btn btn-sm btn-primary">Complete Now</Link>}
          </div>
          <div className={styles.profileProgress}>
            <div className={styles.progressLabel}>
              <span>Profile Completion</span>
              <span>{stats.profileCompletion || 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.profileCompletion || 0}%` }} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
