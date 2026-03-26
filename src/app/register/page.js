'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiArrowRight, FiAlertCircle, FiBook, FiCode, FiCalendar, FiHash, FiTarget, FiArrowLeft } from 'react-icons/fi';
import styles from '../login/auth.module.css';

const BRANCHES = ['Computer Engineering', 'Information Technology', 'Electronics & Telecom', 'Mechanical Engineering', 'Civil Engineering', 'AI & Data Science', 'Other'];
const YEARS = ['FE (First Year)', 'SE (Second Year)', 'TE (Third Year)', 'BE (Final Year)'];
const SKILLS_LIST = ['Data Structures', 'Algorithms', 'Web Development', 'Machine Learning', 'Database Management', 'Cloud Computing', 'Mobile Development', 'DevOps', 'Cybersecurity', 'UI/UX Design', 'System Design', 'API Development', 'Testing', 'Git/GitHub'];
const LANG_LIST = ['Java', 'Python', 'JavaScript', 'C++', 'C', 'TypeScript', 'SQL', 'Go', 'Rust', 'Kotlin', 'PHP', 'Ruby', 'R'];
const GOALS = ['Job', 'Higher Studies', 'Both'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    college: 'VPPCOE', branch: '', cgpa: '', currentYear: '',
    skills: [], programmingLangs: [], careerGoals: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleTag = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) return 'Please fill all fields';
      if (form.password.length < 6) return 'Password must be at least 6 characters';
      if (form.password !== form.confirmPassword) return 'Passwords do not match';
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, password: form.password,
          college: form.college, branch: form.branch,
          cgpa: form.cgpa, currentYear: form.currentYear,
          skills: form.skills, programmingLangs: form.programmingLangs,
          careerGoals: form.careerGoals,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }

      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      if (result?.ok) router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authGlow} />
      <div className={styles.authCard} style={{ maxWidth: step === 3 ? '520px' : '440px' }}>
        <div className={styles.authHeader}>
          <h1>Create Account</h1>
          <p>Step {step} of 3 — {step === 1 ? 'Basic Info' : step === 2 ? 'Academic Details' : 'Skills & Goals'}</p>
        </div>

        {/* 3-step indicator */}
        <div className={styles.stepIndicator}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`${styles.step} ${step >= s ? styles.stepActive : ''}`}>{s}</div>
              {i < 2 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        {error && (
          <div className={styles.errorBox}>
            <FiAlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <>
              <div className={styles.inputWrapper}>
                <FiUser className={styles.inputIcon} size={18} />
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className={styles.authInput} />
              </div>
              <div className={styles.inputWrapper}>
                <FiMail className={styles.inputIcon} size={18} />
                <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required className={styles.authInput} />
              </div>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} size={18} />
                <input type="password" name="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required className={styles.authInput} />
              </div>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} size={18} />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className={styles.authInput} />
              </div>
              <button type="button" className={`btn btn-primary ${styles.authBtn}`} onClick={nextStep}>
                Next: Academic Details <FiArrowRight size={16} />
              </button>
            </>
          )}

          {/* STEP 2: Academic Details */}
          {step === 2 && (
            <>
              <div className={styles.inputWrapper}>
                <FiBook className={styles.inputIcon} size={18} />
                <input type="text" name="college" placeholder="College Name" value={form.college} onChange={handleChange} className={styles.authInput} />
              </div>
              <div className={styles.inputWrapper}>
                <FiCode className={styles.inputIcon} size={18} />
                <select name="branch" value={form.branch} onChange={handleChange} className={styles.authInput}>
                  <option value="">Select Branch</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className={styles.inputWrapper}>
                <FiHash className={styles.inputIcon} size={18} />
                <input type="number" step="0.01" max="10" min="0" name="cgpa" placeholder="CGPA (e.g., 7.5)" value={form.cgpa} onChange={handleChange} className={styles.authInput} />
              </div>
              <div className={styles.inputWrapper}>
                <FiCalendar className={styles.inputIcon} size={18} />
                <select name="currentYear" value={form.currentYear} onChange={handleChange} className={styles.authInput}>
                  <option value="">Current Year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className={styles.btnRow}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  <FiArrowLeft size={14} /> Back
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next: Skills <FiArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Skills & Goals */}
          {step === 3 && (
            <>
              <div className={styles.tagSection}>
                <label className={styles.tagLabel}>Skills (select all that apply)</label>
                <div className={styles.tagGrid}>
                  {SKILLS_LIST.map((s) => (
                    <button key={s} type="button" className={`${styles.tag} ${form.skills.includes(s) ? styles.tagActive : ''}`} onClick={() => toggleTag('skills', s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.tagSection}>
                <label className={styles.tagLabel}>Programming Languages</label>
                <div className={styles.tagGrid}>
                  {LANG_LIST.map((l) => (
                    <button key={l} type="button" className={`${styles.tag} ${form.programmingLangs.includes(l) ? styles.tagActive : ''}`} onClick={() => toggleTag('programmingLangs', l)}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.tagSection}>
                <label className={styles.tagLabel}>Career Goal</label>
                <div className={styles.tagGrid}>
                  {GOALS.map((g) => (
                    <button key={g} type="button" className={`${styles.tag} ${form.careerGoals === g ? styles.tagActive : ''}`} onClick={() => setForm({ ...form, careerGoals: g })}>
                      {g === 'Job' ? '💼 Job / Placement' : g === 'Higher Studies' ? '🎓 Higher Studies' : '🚀 Both'}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.btnRow}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                  <FiArrowLeft size={14} /> Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'} <FiArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </form>

        <p className={styles.authFooter}>
          Already have an account?{' '}
          <Link href="/login" className={styles.authLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
