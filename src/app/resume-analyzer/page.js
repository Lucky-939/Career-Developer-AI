'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiUpload, FiFileText, FiCheckCircle, FiXCircle, FiAlertTriangle, FiAward, FiClock, FiArrowRight } from 'react-icons/fi';
import { useToast } from '@/components/Toast';
import { PageSkeleton } from '@/components/Skeleton';
import styles from './resume.module.css';

export default function ResumeAnalyzerPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const fileRef = useRef(null);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    fetch('/api/resume-analyzer')
      .then((r) => r.json())
      .then((data) => setHistory(data.analyses || []))
      .catch(() => {});
  }, [analysis]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const text = await file.text();
      setResumeText(text);
      toast?.success('Resume text extracted!');
    } else if (file.type === 'application/pdf') {
      // Client-side PDF text extraction using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        // Simple extraction: for PDFs, we'll ask the user to paste text
        toast?.info('PDF detected — please paste your resume text below for best results.');
        setResumeText('');
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast?.error('Please upload a .txt or .pdf file');
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) { toast?.error('Please paste your resume text'); return; }
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, userProfile: session?.user }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      toast?.success('Analysis complete!');
    } catch {
      toast?.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 70 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
  const scoreLabel = (s) => s >= 85 ? 'Excellent' : s >= 70 ? 'Good' : s >= 50 ? 'Average' : s >= 30 ? 'Needs Work' : 'Poor';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}><FiFileText size={14} /> Resume Analyzer</span>
          <h1>AI Resume Analyzer</h1>
          <p>Upload your resume for ATS compatibility check, keyword analysis, and personalized improvement suggestions.</p>
        </motion.div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'upload' ? styles.tabActive : ''}`} onClick={() => setActiveTab('upload')}>📄 Analyze Resume</button>
          <button className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`} onClick={() => setActiveTab('history')}>📊 Past Analyses ({history.length})</button>
        </div>

        {activeTab === 'upload' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Upload Area */}
            <div className={styles.uploadArea} onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFile} style={{ display: 'none' }} />
              <FiUpload size={32} />
              <p>{fileName || 'Click to upload resume (PDF/TXT)'}</p>
              <span>Or paste your resume text below</span>
            </div>

            <textarea className={styles.textArea} placeholder="Paste your resume text here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={8} />

            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }} onClick={handleAnalyze} disabled={loading || !resumeText.trim()}>
              {loading ? '🔍 Analyzing...' : 'Analyze Resume'} <FiArrowRight size={16} />
            </button>

            {/* Results */}
            {analysis && (
              <motion.div className={styles.results} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Score Donut */}
                <div className={styles.scoreSection}>
                  <div className={styles.scoreDonut}>
                    <svg viewBox="0 0 120 120" width="140" height="140">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor(analysis.score)} strokeWidth="10" strokeDasharray={`${analysis.score * 3.14} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'all 1s' }} />
                    </svg>
                    <div className={styles.scoreText}>
                      <strong>{analysis.score}</strong>
                      <span>/100</span>
                    </div>
                  </div>
                  <div className={styles.scoreInfo}>
                    <h3 style={{ color: scoreColor(analysis.score) }}>{scoreLabel(analysis.score)}</h3>
                    <div className={styles.atsBadge} style={{ borderColor: analysis.atsFriendly ? '#10b981' : '#ef4444' }}>
                      {analysis.atsFriendly ? <FiCheckCircle color="#10b981" /> : <FiXCircle color="#ef4444" />}
                      <span>{analysis.atsFriendly ? 'ATS Friendly' : 'Not ATS Optimized'}</span>
                    </div>
                    {analysis.targetRoles?.length > 0 && (
                      <div className={styles.targetRoles}>
                        <strong>Target Roles:</strong>
                        <div className={styles.chipList}>{analysis.targetRoles.map((r) => <span key={r} className="badge badge-purple">{r}</span>)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Strengths */}
                {analysis.strengths?.length > 0 && (
                  <div className={`${styles.section} ${styles.strengthSection}`}>
                    <h3><FiCheckCircle size={18} color="#10b981" /> Strengths</h3>
                    <ul>{analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                )}

                {/* Weaknesses */}
                {analysis.weaknesses?.length > 0 && (
                  <div className={`${styles.section} ${styles.weaknessSection}`}>
                    <h3><FiXCircle size={18} color="#ef4444" /> Weaknesses</h3>
                    <ul>{analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                  </div>
                )}

                {/* Missing Keywords */}
                {analysis.missingKeywords?.length > 0 && (
                  <div className={styles.section}>
                    <h3><FiAlertTriangle size={18} color="#f59e0b" /> Missing Keywords</h3>
                    <div className={styles.chipList}>{analysis.missingKeywords.map((k) => <span key={k} className={styles.keywordChip}>{k}</span>)}</div>
                  </div>
                )}

                {/* Improvements */}
                {analysis.suggestedImprovements?.length > 0 && (
                  <div className={`${styles.section} ${styles.improvementSection}`}>
                    <h3><FiAward size={18} color="#8b5cf6" /> Suggested Improvements</h3>
                    <ul>{analysis.suggestedImprovements.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {history.length === 0 ? (
              <div className={styles.emptyState}><p>No analyses yet. Upload your resume to get started!</p></div>
            ) : (
              <div className={styles.historyGrid}>
                {history.map((h) => (
                  <div key={h.id} className={styles.historyCard}>
                    <div className={styles.historyScore} style={{ color: scoreColor(h.score) }}>{h.score}/100</div>
                    <div>
                      <p>{scoreLabel(h.score)}</p>
                      <span className={styles.historyDate}><FiClock size={12} /> {new Date(h.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.chipList}>{h.targetRoles?.slice(0, 2).map((r) => <span key={r} className="badge badge-purple">{r}</span>)}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
