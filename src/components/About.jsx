import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.css';

const FEED_ITEMS = [
    '🔴 Video deepfake — Political speech — India',
    '🟡 Suspicious image — Social media post — USA',
    '🔴 Voice clone — Bank call fraud — UK',
    '🟢 Authentic — Verified news footage — AUS',
    '🔴 AI-generated profile — Spam campaign — Germany',
    '🟡 Altered video — News clip — Brazil',
    '🔴 Synthetic voice — Ransomware call — Japan',
    '🟢 Authentic — Celebrity interview — France',
];

export default function About() {
    const [feed, setFeed] = useState(FEED_ITEMS.slice(0, 4));
    const feedIdx = useRef(4);

    useEffect(() => {
        const iv = setInterval(() => {
            const next = FEED_ITEMS[feedIdx.current % FEED_ITEMS.length];
            feedIdx.current++;
            setFeed(prev => [next, ...prev.slice(0, 3)]);
        }, 3000);
        return () => clearInterval(iv);
    }, []);

    return (
        <section className={`section ${styles.section}`} id="about">
            <div className="container">
                <div className={styles.grid}>
                    {/* Text */}
                    <div className={styles.text}>
                        <div className="section-tag">MISSION</div>
                        <h2 className="section-title">
                            Why We Built <span className="gradient-text">DeepShield</span>
                        </h2>
                        <p>In an era where seeing is no longer believing, digital trust has become one of the most critical infrastructure problems of our time. Deepfake technology is now accessible to anyone with a laptop — and bad actors are exploiting it for fraud, harassment, and democratic manipulation.</p>
                        <p>We believe that <strong>truth should be free and accessible</strong>. While governments and platforms are slow to respond, individuals deserve the tools to protect themselves <em>today</em>.</p>
                        <p>DeepShield was built by AI researchers and cybersecurity experts with one clear goal: <em>make deepfake detection as easy as taking a screenshot.</em></p>
                        <div className={styles.values}>
                            {['🔓 Open Access', '🔒 Privacy First', '🌍 Global Mission', '🧠 Research Backed'].map(v => (
                                <span key={v} className={styles.chip}>{v}</span>
                            ))}
                        </div>
                    </div>

                    {/* Visual */}
                    <div className={styles.visual}>
                        <div className={styles.globe}>
                            <div className={styles.ring} />
                            <div className={`${styles.ring} ${styles.ringB}`} />
                            <div className={styles.globeCore}>
                                <div className={styles.globeIcon}>🌐</div>
                                <p>Global Threat Monitor</p>
                            </div>
                            {[
                                [18, 58], [52, 18], [70, 72], [35, 42], [50, 55],
                            ].map(([t, l], i) => (
                                <div key={i} className={`${styles.dot} ${i === 4 ? styles.pulse : ''}`}
                                    style={{ top: `${t}%`, left: `${l}%` }} />
                            ))}
                        </div>

                        {/* Real-time feed */}
                        <div className={styles.feedCard}>
                            <div className={styles.feedHeader}>
                                <span className={styles.feedDot} /> Real-time Detection Feed
                            </div>
                            <div className={styles.feedList}>
                                {feed.map((item, i) => (
                                    <div key={`${i}-${item}`} className={styles.feedItem}
                                        style={{ animationDelay: `${i * 0.05}s` }}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
