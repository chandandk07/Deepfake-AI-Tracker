import React from 'react';
import styles from './Tips.module.css';

const TIPS = [
    { n: '01', icon: '👁️', title: 'Unnatural Blinking', desc: 'AI models struggle with realistic blinking. Watch for no blinking or impossibly uniform blink timing.' },
    { n: '02', icon: '✨', title: 'Blurry Edges', desc: 'Look for blurring, smearing, or ghosting around hairlines, ears, and where the face meets the background.' },
    { n: '03', icon: '💡', title: 'Inconsistent Lighting', desc: 'Shadows, skin tone, and eye reflections should match the environment. Mismatches are a red flag.' },
    { n: '04', icon: '🎭', title: 'Emotional Mismatch', desc: 'AI faces often show emotions that don\'t match speech content or are slightly off in timing.' },
    { n: '05', icon: '🦻', title: 'Asymmetric Features', desc: 'Human faces have natural asymmetry. Deepfakes often produce suspiciously perfect or distorted features.' },
    { n: '06', icon: '🎙️', title: 'Robotic Audio', desc: 'AI voices may have perfect pronunciation but lack emotional inflection, breathing sounds, or natural pauses.' },
];

export default function Tips() {
    return (
        <section className={`section ${styles.section}`}>
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">EDUCATION</div>
                    <h2 className="section-title">
                        Spot Deepfakes <span className="gradient-text">Yourself</span>
                    </h2>
                    <p className="section-desc">While our AI does the heavy lifting, here are visual signs to watch for.</p>
                </div>
                <div className={styles.grid}>
                    {TIPS.map((t) => (
                        <div key={t.n} className={styles.card}>
                            <div className={styles.num}>{t.n}</div>
                            <div className={styles.icon}>{t.icon}</div>
                            <h4>{t.title}</h4>
                            <p>{t.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
