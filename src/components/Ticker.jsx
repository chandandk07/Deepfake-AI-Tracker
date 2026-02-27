import React, { useEffect, useRef } from 'react';
import styles from './Ticker.module.css';

const THREATS = [
    '🔴 Deepfake video detected on Twitter — Political candidate impersonation',
    '🔴 AI voice clone used in ₹2.3 Crore bank fraud — Mumbai, India',
    '🔴 85% of viral political images in 2024 elections were AI-generated',
    '🔴 Synthetic media incidents up 900% since 2020',
    '🔴 New GAN model can generate undetectable face swaps in real-time',
    '🔴 Deepfake pornography targets 96% women victims globally',
    '🔴 CEO voice scam — $243,000 transferred by fraudulent audio call',
    '🔴 AI-generated profile pictures dominate romance scam operations',
];

export default function Ticker() {
    const content = [...THREATS, ...THREATS]; // doubled for seamless loop
    return (
        <div className={styles.bar} role="marquee" aria-label="Live threat feed">
            <div className={styles.label}>📡 LIVE THREATS</div>
            <div className={styles.track}>
                <div className={styles.content}>
                    {content.map((t, i) => <span key={i}>{t}</span>)}
                </div>
            </div>
        </div>
    );
}
