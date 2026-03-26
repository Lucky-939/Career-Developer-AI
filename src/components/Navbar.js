'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiLogOut, FiUser, FiChevronDown, FiBell, FiSettings, FiFileText, FiAward, FiUsers } from 'react-icons/fi';
import styles from './Navbar.module.css';

const navLinks = [
  { name: 'Higher Studies', href: '/higher-studies' },
  { name: 'Placement Prep', href: '/placement-prep' },
  { name: 'Career Dev', href: '/career-dev' },
  { name: 'AI Chat', href: '/ai-chat' },
  { name: 'Resume', href: '/resume-analyzer' },
  { name: 'Hackathons', href: '/hackathons' },
  { name: 'Alumni', href: '/alumni' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (session?.user) {
      fetch('/api/notifications')
        .then((r) => r.json())
        .then((data) => { setNotifications(data.notifications || []); setUnread(data.unread || 0); })
        .catch(() => {});
    }
  }, [session, bellOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(`.${styles.profileMenu}`) && !e.target.closest(`.${styles.bellWrap}`)) {
        setProfileOpen(false);
        setBellOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAll: true }) });
      setUnread(0);
      setNotifications((n) => n.map((item) => ({ ...item, read: true })));
    } catch {}
  };

  const notifIcon = (type) => {
    const map = { ELIGIBILITY_UPDATE: '📊', NEW_QUESTION: '❓', MOCK_REMINDER: '⏰', ALUMNI_REPLY: '💬', HACKATHON_ALERT: '🏆', GENERAL: '📢' };
    return map[type] || '📢';
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🚀</span>
          <span className={styles.logoText}>
            Career<span className={styles.logoAccent}>Dev</span>
            <span className={styles.logoDot}>.ai</span>
          </span>
        </Link>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.mobileOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile-only auth buttons */}
          <div className={styles.mobileAuth}>
            {session ? (
              <>
                <Link href="/dashboard" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link href="/profile" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button onClick={() => signOut()} className="btn btn-ghost btn-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Sign Up Free</Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.navActions}>
          {session ? (
            <>
              {/* Bell Icon */}
              <div className={styles.bellWrap} ref={bellRef}>
                <button className={styles.bellBtn} onClick={(e) => { e.stopPropagation(); setBellOpen(!bellOpen); setProfileOpen(false); }}>
                  <FiBell size={18} />
                  {unread > 0 && <span className={styles.bellBadge}>{unread > 9 ? '9+' : unread}</span>}
                </button>
                {bellOpen && (
                  <div className={styles.bellDropdown}>
                    <div className={styles.bellHeader}>
                      <strong>Notifications</strong>
                      {unread > 0 && <button className={styles.markAllBtn} onClick={markAllRead}>Mark all read</button>}
                    </div>
                    {notifications.length === 0 ? (
                      <div className={styles.bellEmpty}>No notifications yet</div>
                    ) : (
                      <div className={styles.bellList}>
                        {notifications.map((n) => (
                          <div key={n.id} className={`${styles.bellItem} ${!n.read ? styles.bellUnread : ''}`}>
                            <span className={styles.bellIcon}>{notifIcon(n.type)}</span>
                            <div>
                              <strong>{n.title}</strong>
                              <p>{n.message}</p>
                              <span className={styles.bellTime}>{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className={styles.profileMenu}>
                <button className={styles.profileBtn} onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); setBellOpen(false); }}>
                  <div className={styles.avatar}>{session.user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  <span className={styles.profileName}>{session.user?.name?.split(' ')[0]}</span>
                  <FiChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className={styles.dropdown}>
                    <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiUser size={16} /> Dashboard
                    </Link>
                    <Link href="/profile" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiSettings size={16} /> Profile
                    </Link>
                    <Link href="/resume-analyzer" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiFileText size={16} /> Resume
                    </Link>
                    <Link href="/hackathons" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiAward size={16} /> Hackathons
                    </Link>
                    <Link href="/admin" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <FiSettings size={16} /> Admin
                    </Link>
                    <button onClick={() => signOut()} className={styles.dropdownItem}>
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Sign Up Free</Link>
            </div>
          )}
          <button className={styles.menuToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
