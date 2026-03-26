import Link from 'next/link';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <span>🚀</span>
              <span className={styles.logoText}>
                Career<span style={{ color: 'var(--purple-400)' }}>Dev</span>.ai
              </span>
            </div>
            <p className={styles.brandDesc}>
              AI-powered career development platform built for VPPCOE engineering students.
              From campus to corporate — your career journey starts here.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="GitHub"><FiGithub size={18} /></a>
              <a href="#" className={styles.socialIcon} aria-label="LinkedIn"><FiLinkedin size={18} /></a>
              <a href="#" className={styles.socialIcon} aria-label="Email"><FiMail size={18} /></a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h4>Platform</h4>
              <Link href="/higher-studies">Higher Studies</Link>
              <Link href="/placement-prep">Placement Prep</Link>
              <Link href="/career-dev">Career Dev</Link>
              <Link href="/ai-chat">AI Chat</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Resources</h4>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="#">Roadmaps</Link>
              <Link href="#">Resume Builder</Link>
              <Link href="#">Blog</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Support</h4>
              <Link href="#">Contact Us</Link>
              <Link href="#">FAQ</Link>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} CareerDev.ai — Built with ❤️ for VPPCOE Students</p>
        </div>
      </div>
    </footer>
  );
}
