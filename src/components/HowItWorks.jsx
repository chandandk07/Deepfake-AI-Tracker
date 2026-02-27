import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import styles from './HowItWorks.module.css';

const STEPS = [
    { num: '01', icon: '📤', title: 'Upload or Paste URL', desc: 'Drag & drop an image, video clip, or audio file — or simply paste a social media URL. We support JPG, PNG, MP4, MOV, MP3, and WAV.' },
    { num: '02', icon: '🔬', title: 'Multi-Model Analysis', desc: 'Our ensemble of 12 specialized AI models analyzes pixel anomalies, temporal inconsistencies, frequency artifacts, and biometric patterns simultaneously.' },
    { num: '03', icon: '🧠', title: 'AI Confidence Scoring', desc: 'Results are cross-validated across models. A confidence score is computed, and the media is classified as Authentic, Suspicious, or Deepfake.' },
    { num: '04', icon: '📋', title: 'Receive Your Report', desc: 'Get an instant, human-readable verdict with visual evidence highlights, model explanations, and a shareable verification certificate.' },
];

const MODELS = [
    'EfficientNet-B7', 'XceptionNet', 'Vision Transformer', 'FaceForensics++',
    'CLIP Detector', 'RealForensics', 'Wav2Vec 2.0', 'AASIST',
];

function Step({ step, index }) {
    const [ref, inView] = useInView(0.2);
    return (
        <div
            ref={ref}
            className={`${styles.step} ${inView ? styles.visible : ''}`}
            style={{ transitionDelay: `${index * 0.15}s` }}
        >
            <div className={styles.stepNum}>{step.num}</div>
            <div className={styles.stepIcon}>{step.icon}</div>
            <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
            </div>
        </div>
    );
}

export default function HowItWorks() {
    return (
        <section className={`section ${styles.section}`} id="how-it-works">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">PROCESS</div>
                    <h2 className="section-title">
                        How <span className="gradient-text">DeepShield</span> Works
                    </h2>
                    <p className="section-desc">Our 4-step AI pipeline delivers a verdict in under 3 seconds.</p>
                </div>

                <div className={styles.stepsWrap}>
                    <div className={styles.line} />
                    {STEPS.map((s, i) => <Step key={s.num} step={s} index={i} />)}
                </div>

                <div className={styles.modelsSection}>
                    <p className={styles.modelsIntro}>Powered by state-of-the-art detection models:</p>
                    <div className={styles.modelsGrid}>
                        {MODELS.map((m) => (
                            <span key={m} className={styles.chip}>{m}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
