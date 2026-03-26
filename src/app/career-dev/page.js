'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiUser, FiArrowRight, FiCheckCircle, FiXCircle, FiAlertTriangle, FiStar, FiMap } from 'react-icons/fi';
import { useToast } from '@/components/Toast';
import styles from './career-dev.module.css';

export default function CareerDevPage() {
  const toast = useToast();
  const [profile, setProfile] = useState({
    cgpa: '', branch: '', skills: '', languages: '', internship: 'No', careerGoal: 'Job',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!profile.cgpa) { toast?.error('Please enter your CGPA'); return; }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/career-dev/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      setResult(data.result);
      toast?.success('Career analysis complete!');
    } catch {
      toast?.error('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}><FiTarget size={14} /> Career Developer</span>
          <h1>Personalized Career Finder</h1>
          <p>Enter your profile details to discover eligible companies, borderline opportunities, and a tailored upskilling roadmap.</p>
        </motion.div>

        {/* Profile Form */}
        <motion.div className={styles.profileForm} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3><FiUser size={18} /> Your Profile</h3>
          <form onSubmit={handleAnalyze} className={styles.formGrid}>
            <div className="input-group">
              <label>CGPA</label>
              <input type="number" step="0.01" max="10" name="cgpa" placeholder="e.g. 7.2" value={profile.cgpa} onChange={handleChange} className="input" required />
            </div>
            <div className="input-group">
              <label>Branch</label>
              <select name="branch" value={profile.branch} onChange={handleChange} className="input">
                <option value="">Select Branch</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecom">Electronics & Telecom</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>
            <div className="input-group">
              <label>Skills</label>
              <input type="text" name="skills" placeholder="e.g. Web Dev, ML, DBMS" value={profile.skills} onChange={handleChange} className="input" />
            </div>
            <div className="input-group">
              <label>Programming Languages</label>
              <input type="text" name="languages" placeholder="e.g. Java, Python, SQL" value={profile.languages} onChange={handleChange} className="input" />
            </div>
            <div className="input-group">
              <label>Internship Experience</label>
              <select name="internship" value={profile.internship} onChange={handleChange} className="input">
                <option value="No">No internship</option>
                <option value="Yes (1-3 months)">Yes (1-3 months)</option>
                <option value="Yes (3-6 months)">Yes (3-6 months)</option>
                <option value="Yes (6+ months)">Yes (6+ months)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Career Goal</label>
              <select name="careerGoal" value={profile.careerGoal} onChange={handleChange} className="input">
                <option value="Job">💼 Job / Placement</option>
                <option value="Higher Studies">🎓 Higher Studies</option>
                <option value="Both">🚀 Both</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ gridColumn: '1 / -1' }} disabled={loading}>
              {loading ? '🔍 Analyzing...' : 'Analyze My Profile'} <FiArrowRight size={16} />
            </button>
          </form>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div className={styles.results} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Overall Advice */}
            {result.overallAdvice && (
              <div className={styles.adviceCard}>
                <h3>🧠 AI Career Advice</h3>
                <p>{result.overallAdvice}</p>
              </div>
            )}

            {/* Eligible */}
            {result.eligible?.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}><FiCheckCircle size={20} color="#10b981" /> ✅ Eligible Companies</h3>
                <div className={styles.resultGrid}>
                  {result.eligible.map((c, i) => (
                    <div key={i} className={`${styles.resultCard} ${styles.eligible}`}>
                      <h4>{c.name}</h4>
                      <span className="badge badge-green">{c.type}</span>
                      <p className={styles.cardPackage}>💰 {c.package}</p>
                      <p className={styles.cardReason}>{c.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Borderline */}
            {result.borderline?.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}><FiAlertTriangle size={20} color="#f59e0b" /> ⚠️ Borderline Companies</h3>
                <div className={styles.resultGrid}>
                  {result.borderline.map((c, i) => (
                    <div key={i} className={`${styles.resultCard} ${styles.borderline}`}>
                      <h4>{c.name}</h4>
                      <p className={styles.cardPackage}>💰 {c.package}</p>
                      <p className={styles.cardReason}>❌ Missing: {c.missing}</p>
                      <p className={styles.cardAction}>💡 {c.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avoid */}
            {result.avoid?.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}><FiXCircle size={20} color="#ef4444" /> ❌ Companies to Avoid (For Now)</h3>
                <div className={styles.resultGrid}>
                  {result.avoid.map((c, i) => (
                    <div key={i} className={`${styles.resultCard} ${styles.avoid}`}>
                      <h4>{c.name}</h4>
                      <p className={styles.cardReason}>{c.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Roadmap */}
            {result.roadmap?.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}><FiMap size={20} color="#8b5cf6" /> 🛣️ 6-Month Upskilling Roadmap</h3>
                <div className={styles.roadmapGrid}>
                  {result.roadmap.map((phase, i) => (
                    <div key={i} className={styles.roadmapCard}>
                      <span className={styles.roadmapMonth}>{phase.month}</span>
                      <h4>{phase.focus}</h4>
                      <ul>
                        {phase.tasks?.map((t, j) => <li key={j}>{t}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
