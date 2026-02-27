import React from 'react';
import { useInView, useCounter } from '../hooks/useInView';
import styles from './Stats.module.css';

const STATS = [
    { num: 900, suffix: '%', label: 'Increase in deepfakes since 2020', icon: '📈' },
    { num: 78, prefix: '$', suffix: 'B', label: 'Annual losses to AI-powered fraud', icon: '💸' },
    { num: 96, suffix: '%', label: 'Deepfake victims are women', icon: '⚠️' },
    { num: 500, suffix: 'K', label: 'Deepfake videos online in 2024', icon: '🎭' },
    { num: 68, suffix: '%', label: 'People cannot spot a deepfake', icon: '👁️' },
    { num: 3, suffix: 's', label: 'Voice clip needed to clone someone', icon: '🎤' },
];

function StatCard({ stat }) {
    const [ref, inView] = useInView(0.3);
    const val = useCounter(stat.num, inView, 2000);
    return (
        <div ref={ref} className={styles.card}>
            <div className={styles.num}>
                {stat.prefix}{val}{stat.suffix}
            </div>
            <div className={styles.label}>{stat.label}</div>
            <div className={styles.icon}>{stat.icon}</div>
        </div>
    );
}

export default function Stats() {
    return (
        <section className={`section ${styles.section}`} id="stats">
            <div className={styles.bg} />
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">THE CRISIS</div>
                    <h2 className="section-title">
                        The <span className="gradient-text">Deepfake Epidemic</span>
                    </h2>
                    <p className="section-desc">The scale of synthetic media manipulation is staggering. Here's why tools like DeepShield matter.</p>
                </div>
                <div className={styles.grid}>
                    {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
                </div>
            </div>
        </section>
    );
}
