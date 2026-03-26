'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiBriefcase, FiSearch, FiArrowRight, FiClock, FiAlertTriangle, FiCheck, FiX, FiChevronLeft } from 'react-icons/fi';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/components/Toast';
import styles from './placement-prep.module.css';

const CATEGORIES = ['All', 'SERVICE', 'PRODUCT', 'STARTUP', 'MNC'];
const MOCK_QUESTIONS_SOURCE = [
  { question: 'A man buys 10 oranges for ₹3 and sells them at ₹5. What is the profit %?', options: ['60%', '66.67%', '50%', '40%'], answer: '66.67%', type: 'APTITUDE' },
  { question: 'What is the output of: console.log(typeof null)?', options: ['null', 'undefined', 'object', 'boolean'], answer: 'object', type: 'TECHNICAL' },
  { question: 'Which sorting algorithm has O(n log n) worst case?', options: ['QuickSort', 'BubbleSort', 'MergeSort', 'SelectionSort'], answer: 'MergeSort', type: 'TECHNICAL' },
  { question: 'If x + y = 10 and x - y = 4, then x = ?', options: ['5', '6', '7', '8'], answer: '7', type: 'APTITUDE' },
  { question: 'What does ACID stand for in DBMS?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'None', 'All'], answer: 'Atomicity, Consistency, Isolation, Durability', type: 'TECHNICAL' },
  { question: 'A pipe fills a tank in 3 hours. Another empties it in 4 hours. How long to fill with both open?', options: ['7 hours', '12 hours', '6 hours', '5 hours'], answer: '12 hours', type: 'APTITUDE' },
  { question: 'What is the difference between == and === in JavaScript?', options: ['No difference', '== checks type and value, === checks value only', '=== checks type and value, == checks value only', 'They are aliases'], answer: '=== checks type and value, == checks value only', type: 'TECHNICAL' },
  { question: 'If the sum of 5 consecutive numbers is 100, the middle number is:', options: ['18', '20', '22', '25'], answer: '20', type: 'APTITUDE' },
  { question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'LinkedList'], answer: 'Stack', type: 'TECHNICAL' },
  { question: 'What percentage is 45 of 180?', options: ['25%', '20%', '30%', '15%'], answer: '25%', type: 'APTITUDE' },
  { question: 'PRIMARY KEY in SQL is:', options: ['Always auto-increment', 'Uniquely identifies each row', 'Can be null', 'Foreign reference'], answer: 'Uniquely identifies each row', type: 'TECHNICAL' },
  { question: 'A boat goes 12 km downstream in 1 hour and 8 km upstream in 1 hour. Speed of current?', options: ['2 km/h', '4 km/h', '3 km/h', '6 km/h'], answer: '2 km/h', type: 'APTITUDE' },
  { question: 'What is polymorphism?', options: ['Multiple classes', 'Same interface, different implementations', 'Inheritance', 'Encapsulation'], answer: 'Same interface, different implementations', type: 'TECHNICAL' },
  { question: 'If a = 2, b = 3, what is a^b + b^a?', options: ['17', '15', '13', '11'], answer: '17', type: 'APTITUDE' },
  { question: 'REST stands for:', options: ['Representational State Transfer', 'Remote Execution Service Technology', 'None', 'Real-time Event Streaming'], answer: 'Representational State Transfer', type: 'TECHNICAL' },
  { question: 'Ratio of ages of A and B is 3:5. If B is 20 years old, A is:', options: ['10', '12', '15', '18'], answer: '12', type: 'APTITUDE' },
  { question: 'Git command to create a new branch:', options: ['git new', 'git branch <name>', 'git create', 'git init branch'], answer: 'git branch <name>', type: 'TECHNICAL' },
  { question: 'A clock shows 3:15. What is the angle between hour and minute hands?', options: ['0°', '7.5°', '15°', '22.5°'], answer: '7.5°', type: 'APTITUDE' },
  { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 'O(log n)', type: 'TECHNICAL' },
  { question: 'If 2x + 3 = 15, then x = ?', options: ['4', '5', '6', '7'], answer: '6', type: 'APTITUDE' },
];

export default function PlacementPrepPage() {
  const router = useRouter();
  const toast = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Company detail view
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetail, setCompanyDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [questionFilter, setQuestionFilter] = useState('All');

  // Mock test state
  const [mockMode, setMockMode] = useState(false);
  const [mockQuestions, setMockQuestions] = useState([]);
  const [mockAnswers, setMockAnswers] = useState({});
  const [mockTime, setMockTime] = useState(45 * 60); // 45 min in seconds
  const [mockSubmitted, setMockSubmitted] = useState(false);
  const [mockResult, setMockResult] = useState(null);
  const [analyzingMock, setAnalyzingMock] = useState(false);

  // Fetch companies from DB
  useEffect(() => {
    fetch('/api/placement-prep/companies')
      .then((r) => r.json())
      .then((data) => setCompanies(data.companies || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Timer for mock test
  useEffect(() => {
    if (!mockMode || mockSubmitted || mockTime <= 0) return;
    const timer = setInterval(() => {
      setMockTime((t) => {
        if (t <= 1) { clearInterval(timer); submitMock(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mockMode, mockSubmitted]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // View company detail
  const openCompany = async (id) => {
    setLoadingDetail(true);
    setSelectedCompany(id);
    try {
      const res = await fetch(`/api/placement-prep/companies/${id}`);
      const data = await res.json();
      setCompanyDetail(data.company);
    } catch { toast?.error('Failed to load company details'); }
    finally { setLoadingDetail(false); }
  };

  // Start mock test
  const startMock = () => {
    const shuffled = [...MOCK_QUESTIONS_SOURCE].sort(() => Math.random() - 0.5).slice(0, 20);
    setMockQuestions(shuffled);
    setMockAnswers({});
    setMockTime(45 * 60);
    setMockSubmitted(false);
    setMockResult(null);
    setMockMode(true);
  };

  // Submit mock test
  const submitMock = async () => {
    setMockSubmitted(true);

    let score = 0;
    const sectionScores = { Aptitude: 0, Technical: 0 };
    const sectionTotal = { Aptitude: 0, Technical: 0 };

    mockQuestions.forEach((q, i) => {
      const section = q.type === 'APTITUDE' ? 'Aptitude' : 'Technical';
      sectionTotal[section]++;
      if (mockAnswers[i] === q.answer) {
        score++;
        sectionScores[section]++;
      }
    });

    const result = { score, total: mockQuestions.length, sectionScores, sectionTotal, timeUsed: 45 * 60 - mockTime };
    setMockResult(result);
    toast?.info('Mock test submitted! Analyzing results...');

    // Get AI analysis
    setAnalyzingMock(true);
    try {
      const res = await fetch('/api/placement-prep/mock-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, totalMarks: mockQuestions.length, sectionScores }),
      });
      const data = await res.json();
      setMockResult((prev) => ({ ...prev, analysis: data.analysis }));
    } catch {}
    finally { setAnalyzingMock(false); }
  };

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.type === filter;
    return matchSearch && matchFilter;
  });

  // ═══ COMPANY DETAIL VIEW ═══
  if (selectedCompany && !mockMode) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <button className={styles.backBtn} onClick={() => { setSelectedCompany(null); setCompanyDetail(null); }}>
            <FiChevronLeft size={16} /> Back to Companies
          </button>
          {loadingDetail ? <PageSkeleton rows={4} /> : companyDetail && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.companyHeader}>
                <span className={styles.companyLogo}>{companyDetail.logo}</span>
                <div>
                  <h1>{companyDetail.name}</h1>
                  <p>{companyDetail.description}</p>
                  <div className={styles.companyMeta}>
                    <span className={`badge badge-${companyDetail.type === 'SERVICE' ? 'blue' : companyDetail.type === 'PRODUCT' ? 'green' : 'yellow'}`}>{companyDetail.type}</span>
                    <span>💰 {companyDetail.averagePackage}</span>
                    {companyDetail.minCGPA && <span>📊 Min CGPA: {companyDetail.minCGPA}</span>}
                  </div>
                </div>
              </div>

              {/* Questions */}
              <h2 className={styles.sectionTitle}>📝 Previous Year Questions ({companyDetail.questions?.length || 0})</h2>
              <div className={styles.filterRow}>
                {['All', 'APTITUDE', 'TECHNICAL', 'CODING', 'HR'].map((f) => (
                  <button key={f} className={`${styles.filterBtn} ${questionFilter === f ? styles.filterActive : ''}`} onClick={() => setQuestionFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
              <div className={styles.questionsList}>
                {(companyDetail.questions || [])
                  .filter((q) => questionFilter === 'All' || q.type === questionFilter)
                  .map((q, i) => (
                    <CompanyQuestion key={q.id} q={q} i={i} />
                  ))}
              </div>

              {/* Interview Experiences */}
              {companyDetail.experiences?.length > 0 && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: 32 }}>💬 Interview Experiences</h2>
                  <div className={styles.experiencesList}>
                    {companyDetail.experiences.map((exp) => (
                      <div key={exp.id} className={styles.expCard}>
                        <div className={styles.expHeader}>
                          <strong>{exp.role}</strong>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <span className="badge">{exp.year}</span>
                            <span className={`badge ${exp.outcome === 'Selected' ? 'badge-green' : 'badge-red'}`}>{exp.outcome}</span>
                          </div>
                        </div>
                        <div className={styles.expRounds}>
                          {exp.rounds?.map((r, ri) => (
                            <div key={ri} className={styles.round}>
                              <span className={styles.roundNum}>Round {ri + 1}</span>
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                        {exp.tips && <p className={styles.expTips}>💡 <strong>Tips:</strong> {exp.tips}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ═══ MOCK TEST VIEW ═══
  if (mockMode) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          {!mockSubmitted ? (
            <>
              <div className={styles.mockHeader}>
                <h2>⏱ Mock Drive — {mockQuestions.length} Questions</h2>
                <div className={`${styles.timer} ${mockTime < 300 ? styles.timerDanger : ''}`}>
                  <FiClock size={16} /> {formatTime(mockTime)}
                </div>
              </div>
              <div className={styles.mockProgress}>
                <span>{Object.keys(mockAnswers).length}/{mockQuestions.length} answered</span>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${(Object.keys(mockAnswers).length / mockQuestions.length) * 100}%` }} /></div>
              </div>
              <div className={styles.questionsList}>
                {mockQuestions.map((q, i) => (
                  <div key={i} className={styles.questionCard}>
                    <div className={styles.qHeader}>
                      <span className={styles.qNum}>Q{i + 1}</span>
                      <span className={`badge badge-${q.type === 'APTITUDE' ? 'yellow' : 'blue'}`}>{q.type}</span>
                    </div>
                    <p className={styles.qText}>{q.question}</p>
                    <div className={styles.options}>
                      {q.options.map((opt) => (
                        <button key={opt} className={`${styles.option} ${mockAnswers[i] === opt ? styles.optionSelected : ''}`} onClick={() => setMockAnswers({ ...mockAnswers, [i]: opt })}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => { setMockMode(false); }}>Cancel</button>
                <button className="btn btn-primary btn-lg" onClick={submitMock}>Submit Test <FiArrowRight size={16} /></button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.resultHeader}>
                <h2>📊 Mock Test Results</h2>
                <div className={styles.scoreCircle}>
                  <strong>{mockResult?.score}</strong>/{mockResult?.total}
                </div>
              </div>
              <div className={styles.resultGrid}>
                <div className={styles.resultCard}>
                  <h4>Aptitude</h4>
                  <p>{mockResult?.sectionScores?.Aptitude || 0}/{mockResult?.sectionTotal?.Aptitude || 0}</p>
                </div>
                <div className={styles.resultCard}>
                  <h4>Technical</h4>
                  <p>{mockResult?.sectionScores?.Technical || 0}/{mockResult?.sectionTotal?.Technical || 0}</p>
                </div>
                <div className={styles.resultCard}>
                  <h4>Time Used</h4>
                  <p>{formatTime(mockResult?.timeUsed || 0)}</p>
                </div>
                <div className={styles.resultCard}>
                  <h4>Percentage</h4>
                  <p>{Math.round(((mockResult?.score || 0) / (mockResult?.total || 1)) * 100)}%</p>
                </div>
              </div>

              {/* AI Analysis */}
              {analyzingMock ? (
                <div className={styles.analyzeLoading}>🔍 AI is analyzing your performance...</div>
              ) : mockResult?.analysis && (
                <div className={styles.analysisCard}>
                  <h3>🤖 AI Skill Gap Analysis</h3>
                  <p className={styles.analysisAssessment}>{mockResult.analysis.assessment}</p>
                  <span className={`badge badge-${mockResult.analysis.overallRating === 'Excellent' ? 'green' : mockResult.analysis.overallRating === 'Good' ? 'blue' : 'yellow'}`}>
                    {mockResult.analysis.overallRating}
                  </span>
                  {mockResult.analysis.weakAreas?.length > 0 && (
                    <div className={styles.analysisList}>
                      <h4>⚠️ Weak Areas</h4>
                      <ul>{mockResult.analysis.weakAreas.map((a, i) => <li key={i}>{a}</li>)}</ul>
                    </div>
                  )}
                  {mockResult.analysis.recommendations?.length > 0 && (
                    <div className={styles.analysisList}>
                      <h4>💡 Recommendations</h4>
                      <ul>{mockResult.analysis.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    </div>
                  )}
                  {mockResult.analysis.suggestedCompanies?.length > 0 && (
                    <div className={styles.analysisList}>
                      <h4>🏢 Suggested Companies</h4>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {mockResult.analysis.suggestedCompanies.map((c, i) => <span key={i} className="badge badge-purple">{c}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setMockMode(false)}>Back to Companies</button>
                <button className="btn btn-primary" onClick={startMock}>Retake Test</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ═══ COMPANIES LIST VIEW ═══
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}><FiBriefcase size={14} /> Placement Prep</span>
          <h1>Company-Specific Preparation</h1>
          <p>Practice previous year questions, take mock tests, and get skill gap analysis for your target companies.</p>
        </motion.div>

        {/* Mock Drive CTA */}
        <motion.div className={styles.mockCta} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div>
            <h3>⚡ Mock Drive</h3>
            <p>45-minute timed test with 20 questions (Aptitude + Technical). Get instant AI skill gap analysis.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={startMock}>Start Mock Drive <FiArrowRight size={16} /></button>
        </motion.div>

        {/* Search & Filter */}
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <FiSearch size={16} />
            <input type="text" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className={styles.filterRow}>
            {CATEGORIES.map((c) => (
              <button key={c} className={`${styles.filterBtn} ${filter === c ? styles.filterActive : ''}`} onClick={() => setFilter(c)}>
                {c === 'All' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? <PageSkeleton rows={6} /> : (
          <div className={styles.companiesGrid}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No companies found. Run <code>npx prisma db seed</code> to populate data.</p>
              </div>
            ) : (
              filtered.map((c, i) => (
                <motion.div key={c.id} className={styles.companyCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => openCompany(c.id)}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardLogo}>{c.logo || '🏢'}</span>
                    <span className={`badge badge-${c.type === 'SERVICE' ? 'blue' : c.type === 'PRODUCT' ? 'green' : c.type === 'STARTUP' ? 'yellow' : 'purple'}`}>
                      {c.type}
                    </span>
                  </div>
                  <h3>{c.name}</h3>
                  <div className={styles.cardMeta}>
                    <span>💰 {c.averagePackage}</span>
                    {c.minCGPA && <span>📊 Min CGPA: {c.minCGPA}</span>}
                  </div>
                  <div className={styles.cardMeta}>
                    <span>📝 {c._count?.questions || 0} questions</span>
                    <span>💬 {c._count?.experiences || 0} experiences</span>
                  </div>
                  <button className={styles.practiceBtn}>Practice <FiArrowRight size={14} /></button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for company questions with answer checking
function CompanyQuestion({ q, i }) {
  const [answer, setAnswer] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={styles.questionCard}>
      <div className={styles.qHeader}>
        <span className={styles.qNum}>Q{i + 1}</span>
        <span className={`badge badge-${q.type === 'APTITUDE' ? 'yellow' : q.type === 'CODING' ? 'green' : q.type === 'HR' ? 'purple' : 'blue'}`}>{q.type}</span>
        <span className={`badge ${q.difficulty === 'EASY' ? 'badge-green' : q.difficulty === 'MEDIUM' ? 'badge-yellow' : 'badge-red'}`}>{q.difficulty}</span>
        {q.year && <span className="badge">{q.year}</span>}
      </div>
      <p className={styles.qText}>{q.question}</p>

      {q.options?.length > 0 && (
        <div className={styles.options}>
          {q.options.map((opt) => {
            const isCorrect = revealed && opt === q.answer;
            const isWrong = revealed && answer === opt && opt !== q.answer;
            return (
              <button key={opt} className={`${styles.option} ${answer === opt ? styles.optionSelected : ''} ${isCorrect ? styles.optionCorrect : ''} ${isWrong ? styles.optionWrong : ''}`}
                onClick={() => !revealed && setAnswer(opt)} disabled={revealed}>
                {isCorrect && <FiCheck size={14} />}{isWrong && <FiX size={14} />}{opt}
              </button>
            );
          })}
        </div>
      )}

      {q.codeSnippet && (
        <pre className={styles.codeSnippet}><code>{q.codeSnippet}</code></pre>
      )}

      <div className={styles.qActions}>
        {answer && !revealed && <button className="btn btn-sm btn-primary" onClick={() => setRevealed(true)}>Check Answer</button>}
      </div>

      {revealed && q.explanation && (
        <div className={styles.explanation}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
    </div>
  );
}
