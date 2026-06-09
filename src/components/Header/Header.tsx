import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <Layers className={styles.logoIcon} size={32} />
        FlexiPDF
      </Link>
      <nav className={styles.nav}>
        <Link to="/merge_pdf" className={styles.navLink}>Merge PDF</Link>
        <Link to="/split_pdf" className={styles.navLink}>Split PDF</Link>
      </nav>
      
      <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/merge_pdf" className={styles.mobileLink} onClick={closeMenu}>Merge PDF</Link>
          <Link to="/split_pdf" className={styles.mobileLink} onClick={closeMenu}>Split PDF</Link>
        </div>
      )}
    </header>
  );
}
