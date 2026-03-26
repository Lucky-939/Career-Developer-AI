'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiSend, FiCpu, FiUser, FiTrash2, FiZap } from 'react-icons/fi';
import { useToast } from '@/components/Toast';
import styles from './ai-chat.module.css';

const suggestions = [
  '🎯 What career path suits me with my profile?',
  '📝 How should I prepare for TCS NQT?',
  '🌎 Is MS abroad worth it for a 6.5 CGPA student?',
  '💼 Am I eligible for Amazon SDE?',
  '🛣️ Create a 6-month roadmap for placement prep',
  '📄 Best universities for my GRE score?',
  '🤔 What skills am I missing for product companies?',
  '💡 Should I focus on DSA or development?',
];

const WELCOME_MSG = {
  role: 'AI',
  content: `Hi there! 👋 I'm **CareerDev AI**, your personal career advisor powered by Google Gemini.\n\nI can help you with:\n- 🎯 Career path suggestions based on your profile\n- 📝 Placement preparation strategies\n- 🌎 Higher studies guidance (MS, MTech, MBA)\n- 💼 Company-specific preparation tips\n- 🛣️ Personalized learning roadmaps\n- 📄 Resume improvement advice\n\nI have access to your profile data, so my advice is personalized for you. Ask me anything!`,
};

export default function AIChatPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const chatEndRef = useRef(null);

  // Load chat history from DB
  useEffect(() => {
    if (session?.user) {
      fetch('/api/chat')
        .then((r) => r.json())
        .then((data) => {
          if (data.messages?.length > 0) {
            setMessages([WELCOME_MSG, ...data.messages.map((m) => ({ role: m.role, content: m.content }))]);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingHistory(false));
    } else {
      setLoadingHistory(false);
    }
  }, [session]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'USER', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.filter((m) => m !== WELCOME_MSG).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'AI', content: data.response || 'Sorry, I could not process that.' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'AI', content: '⚠️ Unable to connect to the AI service. Please check your connection and try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => setInput(text);

  const clearChat = async () => {
    try {
      await fetch('/api/chat', { method: 'DELETE' });
      setMessages([WELCOME_MSG]);
      toast?.success('Chat history cleared');
    } catch {
      toast?.error('Failed to clear history');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.headerLeft}>
            <span className={styles.badge}><FiCpu size={14} /> AI Career Chat</span>
            <h1>CareerDev AI Assistant</h1>
          </div>
          <button onClick={clearChat} className={styles.clearBtn}>
            <FiTrash2 size={14} /> Clear
          </button>
        </motion.div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          <div className={styles.messageList}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`${styles.message} ${msg.role === 'USER' ? styles.userMsg : styles.aiMsg}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.msgAvatar}>
                  {msg.role === 'USER' ? <FiUser size={16} /> : <FiZap size={16} />}
                </div>
                <div className={styles.msgContent}>
                  <span className={styles.msgRole}>{msg.role === 'USER' ? (session?.user?.name?.split(' ')[0] || 'You') : 'CareerDev AI'}</span>
                  <div className={styles.msgText}>{msg.content}</div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className={`${styles.message} ${styles.aiMsg}`}>
                <div className={styles.msgAvatar}><FiZap size={16} /></div>
                <div className={styles.msgContent}>
                  <span className={styles.msgRole}>CareerDev AI</span>
                  <div className={styles.typingDots}><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className={styles.suggestions}>
              {suggestions.map((s) => (
                <button key={s} className={styles.suggestionBtn} onClick={() => handleSuggestion(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className={styles.inputBar}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your career..."
              className={styles.chatInput}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className={styles.sendBtn}>
              <FiSend size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
