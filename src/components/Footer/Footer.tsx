import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontWeight: 800, fontSize: '1.2rem' }}>
            <Layers color="var(--primary)" />
            FlexiPDF
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Every tool you need to work with PDFs in one place. 100% free and processed securely on your device.
          </p>
        </div>
        <div>
          <h4 className={styles.title}>PDF Tools</h4>
          <ul className={styles.list}>
            <li><Link to="/merge_pdf" className={styles.link}>Merge PDF</Link></li>
            <li><Link to="/split_pdf" className={styles.link}>Split PDF</Link></li>
            <li><Link to="/compress_pdf" className={styles.link}>Clean & Optimize PDF</Link></li>
            <li><Link to="/rotate_pdf" className={styles.link}>Rotate PDF</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={styles.title}>Company</h4>
          <ul className={styles.list}>
            <li><Link to="/" className={styles.link}>Home</Link></li>
            <li><Link to="/about" className={styles.link}>About Us</Link></li>
            <li><Link to="/contact" className={styles.link}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={styles.title}>Legal</h4>
          <ul className={styles.list}>
            <li><Link to="/terms" className={styles.link}>Terms of Use</Link></li>
            <li><Link to="/privacy" className={styles.link}>Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} FlexiPDF. All rights reserved. Powered by local processing.</p>
      </div>
    </footer>
  );
}
