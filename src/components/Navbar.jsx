import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const navItems = ['Features', 'How It Works', 'Detector', 'Stats', 'About'];
    const anchors = ['#features', '#how-it-works', '#detector', '#stats', '#about'];

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.container}>
                    <a href="#" className={styles.logo} onClick={closeMenu}>
                        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="url(#ng)" strokeWidth="2" />
                            <path d="M12 20 L18 14 L28 24" stroke="url(#ng)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="20" cy="20" r="3" fill="url(#ng)" />
                            <defs>
                                <linearGradient id="ng" x1="0" y1="0" x2="40" y2="40">
                                    <stop stopColor="#00d4ff" />
                                    <stop offset="1" stopColor="#7c3aed" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>Deep<span className={styles.accent}>Shield</span> AI</span>
                    </a>

                    <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                        {navItems.map((item, i) => (
                            <li key={item}>
                                <a href={anchors[i]} onClick={closeMenu}>{item}</a>
                            </li>
                        ))}
                        <li className={styles.mobileCtaItem}>
                            <a href="#detector" className={styles.mobileCta} onClick={closeMenu}>
                                🔍 Detect Now
                            </a>
                        </li>
                    </ul>

                    <a href="#detector" className={styles.cta}>Detect Now →</a>

                    <button
                        className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* Overlay to close menu when clicking outside */}
            {menuOpen && (
                <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
            )}
        </>
    );
}
