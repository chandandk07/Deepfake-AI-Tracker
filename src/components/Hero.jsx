import React from 'react';
import ParticleCanvas from './ParticleCanvas';
import { useCounter, useInView } from '../hooks/useInView';
import styles from './Hero.module.css';

function TrustStat({ target, suffix, label, decimals = 0 }) {
    const [ref, inView] = useInView(0.5);
    const val = useCounter(target, inView, 2200, decimals);
    return (
        <div className={styles.trustItem} ref={ref}>
            <span className={styles.trustNum}>{val}{suffix}</span>
            <p>{label}</p>
        </div>
    );
}

export default function Hero() {
    return (
        <section className={styles.hero} id="hero">
            {/* Background layers */}
            <div className={styles.heroBg}>
                <ParticleCanvas />
                <div className={styles.grid} />
                <div className={`${styles.glow} ${styles.glow1}`} />
                <div className={`${styles.glow} ${styles.glow2}`} />
                <div className={`${styles.glow} ${styles.glow3}`} />
            </div>

            {/* Left – Copy */}
            <div className={styles.content}>
                <div className={styles.badge}>
                    <span className={styles.badgeDot} />
                    AI-Powered &middot; Free &middot; Instant Results
                </div>

                <h1 className={styles.title}>
                    <span className={styles.line}>Can You Trust</span>
                    <span className={`${styles.line} gradient-text`}>What You See?</span>
                </h1>

                <p className={styles.subtitle}>
                    Deepfakes, AI-generated images, and synthetic voices are reshaping
                    reality. <strong>DeepShield AI</strong> gives everyone the power to
                    verify digital media instantly — before misinformation spreads.
                </p>

                <div className={styles.actions}>
                    <a href="#detector" className="btn-primary">
                        <span>⚡</span> Analyze Media Now
                    </a>
                    <a href="#how-it-works" className="btn-secondary">Learn How It Works</a>
                </div>

                <div className={styles.trust}>
                    <TrustStat target={98.7} suffix="%" label="Accuracy" decimals={1} />
                    <div className={styles.divider} />
                    <TrustStat target={2.4} suffix="s" label="Avg. Scan Time" decimals={1} />
                    <div className={styles.divider} />
                    <TrustStat target={500} suffix="K+" label="Scans Done" />
                </div>
            </div>

            {/* Right – Scan Card */}
            <div className={styles.visual}>
                <div className={styles.scanCard}>
                    <div className={styles.scanFace}>
                        <div className={styles.faceGrid}>
                            <div className={`${styles.faceCircle} ${styles.outer}`} />
                            <div className={`${styles.faceCircle} ${styles.inner}`} />
                            {[[30, 25], [30, 65], [58, 45], [70, 30], [70, 60]].map(([t, l], i) => (
                                <div key={i} className={styles.faceDot}
                                    style={{ top: `${t}%`, left: `${l}%`, animationDelay: `${i * 0.3}s` }} />
                            ))}
                            <div className={styles.scanLine} />
                            <div className={styles.meshOverlay} />
                        </div>
                        <div className={styles.corners}>
                            <span className={`${styles.corner} ${styles.tl}`} />
                            <span className={`${styles.corner} ${styles.tr}`} />
                            <span className={`${styles.corner} ${styles.bl}`} />
                            <span className={`${styles.corner} ${styles.br}`} />
                        </div>
                    </div>

                    <div className={styles.scanInfo}>
                        <div className={styles.scanLabel}>ANALYSIS IN PROGRESS</div>
                        <div className={styles.bars}>
                            {[
                                { label: 'Facial Geometry', pct: 94, color: '#00d4ff' },
                                { label: 'Pixel Artifacts', pct: 87, color: '#7c3aed' },
                                { label: 'Metadata Hash', pct: 92, color: '#06d6a0' },
                            ].map(({ label, pct, color }) => (
                                <div key={label} className={styles.barRow}>
                                    <span>{label}</span>
                                    <div className={styles.barTrack}>
                                        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                    <span className={styles.barVal}>{pct}%</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.verdict}>⚠ DEEPFAKE DETECTED</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
