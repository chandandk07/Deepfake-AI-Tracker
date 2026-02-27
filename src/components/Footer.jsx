import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <a href="#" className={styles.logo}>
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="url(#fg)" strokeWidth="2" />
                                <path d="M12 20 L18 14 L28 24" stroke="url(#fg)" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="20" cy="20" r="3" fill="url(#fg)" />
                                <defs>
                                    <linearGradient id="fg" x1="0" y1="0" x2="40" y2="40">
                                        <stop stopColor="#00d4ff" />
                                        <stop offset="1" stopColor="#7c3aed" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span>Deep<span className={styles.accent}>Shield</span> AI</span>
                        </a>
                        <p>Free AI-powered deepfake detection for everyone. Protecting digital truth in the age of synthetic media.</p>
                        <div className={styles.socials}>
                            {['𝕏', '⌥', 'in'].map(s => (
                                <a key={s} href="#" className={styles.social} aria-label="social">{s}</a>
                            ))}
                        </div>
                    </div>

                    {[
                        { heading: 'Product', links: ['Image Detector', 'Video Detector', 'Audio Detector', 'API Access'] },
                        { heading: 'Education', links: ['What is a Deepfake?', 'How Detection Works', 'Research Papers', 'Report a Threat'] },
                        { heading: 'Company', links: ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'] },
                    ].map(col => (
                        <div key={col.heading} className={styles.col}>
                            <h4>{col.heading}</h4>
                            <ul>
                                {col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className={styles.bottom}>
                    <p>© {year} DeepShield AI. Built to defend digital truth. Free forever.</p>
                    <p className={styles.disc}>For educational and public safety purposes only.</p>
                </div>
            </div>
        </footer>
    );
}
