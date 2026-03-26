import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CareerDev.ai — From Campus to Corporate',
  description: 'AI-powered career development platform for engineering students. Higher studies prep, placement training, and personalized career guidance — all in one place.',
  keywords: 'career development, engineering students, placement preparation, GATE, GRE, VPPCOE, AI career advisor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
