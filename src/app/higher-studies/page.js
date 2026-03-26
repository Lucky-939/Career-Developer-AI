'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiSearch, FiChevronDown, FiArrowRight, FiCheck, FiX, FiClock, FiGlobe, FiDollarSign } from 'react-icons/fi';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/components/Toast';
import styles from './higher-studies.module.css';

const EXAMS = ['GATE', 'GRE', 'CAT', 'UPSC'];
const COUNTRIES = ['USA', 'Canada', 'UK', 'Germany', 'Australia'];

export default function HigherStudiesPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('exams');

  // Exam state
  const [selectedExam, setSelectedExam] = useState('GATE');
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState({});
  const [loadingQ, setLoadingQ] = useState(false);

  // University finder state
  const [uniForm, setUniForm] = useState({ cgpa: '', country: 'USA', budget: '', examScore: '', examType: 'GRE' });
  const [universities, setUniversities] = useState([]);
  const [loadingU, setLoadingU] = useState(false);

  // Fetch questions when exam or topic changes
  useEffect(() => {
    setLoadingQ(true);
    const params = new URLSearchParams({ examType: selectedExam });
    if (selectedTopic) params.set('topic', selectedTopic);

    fetch(`/api/higher-studies/questions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setTopics(data.topics || []);
        setAnswers({});
        setShowResult({});
      })
      .catch(() => toast?.error('Failed to load questions'))
      .finally(() => setLoadingQ(false));
  }, [selectedExam, selectedTopic]);

  const handleAnswer = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const checkAnswer = (qId) => {
    setShowResult({ ...showResult, [qId]: true });
  };

  const handleUniFinder = async (e) => {
    e.preventDefault();
    setLoadingU(true);
    try {
      const res = await fetch('/api/higher-studies/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uniForm),
      });
      const data = await res.json();
      setUniversities(data.universities || []);
      if (data.universities?.length > 0) toast?.success(`Found ${data.universities.length} universities!`);
    } catch {
      toast?.error('Failed to search universities');
    } finally {
      setLoadingU(false);
    }
  };

  const chanceColor = (c) => {
    if (c === 'High') return '#10b981';
    if (c === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}><FiBookOpen size={14} /> Higher Studies</span>
          <h1>Exam Preparation Hub</h1>
          <p>Practice exam questions from our database and find universities matching your profile.</p>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'exams' ? styles.tabActive : ''}`} onClick={() => setActiveTab('exams')}>
            📝 Exam Practice
          </button>
          <button className={`${styles.tab} ${activeTab === 'uni' ? styles.tabActive : ''}`} onClick={() => setActiveTab('uni')}>
            🏛️ University Finder
          </button>
        </div>

        {/* Exam Practice Tab */}
        {activeTab === 'exams' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.examBar}>
              <div className={styles.examSelect}>
                {EXAMS.map((ex) => (
                  <button key={ex} className={`${styles.examBtn} ${selectedExam === ex ? styles.examActive : ''}`} onClick={() => { setSelectedExam(ex); setSelectedTopic(''); }}>
                    {ex}
                  </button>
                ))}
              </div>
              {topics.length > 0 && (
                <select className={styles.topicSelect} value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                  <option value="">All Topics ({questions.length})</option>
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
            </div>

            {loadingQ ? (
              <PageSkeleton rows={3} />
            ) : questions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No questions found. Run <code>npx prisma db seed</code> to populate the database.</p>
              </div>
            ) : (
              <div className={styles.questionsList}>
                {questions.map((q, i) => (
                  <div key={q.id} className={styles.questionCard}>
                    <div className={styles.qHeader}>
                      <span className={styles.qNum}>Q{i + 1}</span>
                      <span className={`badge ${q.difficulty === 'EASY' ? 'badge-green' : q.difficulty === 'MEDIUM' ? 'badge-yellow' : 'badge-red'}`}>{q.difficulty}</span>
                      <span className="badge">{q.topic}</span>
                    </div>
                    <p className={styles.qText}>{q.question}</p>

                    {q.options?.length > 0 && (
                      <div className={styles.options}>
                        {q.options.map((opt) => {
                          const isSelected = answers[q.id] === opt;
                          const isCorrect = showResult[q.id] && opt === q.answer;
                          const isWrong = showResult[q.id] && isSelected && opt !== q.answer;
                          return (
                            <button
                              key={opt}
                              className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${isCorrect ? styles.optionCorrect : ''} ${isWrong ? styles.optionWrong : ''}`}
                              onClick={() => !showResult[q.id] && handleAnswer(q.id, opt)}
                              disabled={showResult[q.id]}
                            >
                              {isCorrect && <FiCheck size={14} />}
                              {isWrong && <FiX size={14} />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className={styles.qActions}>
                      {answers[q.id] && !showResult[q.id] && (
                        <button className="btn btn-sm btn-primary" onClick={() => checkAnswer(q.id)}>Check Answer</button>
                      )}
                    </div>

                    {showResult[q.id] && q.explanation && (
                      <div className={styles.explanation}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* University Finder Tab */}
        {activeTab === 'uni' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={handleUniFinder} className={styles.uniForm}>
              <div className={styles.uniFormGrid}>
                <div className="input-group">
                  <label>Your CGPA</label>
                  <input type="number" step="0.01" max="10" placeholder="e.g. 7.5" value={uniForm.cgpa} onChange={(e) => setUniForm({ ...uniForm, cgpa: e.target.value })} className="input" required />
                </div>
                <div className="input-group">
                  <label>Target Country</label>
                  <select value={uniForm.country} onChange={(e) => setUniForm({ ...uniForm, country: e.target.value })} className="input">
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Budget (USD/year)</label>
                  <input type="text" placeholder="e.g. 30000" value={uniForm.budget} onChange={(e) => setUniForm({ ...uniForm, budget: e.target.value })} className="input" />
                </div>
                <div className="input-group">
                  <label>Exam Score ({uniForm.examType})</label>
                  <input type="text" placeholder="e.g. 310" value={uniForm.examScore} onChange={(e) => setUniForm({ ...uniForm, examScore: e.target.value })} className="input" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loadingU} style={{ width: '100%', marginTop: 16 }}>
                {loadingU ? 'Searching...' : 'Find Universities'} <FiSearch size={16} />
              </button>
            </form>

            {universities.length > 0 && (
              <div className={styles.uniResults}>
                <h3>{universities.length} Universities Found</h3>
                <div className={styles.uniGrid}>
                  {universities.map((u, i) => (
                    <motion.div key={i} className={styles.uniCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className={styles.uniHeader}>
                        <h4>{u.name}</h4>
                        <span className={styles.chance} style={{ color: chanceColor(u.chance), borderColor: chanceColor(u.chance) }}>
                          {u.chance}
                        </span>
                      </div>
                      <div className={styles.uniMeta}>
                        <span><FiGlobe size={12} /> {u.city}, {u.country}</span>
                        <span><FiDollarSign size={12} /> {u.tuition}</span>
                      </div>
                      {u.tier && <span className="badge">{u.tier}</span>}
                      <p className={styles.uniReason}>{u.reason}</p>
                      {u.programs?.length > 0 && (
                        <div className={styles.uniPrograms}>
                          {u.programs.map((p) => <span key={p} className="badge badge-purple">{p}</span>)}
                        </div>
                      )}
                    </motion.div>
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
