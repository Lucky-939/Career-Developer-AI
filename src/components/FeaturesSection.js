'use client';

import { motion } from 'framer-motion';
import {
  FiBookOpen, FiBriefcase, FiTarget, FiCpu,
  FiTrendingUp, FiAward, FiUsers, FiZap,
} from 'react-icons/fi';
import styles from './FeaturesSection.module.css';

const modules = [
  {
    icon: <FiBookOpen size={28} />,
    title: 'Higher Studies Prep',
    desc: 'Comprehensive exam preparation for GATE, GRE, UPSC, CAT & more. Syllabus-wise questions, difficulty levels, and time-based practice with university finder.',
    features: ['Exam-wise practice', 'University finder', 'Admission chances'],
    color: '#8b5cf6',
  },
  {
    icon: <FiBriefcase size={28} />,
    title: 'Placement Preparation',
    desc: 'Company-specific placement questions, coding challenges, interview experiences. Timed mock drives with instant scoring and skill gap analysis.',
    features: ['Mock drives', 'Company Q&A', 'Skill gap analyzer'],
    color: '#3b82f6',
  },
  {
    icon: <FiTarget size={28} />,
    title: 'Career Developer',
    desc: 'Personalized eligibility finder based on CGPA, skills, and interests. Find companies you\'re eligible for, alternatives, and career path suggestions.',
    features: ['Eligibility finder', 'Company matching', 'Career paths'],
    color: '#10b981',
  },
  {
    icon: <FiCpu size={28} />,
    title: 'AI Career Chatbot',
    desc: 'Powered by Google Gemini — get personalized career advice, resume analysis, roadmap generation, and instant answers to career questions.',
    features: ['Resume analyzer', 'Roadmap generator', 'Career advisor'],
    color: '#f59e0b',
  },
];

const stats = [
  { icon: <FiTrendingUp size={24} />, value: '10+', label: 'Exam Categories' },
  { icon: <FiAward size={24} />, value: '50+', label: 'Companies Covered' },
  { icon: <FiUsers size={24} />, value: '100+', label: 'Interview Experiences' },
  { icon: <FiZap size={24} />, value: 'AI', label: 'Gemini Powered' },
];

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className={styles.sectionBadge}>Core Modules</span>
          <h2 className={styles.sectionTitle}>
            Everything you need for your{' '}
            <span className="gradient-text">career journey</span>
          </h2>
          <p className={styles.sectionDesc}>
            From exam preparation to placement training — one platform that covers every aspect
            of your career development as an engineering student.
          </p>
        </motion.div>

        {/* Module Cards */}
        <div className={styles.moduleGrid}>
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              className={styles.moduleCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.moduleIcon} style={{ color: mod.color, background: `${mod.color}12` }}>
                {mod.icon}
              </div>
              <h3 className={styles.moduleTitle}>{mod.title}</h3>
              <p className={styles.moduleDesc}>{mod.desc}</p>
              <div className={styles.moduleFeatures}>
                {mod.features.map((f) => (
                  <span key={f} className={styles.featureTag} style={{ borderColor: `${mod.color}30` }}>
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          className={styles.statsBar}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statIcon}>{s.icon}</div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
