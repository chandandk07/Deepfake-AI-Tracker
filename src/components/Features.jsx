import React, { useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import styles from './Features.module.css';

const FEATURES = [
    {
        id: 'image',
        icon: (
            <svg viewBox="0 0 48 48" fill="none">
                <rect x="6" y="6" width="36" height="36" rx="6" stroke="#00d4ff" strokeWidth="2" />
                <circle cx="24" cy="20" r="7" stroke="#00d4ff" strokeWidth="2" />
                <path d="M9 38c0-8.284 6.716-15 15-15s15 6.716 15 15" stroke="#00d4ff" strokeWidth="2" />
                <path d="M30 15l4 4M30 19l4-4" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        color: 'blue',
        title: 'Image Authentication',
        desc: 'Detects GAN-generated faces, DALL·E images, Stable Diffusion outputs, and photo-edited manipulations using pixel-level analysis.',
        features: ['Face swap detection', 'GAN fingerprint analysis', 'EXIF metadata verification', 'Noise pattern analysis'],
        accuracy: 98.2,
    },
    {
        id: 'video',
        icon: (
            <svg viewBox="0 0 48 48" fill="none">
                <rect x="6" y="10" width="36" height="28" rx="4" stroke="#7c3aed" strokeWidth="2" />
                <path d="M16 10V8M24 10V8M32 10V8" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                <path d="M34 24l-10 6V18l10 6z" fill="#7c3aed" />
            </svg>
        ),
        color: 'purple',
        title: 'Video Deepfake Detection',
        desc: 'Frame-by-frame temporal analysis to catch face swaps, lip-sync manipulations, and AI-generated video sequences.',
        features: ['Temporal consistency check', 'Lip-sync verification', 'Blinking pattern analysis', 'Compression artifact scan'],
        accuracy: 96.8,
        featured: true,
    },
    {
        id: 'audio',
        icon: (
            <svg viewBox="0 0 48 48" fill="none">
                <path d="M24 8v32M16 16v16M8 20v8M32 12v24M40 18v12" stroke="#06d6a0" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        ),
        color: 'green',
        title: 'Voice Clone Detection',
        desc: 'Identifies AI-synthesized voices, TTS-generated audio, and voice cloning attacks on real-time recordings.',
        features: ['Spectral analysis', 'Prosody fingerprinting', 'Background noise patterns', 'Emotional consistency'],
        accuracy: 94.5,
    },
];

const EXTRAS = [
    { icon: '🔗', title: 'URL Scanner', desc: 'Paste any social media link to scan embedded media' },
    { icon: '📊', title: 'Confidence Report', desc: 'Detailed PDF report with probability scores per model' },
    { icon: '🛡️', title: 'Privacy First', desc: 'Files deleted immediately after analysis. Zero data retention.' },
    { icon: '🌐', title: '12 Languages', desc: 'Interface and reports available in major global languages' },
];

function AccBar({ accuracy, inView }) {
    return (
        <div className={styles.accuracy}>
            <span className={styles.accLabel}>Accuracy</span>
            <div className={styles.accTrack}>
                <div
                    className={styles.accFill}
                    style={{ width: inView ? `${accuracy}%` : '0%' }}
                />
            </div>
            <span className={styles.accVal}>{accuracy}%</span>
        </div>
    );
}

export default function Features() {
    const [ref, inView] = useInView(0.1);

    return (
        <section className={`section ${styles.section}`} id="features">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">CAPABILITIES</div>
                    <h2 className="section-title">
                        Multi-Modal <span className="gradient-text">Detection Engine</span>
                    </h2>
                    <p className="section-desc">
                        Our AI analyzes images, videos, and audio using 12+ detection models simultaneously.
                    </p>
                </div>

                <div className={styles.grid} ref={ref}>
                    {FEATURES.map((f) => (
                        <div
                            key={f.id}
                            className={`${styles.card} ${styles[`glow_${f.color}`]} ${f.featured ? styles.featured : ''}`}
                        >
                            {f.featured && <div className={styles.featuredBadge}>MOST POPULAR</div>}
                            <div className={`${styles.icon} ${styles[`icon_${f.color}`]}`}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <ul className={styles.list}>
                                {f.features.map((item) => <li key={item}>✦ {item}</li>)}
                            </ul>
                            <AccBar accuracy={f.accuracy} inView={inView} />
                        </div>
                    ))}
                </div>

                <div className={styles.extras}>
                    {EXTRAS.map((e) => (
                        <div key={e.title} className={styles.extraCard}>
                            <span className={styles.extraIcon}>{e.icon}</span>
                            <div>
                                <strong>{e.title}</strong>
                                <p>{e.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
