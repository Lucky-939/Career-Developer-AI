'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiBriefcase, FiTarget, FiCpu } from 'react-icons/fi';
import styles from './HeroSection.module.css';

const features = [
  {
    icon: <FiBookOpen size={22} />,
    title: 'Higher Studies',
    desc: 'GATE, GRE, CAT prep with AI-powered practice',
    color: '#8b5cf6',
  },
  {
    icon: <FiBriefcase size={22} />,
    title: 'Placement Prep',
    desc: 'Company-specific questions & mock drives',
    color: '#3b82f6',
  },
  {
    icon: <FiTarget size={22} />,
    title: 'Career Dev',
    desc: 'Personalized eligibility finder & skill gap analysis',
    color: '#10b981',
  },
  {
    icon: <FiCpu size={22} />,
    title: 'AI Chatbot',
    desc: 'Gemini-powered career advisor on demand',
    color: '#f59e0b',
  },
];

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background effects */}
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={styles.heroInner}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            Built for VPPCOE Engineering Students
          </div>

          <h1 className={styles.heroTitle}>
            From <span className="gradient-text-hero">Campus</span> to{' '}
            <span className="gradient-text">Corporate</span>
          </h1>

          <p className={styles.heroDesc}>
            AI-powered career development platform that combines higher studies preparation,
            placement training, and personalized career guidance — all in one place.
          </p>

          <div className={styles.heroCta}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Get Started Free
              <FiArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-lg">
              Explore Platform
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <strong>500+</strong>
              <span>Practice Questions</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong>50+</strong>
              <span>Companies</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong>AI</strong>
              <span>Powered by Gemini</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.heroCards}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className={styles.featureIcon} style={{ color: f.color, background: `${f.color}15` }}>
                {f.icon}
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
