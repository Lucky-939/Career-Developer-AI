'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiUser, FiEdit2, FiSave, FiFileText, FiTarget, FiActivity, FiAward, FiMessageCircle, FiClock } from 'react-icons/fi';
import { useToast } from '@/components/Toast';
import { PageSkeleton } from '@/components/Skeleton';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { data: session } = useSession();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    fetch('/api/profile').then((r) => r.json()).then((d) => { setUser(d.user); setEditData(d.user || {}); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
      if (res.ok) { const d = await res.json(); setUser({ ...user, ...d.user }); setEditing(false); toast?.success('Profile updated!'); }
    } catch { toast?.error('Failed to update'); }
  };

  const scoreColor = (s) => s >= 70 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

  if (loading) return <div className={styles.page}><div className={styles.container}><PageSkeleton rows={5} /></div></div>;
  if (!user) return <div className={styles.page}><div className={styles.container}><div className={styles.emptyState}><p>Please login to view your profile.</p></div></div></div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>{user.name?.charAt(0)?.toUpperCase()}</div>
              <div>
                <h1>{user.name}</h1>
                <p>{user.email}</p>
                <div className={styles.metaRow}>
                  <span className={`badge badge-${user.role === 'ADMIN' ? 'red' : user.role === 'ALUMNI' ? 'blue' : 'green'}`}>{user.role}</span>
                  {user.college && <span>🏫 {user.college}</span>}
                  {user.branch && <span>📚 {user.branch}</span>}
                  {user.cgpa && <span>📊 CGPA: {user.cgpa}</span>}
                </div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
              <FiEdit2 size={14} /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {editing && (
            <motion.div className={styles.editForm} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className={styles.editGrid}>
                <div className="input-group"><label>Name</label><input className="input" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></div>
                <div className="input-group"><label>College</label><input className="input" value={editData.college || ''} onChange={(e) => setEditData({ ...editData, college: e.target.value })} /></div>
                <div className="input-group"><label>Branch</label>
                  <select className="input" value={editData.branch || ''} onChange={(e) => setEditData({ ...editData, branch: e.target.value })}>
                    <option value="">Select</option>
                    {['Computer Engineering', 'Information Technology', 'Electronics & Telecom', 'Mechanical Engineering', 'AI & Data Science'].map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="input-group"><label>CGPA</label><input type="number" step="0.01" max="10" className="input" value={editData.cgpa || ''} onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })} /></div>
                <div className="input-group"><label>Skills (comma-separated)</label><input className="input" value={(editData.skills || []).join(', ')} onChange={(e) => setEditData({ ...editData, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="input-group"><label>Languages</label><input className="input" value={(editData.programmingLangs || []).join(', ')} onChange={(e) => setEditData({ ...editData, programmingLangs: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="input-group"><label>Career Goal</label>
                  <select className="input" value={editData.careerGoals || ''} onChange={(e) => setEditData({ ...editData, careerGoals: e.target.value })}>
                    <option value="Job">💼 Job</option><option value="Higher Studies">🎓 Higher Studies</option><option value="Both">🚀 Both</option>
                  </select>
                </div>
                <div className="input-group"><label>Year</label>
                  <select className="input" value={editData.currentYear || ''} onChange={(e) => setEditData({ ...editData, currentYear: e.target.value })}>
                    <option value="">Select</option><option value="FE">FE</option><option value="SE">SE</option><option value="TE">TE</option><option value="BE">BE</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={handleSave}><FiSave size={14} /> Save Changes</button>
            </motion.div>
          )}

          {/* Tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'overview' ? styles.tabActive : ''}`} onClick={() => setTab('overview')}>📊 Overview</button>
            <button className={`${styles.tab} ${tab === 'resume' ? styles.tabActive : ''}`} onClick={() => setTab('resume')}>📄 Resume History</button>
            <button className={`${styles.tab} ${tab === 'progress' ? styles.tabActive : ''}`} onClick={() => setTab('progress')}>📈 Progress</button>
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div className={styles.overviewGrid}>
              <div className={styles.infoCard}>
                <h3><FiTarget size={16} /> Skills</h3>
                <div className={styles.chipList}>{user.skills?.length > 0 ? user.skills.map((s) => <span key={s} className="badge badge-purple">{s}</span>) : <span className={styles.muted}>No skills added</span>}</div>
              </div>
              <div className={styles.infoCard}>
                <h3><FiActivity size={16} /> Languages</h3>
                <div className={styles.chipList}>{user.programmingLangs?.length > 0 ? user.programmingLangs.map((l) => <span key={l} className="badge badge-blue">{l}</span>) : <span className={styles.muted}>No languages added</span>}</div>
              </div>
              <div className={styles.infoCard}>
                <h3><FiAward size={16} /> Career Goal</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.careerGoals || 'Not set'}</p>
              </div>
              <div className={styles.infoCard}>
                <h3><FiMessageCircle size={16} /> AI Chat Sessions</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user._count?.chatMessages || 0} messages</p>
              </div>
              <div className={styles.infoCard}>
                <h3><FiFileText size={16} /> Exam Attempts</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user._count?.examAttempts || 0} questions</p>
              </div>
              <div className={styles.infoCard}>
                <h3><FiAward size={16} /> Hackathons</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.hackathons?.length || 0} registered</p>
              </div>
            </div>
          )}

          {/* Resume History */}
          {tab === 'resume' && (
            <div className={styles.resumeHistory}>
              {user.resumeAnalyses?.length === 0 ? (
                <div className={styles.emptyState}><p>No resume analyses yet. Go to <a href="/resume-analyzer" style={{ color: 'var(--purple-400)' }}>Resume Analyzer</a> to get started!</p></div>
              ) : (
                user.resumeAnalyses?.map((a) => (
                  <div key={a.id} className={styles.resumeCard}>
                    <div className={styles.resumeScore} style={{ color: scoreColor(a.score) }}>{a.score}/100</div>
                    <div className={styles.resumeDetails}>
                      <div className={styles.chipList}>{a.targetRoles?.slice(0, 2).map((r) => <span key={r} className="badge badge-purple">{r}</span>)}</div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={12} /> {new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.resumeMeta}>
                      <span className={`badge ${a.atsFriendly ? 'badge-green' : 'badge-red'}`}>{a.atsFriendly ? 'ATS ✓' : 'ATS ✗'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Progress */}
          {tab === 'progress' && (
            <div className={styles.progressSection}>
              <div className={styles.progressGrid}>
                <div className={styles.progressCard}>
                  <h3>Exam Questions</h3>
                  <p className={styles.bigNum}>{user.examAttempts?.length || 0}</p>
                  <span>Questions attempted</span>
                </div>
                <div className={styles.progressCard}>
                  <h3>Correct Answers</h3>
                  <p className={styles.bigNum} style={{ color: '#10b981' }}>{user.examAttempts?.filter((a) => a.isCorrect).length || 0}</p>
                  <span>Correct</span>
                </div>
                <div className={styles.progressCard}>
                  <h3>Accuracy</h3>
                  <p className={styles.bigNum}>{user.examAttempts?.length > 0 ? Math.round((user.examAttempts.filter((a) => a.isCorrect).length / user.examAttempts.length) * 100) : 0}%</p>
                  <span>Overall</span>
                </div>
                <div className={styles.progressCard}>
                  <h3>Mock Tests</h3>
                  <p className={styles.bigNum}>{user.mockAttempts?.length || 0}</p>
                  <span>Completed</span>
                </div>
              </div>

              {user.mockAttempts?.length > 0 && (
                <div className={styles.mockHistory}>
                  <h3 style={{ marginBottom: 14 }}>📊 Mock Test Scores</h3>
                  <div className={styles.barChart}>
                    {user.mockAttempts.slice(0, 10).map((m, i) => (
                      <div key={m.id} className={styles.barItem}>
                        <div className={styles.bar} style={{ height: `${(m.score / m.totalMarks) * 100}%`, background: `linear-gradient(to top, var(--purple-600), ${(m.score / m.totalMarks) >= 0.7 ? '#10b981' : '#f59e0b'})` }} />
                        <span>{Math.round((m.score / m.totalMarks) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
