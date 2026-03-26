'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiZap, FiCalendar, FiUsers, FiAward, FiPlus, FiExternalLink, FiEdit2 } from 'react-icons/fi';
import { useToast } from '@/components/Toast';
import { PageSkeleton } from '@/components/Skeleton';
import styles from './hackathons.module.css';

const STATUS_COLORS = { REGISTERED: 'badge-blue', ONGOING: 'badge-yellow', COMPLETED: 'badge-green', WON: 'badge-purple' };
const DIFFICULTY_COLORS = { Easy: 'badge-green', Medium: 'badge-yellow', Hard: 'badge-red' };

export default function HackathonsPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const [tab, setTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [myHackathons, setMyHackathons] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', platform: '', teamSize: '', status: 'REGISTERED' });

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hackathons?tab=${tab}`);
      const data = await res.json();
      if (tab === 'upcoming') setUpcoming(data.hackathons || []);
      else { setMyHackathons(data.hackathons || []); setStats(data.stats || {}); }
    } catch {}
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/hackathons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { toast?.success('Hackathon registered!'); setShowForm(false); setForm({ name: '', date: '', platform: '', teamSize: '', status: 'REGISTERED' }); setTab('my'); }
    } catch { toast?.error('Registration failed'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch('/api/hackathons', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      toast?.success('Status updated!');
      fetchData();
    } catch { toast?.error('Update failed'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}><FiZap size={14} /> Hackathon Tracker</span>
          <h1>Hackathons & Competitions</h1>
          <p>Discover upcoming hackathons, track your registrations, and build your competitive profile.</p>
        </motion.div>

        {/* Stats Bar */}
        {tab === 'my' && (
          <motion.div className={styles.statsBar} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.stat}><strong>{stats.total || 0}</strong><span>Total</span></div>
            <div className={styles.stat}><strong>{stats.won || 0}</strong><span>Won 🏆</span></div>
            <div className={styles.stat}><strong>{stats.ongoing || 0}</strong><span>Ongoing</span></div>
            <div className={styles.stat}><strong>{stats.completed || 0}</strong><span>Completed</span></div>
          </motion.div>
        )}

        <div className={styles.tabBar}>
          <div className={styles.tabsLeft}>
            <button className={`${styles.tab} ${tab === 'upcoming' ? styles.tabActive : ''}`} onClick={() => setTab('upcoming')}>🔥 Upcoming</button>
            <button className={`${styles.tab} ${tab === 'my' ? styles.tabActive : ''}`} onClick={() => setTab('my')}>📋 My Registrations</button>
          </div>
          <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            <FiPlus size={14} /> Add
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <motion.form className={styles.addForm} onSubmit={handleRegister} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className={styles.formGrid}>
              <div className="input-group"><label>Hackathon Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Smart India Hackathon" /></div>
              <div className="input-group"><label>Date</label><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="input-group"><label>Platform</label><input className="input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="e.g. Online / College" /></div>
              <div className="input-group"><label>Team Size</label><input type="number" className="input" value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} placeholder="e.g. 4" /></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="submit" className="btn btn-primary btn-sm">Register</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </motion.form>
        )}

        {loading ? <PageSkeleton rows={4} /> : (
          <div className={styles.hackathonGrid}>
            {tab === 'upcoming' && upcoming.map((h, i) => (
              <motion.div key={i} className={styles.hackCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className={styles.cardTop}>
                  <h3>{h.name}</h3>
                  <span className={`badge ${DIFFICULTY_COLORS[h.difficulty] || ''}`}>{h.difficulty}</span>
                </div>
                <p className={styles.cardDesc}>{h.description}</p>
                <div className={styles.cardMeta}>
                  <span><FiCalendar size={12} /> {h.date}</span>
                  <span>🏢 {h.platform}</span>
                  {h.prize && <span>🏆 {h.prize}</span>}
                </div>
                <div className={styles.tagList}>
                  {h.tags?.map((t) => <span key={t} className="badge badge-purple">{t}</span>)}
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => { setForm({ ...form, name: h.name, platform: h.platform, date: h.date }); setShowForm(true); }}>
                  Register <FiPlus size={14} />
                </button>
              </motion.div>
            ))}

            {tab === 'my' && myHackathons.length === 0 && (
              <div className={styles.emptyState}><p>No hackathons registered yet. Browse upcoming hackathons or add one manually!</p></div>
            )}

            {tab === 'my' && myHackathons.map((h, i) => (
              <motion.div key={h.id} className={styles.hackCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className={styles.cardTop}>
                  <h3>{h.name}</h3>
                  <span className={`badge ${STATUS_COLORS[h.status]}`}>{h.status}</span>
                </div>
                <div className={styles.cardMeta}>
                  {h.date && <span><FiCalendar size={12} /> {new Date(h.date).toLocaleDateString()}</span>}
                  {h.platform && <span>🏢 {h.platform}</span>}
                  {h.teamSize && <span><FiUsers size={12} /> {h.teamSize} members</span>}
                </div>
                <div className={styles.statusActions}>
                  {['REGISTERED', 'ONGOING', 'COMPLETED', 'WON'].map((s) => (
                    <button key={s} className={`${styles.statusBtn} ${h.status === s ? styles.statusActive : ''}`} onClick={() => updateStatus(h.id, s)}>
                      {s === 'WON' ? '🏆' : ''} {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
