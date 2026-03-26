'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiUsers, FiLinkedin, FiMessageCircle, FiSend, FiFilter, FiSearch } from 'react-icons/fi';
import { useToast } from '@/components/Toast';
import { PageSkeleton } from '@/components/Skeleton';
import styles from './alumni.module.css';

export default function AlumniPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const [profiles, setProfiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('directory');
  const [filter, setFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);
  const [askForm, setAskForm] = useState({ title: '', question: '', tags: '' });
  const [answerText, setAnswerText] = useState({});

  useEffect(() => { fetchData(); }, [filter, branchFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set('filter', filter);
      if (branchFilter) params.set('branch', branchFilter);
      const res = await fetch(`/api/alumni?${params}`);
      const data = await res.json();
      setProfiles(data.profiles || []);
      setQuestions(data.questions || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!session?.user) { toast?.error('Please login to ask questions'); return; }
    try {
      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ask', title: askForm.title, question: askForm.question, tags: askForm.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
      });
      if (res.ok) { toast?.success('Question posted!'); setShowAskForm(false); setAskForm({ title: '', question: '', tags: '' }); fetchData(); }
    } catch { toast?.error('Failed to post question'); }
  };

  const handleAnswer = async (questionId) => {
    if (!answerText[questionId]) return;
    try {
      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'answer', questionId, answer: answerText[questionId] }),
      });
      if (res.ok) { toast?.success('Answer posted!'); setAnswerText({ ...answerText, [questionId]: '' }); fetchData(); }
      else { const d = await res.json(); toast?.error(d.error || 'Failed'); }
    } catch { toast?.error('Failed to post answer'); }
  };

  const BRANCHES = ['', 'Computer Engineering', 'Information Technology', 'Electronics & Telecom', 'Mechanical Engineering', 'AI & Data Science'];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}><FiUsers size={14} /> Alumni Network</span>
          <h1>Connect with Alumni</h1>
          <p>Get guidance from VPPCOE alumni working at top companies. Ask questions, get career advice, and build connections.</p>
        </motion.div>

        <div className={styles.tabBar}>
          <div className={styles.tabsLeft}>
            <button className={`${styles.tab} ${tab === 'directory' ? styles.tabActive : ''}`} onClick={() => setTab('directory')}>👤 Alumni Directory</button>
            <button className={`${styles.tab} ${tab === 'qa' ? styles.tabActive : ''}`} onClick={() => setTab('qa')}>💬 Q&A Forum</button>
          </div>
        </div>

        {tab === 'directory' && (
          <>
            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <FiSearch size={14} />
                <input placeholder="Search by company..." value={filter} onChange={(e) => setFilter(e.target.value)} />
              </div>
              <select className="input" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} style={{ maxWidth: 200 }}>
                <option value="">All Branches</option>
                {BRANCHES.filter(Boolean).map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {loading ? <PageSkeleton rows={3} /> : (
              <div className={styles.alumniGrid}>
                {profiles.length === 0 ? (
                  <div className={styles.emptyState}><p>No alumni found. Run <code>npx prisma db seed</code> to populate.</p></div>
                ) : (
                  profiles.map((p, i) => (
                    <motion.div key={p.id} className={styles.alumniCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className={styles.alumniAvatar}>{p.user.name?.charAt(0)}</div>
                      <div className={styles.alumniInfo}>
                        <h3>{p.user.name}</h3>
                        <p className={styles.alumniRole}>{p.role} @ <strong>{p.company}</strong></p>
                        <div className={styles.alumniMeta}>
                          <span>🎓 Batch {p.batchYear}</span>
                          <span>📚 {p.user.branch}</span>
                        </div>
                        {p.bio && <p className={styles.alumniBio}>{p.bio}</p>}
                        <div className={styles.alumniActions}>
                          {p.linkedin && <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkedinBtn}><FiLinkedin size={14} /> LinkedIn</a>}
                          <button className={styles.askBtn} onClick={() => { setTab('qa'); setShowAskForm(true); }}>
                            <FiMessageCircle size={14} /> Ask Question
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {tab === 'qa' && (
          <>
            <button className="btn btn-primary btn-sm" style={{ marginBottom: 16 }} onClick={() => setShowAskForm(!showAskForm)}>
              <FiMessageCircle size={14} /> Ask a Question
            </button>

            {showAskForm && (
              <motion.form className={styles.askForm} onSubmit={handleAsk} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="input-group"><label>Title</label><input className="input" value={askForm.title} onChange={(e) => setAskForm({ ...askForm, title: e.target.value })} required placeholder="e.g. How to prepare for Google?" /></div>
                <div className="input-group"><label>Question</label><textarea className="input" rows={3} value={askForm.question} onChange={(e) => setAskForm({ ...askForm, question: e.target.value })} required placeholder="Describe your question in detail..." /></div>
                <div className="input-group"><label>Tags (comma-separated)</label><input className="input" value={askForm.tags} onChange={(e) => setAskForm({ ...askForm, tags: e.target.value })} placeholder="e.g. Placement, DSA, GATE" /></div>
                <button type="submit" className="btn btn-primary btn-sm">Post Question</button>
              </motion.form>
            )}

            {loading ? <PageSkeleton rows={4} /> : (
              <div className={styles.qaList}>
                {questions.length === 0 ? (
                  <div className={styles.emptyState}><p>No questions yet. Be the first to ask!</p></div>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className={styles.qaCard}>
                      <div className={styles.qaHeader}>
                        <h3>{q.title}</h3>
                        <span className={styles.qaDate}>{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className={styles.qaQuestion}>{q.question}</p>
                      <div className={styles.qaTags}>{q.tags?.map((t) => <span key={t} className="badge badge-purple">{t}</span>)}</div>
                      <span className={styles.qaAuthor}>Asked by {q.student?.name || 'Student'}</span>

                      {/* Answers */}
                      {q.answers?.length > 0 && (
                        <div className={styles.answersList}>
                          {q.answers.map((a) => (
                            <div key={a.id} className={styles.answerCard}>
                              <strong>{a.alumni?.user?.name || 'Alumni'}</strong>
                              <p>{a.answer}</p>
                              <span className={styles.qaDate}>{new Date(a.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer input */}
                      <div className={styles.answerInput}>
                        <input value={answerText[q.id] || ''} onChange={(e) => setAnswerText({ ...answerText, [q.id]: e.target.value })} placeholder="Write an answer..." className="input" />
                        <button className="btn btn-sm btn-primary" onClick={() => handleAnswer(q.id)} disabled={!answerText[q.id]}>
                          <FiSend size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
