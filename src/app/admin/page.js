'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiFileText, FiBriefcase, FiMessageCircle, FiTrash2, FiPlus, FiEdit2 } from 'react-icons/fi';
import { useToast } from '@/components/Toast';
import { PageSkeleton } from '@/components/Skeleton';
import styles from './admin.module.css';

export default function AdminPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddQ, setShowAddQ] = useState(false);
  const [newQ, setNewQ] = useState({ examType: 'GATE', topic: '', question: '', options: '', answer: '', explanation: '', difficulty: 'MEDIUM' });

  useEffect(() => { fetchTab(tab); }, [tab]);

  const fetchTab = async (t) => {
    setLoading(true);
    try {
      const action = t === 'stats' ? 'stats' : t === 'users' ? 'users' : t === 'questions' ? 'questions' : 'companies';
      const res = await fetch(`/api/admin?action=${action}`);
      if (res.status === 403) { toast?.error('Admin access required'); setLoading(false); return; }
      const data = await res.json();
      if (t === 'stats') { setStats(data.stats); setRecentUsers(data.recentUsers || []); }
      else if (t === 'users') setUsers(data.users || []);
      else if (t === 'questions') setQuestions(data.questions || []);
      else setCompanies(data.companies || []);
    } catch {}
    finally { setLoading(false); }
  };

  const updateRole = async (userId, role) => {
    try {
      await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateRole', userId, role }) });
      toast?.success('Role updated!');
      fetchTab('users');
    } catch { toast?.error('Failed to update role'); }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      const q = { ...newQ, options: newQ.options.split('|').map((o) => o.trim()).filter(Boolean) };
      await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'addQuestion', question: q }) });
      toast?.success('Question added!');
      setShowAddQ(false);
      fetchTab('questions');
    } catch { toast?.error('Failed to add question'); }
  };

  const deleteQuestion = async (id) => {
    try {
      await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'deleteQuestion', questionId: id }) });
      toast?.success('Question deleted');
      fetchTab('questions');
    } catch { toast?.error('Failed to delete'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}><FiShield size={14} /> Admin Panel</span>
          <h1>Admin Dashboard</h1>
          <p>Manage users, content, and monitor platform activity.</p>
        </motion.div>

        <div className={styles.tabs}>
          {[
            { key: 'stats', icon: '📊', label: 'Overview' },
            { key: 'users', icon: '👥', label: 'Users' },
            { key: 'questions', icon: '📝', label: 'Questions' },
            { key: 'companies', icon: '🏢', label: 'Companies' },
          ].map((t) => (
            <button key={t.key} className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? <PageSkeleton rows={4} /> : (
          <>
            {/* STATS */}
            {tab === 'stats' && stats && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}><FiUsers size={24} /><strong>{stats.totalUsers}</strong><span>Total Users</span></div>
                  <div className={styles.statCard}><FiFileText size={24} /><strong>{stats.totalQuestions}</strong><span>Exam Questions</span></div>
                  <div className={styles.statCard}><FiBriefcase size={24} /><strong>{stats.totalCompanies}</strong><span>Companies</span></div>
                  <div className={styles.statCard}><FiMessageCircle size={24} /><strong>{stats.totalChats}</strong><span>Chat Messages</span></div>
                </div>
                <h3 style={{ margin: '24px 0 14px', fontSize: '1.05rem' }}>Recent Registrations</h3>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td><span className={`badge badge-${u.role === 'ADMIN' ? 'red' : u.role === 'ALUMNI' ? 'blue' : 'green'}`}>{u.role}</span></td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Name</th><th>Email</th><th>College</th><th>Branch</th><th>CGPA</th><th>Role</th><th>Action</th></tr></thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td style={{ fontSize: '0.78rem' }}>{u.email}</td>
                          <td>{u.college || '—'}</td>
                          <td>{u.branch || '—'}</td>
                          <td>{u.cgpa || '—'}</td>
                          <td><span className={`badge badge-${u.role === 'ADMIN' ? 'red' : u.role === 'ALUMNI' ? 'blue' : 'green'}`}>{u.role}</span></td>
                          <td>
                            <select className={styles.roleSelect} value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}>
                              <option value="STUDENT">Student</option>
                              <option value="ALUMNI">Alumni</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* QUESTIONS */}
            {tab === 'questions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button className="btn btn-primary btn-sm" style={{ marginBottom: 16 }} onClick={() => setShowAddQ(!showAddQ)}>
                  <FiPlus size={14} /> Add Question
                </button>

                {showAddQ && (
                  <form className={styles.addForm} onSubmit={addQuestion}>
                    <div className={styles.formGrid}>
                      <div className="input-group"><label>Exam</label>
                        <select className="input" value={newQ.examType} onChange={(e) => setNewQ({ ...newQ, examType: e.target.value })}>
                          {['GATE', 'GRE', 'CAT', 'UPSC'].map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div className="input-group"><label>Topic</label><input className="input" value={newQ.topic} onChange={(e) => setNewQ({ ...newQ, topic: e.target.value })} required /></div>
                      <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Question</label><textarea className="input" rows={2} value={newQ.question} onChange={(e) => setNewQ({ ...newQ, question: e.target.value })} required /></div>
                      <div className="input-group"><label>Options (pipe-separated)</label><input className="input" value={newQ.options} onChange={(e) => setNewQ({ ...newQ, options: e.target.value })} placeholder="Option A | Option B | Option C | Option D" /></div>
                      <div className="input-group"><label>Answer</label><input className="input" value={newQ.answer} onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })} required /></div>
                      <div className="input-group"><label>Difficulty</label>
                        <select className="input" value={newQ.difficulty} onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value })}>
                          {['EASY', 'MEDIUM', 'HARD'].map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="input-group"><label>Explanation</label><input className="input" value={newQ.explanation} onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })} /></div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Save Question</button>
                  </form>
                )}

                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Exam</th><th>Topic</th><th>Question</th><th>Difficulty</th><th>Action</th></tr></thead>
                    <tbody>
                      {questions.map((q) => (
                        <tr key={q.id}>
                          <td><span className="badge badge-blue">{q.examType}</span></td>
                          <td>{q.topic}</td>
                          <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question}</td>
                          <td><span className={`badge badge-${q.difficulty === 'EASY' ? 'green' : q.difficulty === 'MEDIUM' ? 'yellow' : 'red'}`}>{q.difficulty}</span></td>
                          <td><button className={styles.deleteBtn} onClick={() => deleteQuestion(q.id)}><FiTrash2 size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* COMPANIES */}
            {tab === 'companies' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Logo</th><th>Name</th><th>Type</th><th>Package</th><th>Questions</th><th>Experiences</th></tr></thead>
                    <tbody>
                      {companies.map((c) => (
                        <tr key={c.id}>
                          <td>{c.logo}</td>
                          <td><strong>{c.name}</strong></td>
                          <td><span className={`badge badge-${c.type === 'SERVICE' ? 'blue' : c.type === 'PRODUCT' ? 'green' : 'yellow'}`}>{c.type}</span></td>
                          <td>{c.averagePackage}</td>
                          <td>{c._count?.questions || 0}</td>
                          <td>{c._count?.experiences || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
