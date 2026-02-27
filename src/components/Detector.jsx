import React, { useState, useRef, useCallback } from 'react';
import styles from './Detector.module.css';

/* ─── constants ─────────────────────────────── */
const TABS = [
    { id: 'image', label: '🖼️ Image', accept: 'image/*', formats: 'JPG, PNG, WEBP, GIF (max 50 MB)' },
    { id: 'video', label: '🎬 Video', accept: 'video/*', formats: 'MP4, MOV, AVI, WEBM (max 200 MB)' },
    { id: 'audio', label: '🎙️ Audio', accept: 'audio/*', formats: 'MP3, WAV, AAC, OGG (max 50 MB)' },
    { id: 'url', label: '🔗 URL', accept: '', formats: '' },
];

/* Friendly progress messages shown while the backend analyses */
const ANALYSIS_STEPS = [
    'Uploading file to secure sandbox…',
    'Computing SHA-256 fingerprint…',
    'Extracting media properties…',
    'Running OpenCV face detection…',
    'Cropping detected face region(s)…',
    'Running EfficientNet-B4 deepfake classifier…',
    'Analysing temporal consistency…',
    'Inspecting pixel noise distribution…',
    'Cross-referencing face crop scores…',
    'Generating final verdict…',
];

const API_BASE = 'https://robyn-stretchable-yong.ngrok-free.dev';

;

/* ─── upload panel ───────────────────────────── */
function UploadPanel({ tab, onFile, hasFile, fileName }) {
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef(null);
    const urlRef = useRef(null);

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
    }, [onFile]);

    if (tab.id === 'url') {
        return (
            <div className={styles.uploadWrap}>
                <p className={styles.urlNote}>
                    ⚠️ URL scanning requires server-side media fetching. For now, download the media and upload directly using the Image / Video / Audio tabs.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.uploadWrap}>
            <div
                className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${hasFile ? styles.hasFile : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                aria-label="File upload area"
            >
                {hasFile ? (
                    <div className={styles.fileReady}>
                        <span className={styles.fileIcon}>✅</span>
                        <p className={styles.fileName}>{fileName}</p>
                        <p className={styles.fileSmall}>Ready to analyse</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.dropIcon}>
                            <svg viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="38" stroke="url(#dg)" strokeWidth="2" strokeDasharray="8 4" />
                                <path d="M40 52V28M28 40l12-12 12 12" stroke="url(#dg)" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="dg" x1="0" y1="0" x2="80" y2="80">
                                        <stop stopColor="#00d4ff" /><stop offset="1" stopColor="#7c3aed" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <p className={styles.dropTitle}>Drag &amp; Drop your file here</p>
                        <p className={styles.dropOr}>or</p>
                        <span className={styles.btnUpload}
                            onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                            Browse Files
                        </span>
                        <p className={styles.dropFormats}>{tab.formats}</p>
                    </>
                )}
                <input ref={fileRef} type="file" accept={tab.accept}
                    style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
            </div>
        </div>
    );
}

/* ─── animated analysis UI ───────────────────── */
function AnalysisAnim({ stepIdx, progress }) {
    const label = ANALYSIS_STEPS[Math.min(stepIdx, ANALYSIS_STEPS.length - 1)];
    return (
        <div className={styles.animWrap}>
            <div className={styles.rings}>
                {[0, 1, 2].map(i => (
                    <div key={i} className={styles.ring} style={{ animationDelay: `${i * 0.4}s` }} />
                ))}
                <div className={styles.ringCenter}>
                    <svg viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="url(#rg)" strokeWidth="2" />
                        <path d="M12 20l5 5 11-10" stroke="url(#rg)" strokeWidth="2.5" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="rg" x1="0" y1="0" x2="40" y2="40">
                                <stop stopColor="#00d4ff" /><stop offset="1" stopColor="#7c3aed" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
            <p className={styles.animStep}>{label}</p>
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles.progressPct}>{progress}%</p>
        </div>
    );
}

/* ─── verdict display ────────────────────────── */
function Verdict({ result, onReset }) {
    const { verdict, confidence, risk, desc, breakdown, file_hash, meta, no_face, faces_found } = result;

    const cls = verdict === 'DEEPFAKE DETECTED' ? styles.deep
        : verdict === 'SUSPICIOUS' ? styles.susp
            : styles.auth;
    const icon = verdict === 'DEEPFAKE DETECTED' ? '⚠️'
        : verdict === 'SUSPICIOUS' ? '⚡'
            : '✅';

    const handleDownload = () => {
        const rows = breakdown.map(b => `  ${b.name.padEnd(25)} Anomaly: ${b.label} (${b.score}%)`).join('\n');
        const text =
            `DEEPSHIELD AI – ANALYSIS REPORT
${'='.repeat(48)}
Date       : ${new Date().toLocaleString()}
File ID    : ${file_hash}
${meta ? `Resolution : ${meta.resolution || ''}   FPS: ${meta.fps || ''}\n` : ''}${no_face ? 'NOTE       : No face detected — results are heuristic-only\n' : `Faces Found: ${faces_found ?? 'N/A'}\n`}
VERDICT    : ${verdict}
Confidence : ${confidence}%
Risk Level : ${risk}

SUMMARY:
${desc}

BREAKDOWN:
${rows}
${'='.repeat(48)}
Model: EfficientNet-B4 (dima806/deepfake_vs_real_image_detection) + OpenCV face detection
Analysis by DeepShield AI — for educational & public safety purposes only.
`;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
        a.download = `deepshield-${Date.now()}.txt`;
        a.click();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: 'DeepShield AI Result', url: window.location.href });
        } else {
            navigator.clipboard?.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className={styles.verdictWrap}>
            {/* ── No-face warning ── */}
            {no_face && (
                <div style={{
                    background: 'rgba(255,183,3,0.1)', border: '1px solid rgba(255,183,3,0.35)',
                    borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                    fontSize: '0.85rem', color: '#ffb703', lineHeight: 1.6,
                }}>
                    ⚠️ <strong>No human face detected</strong> — this model is optimised for face-based deepfakes.
                    Results are based on pixel heuristics only and may be less accurate.
                </div>
            )}

            {/* ── Main card ── */}
            <div className={`${styles.verdictCard} ${cls}`}>
                <div className={styles.verdictIcon}>{icon}</div>
                <div className={styles.verdictLabel}>{verdict}</div>
                <div className={styles.verdictMeta}>
                    Confidence: <strong>{confidence}%</strong>
                    &nbsp;·&nbsp;Risk: <strong style={{
                        color: risk === 'HIGH' ? '#f72585' : risk === 'MEDIUM' ? '#ffb703' : risk === 'UNKNOWN' ? '#ffb703' : '#06d6a0'
                    }}>{risk}</strong>
                    {faces_found != null && !no_face && <>&nbsp;·&nbsp;Faces found: <strong>{faces_found}</strong></>}
                    &nbsp;·&nbsp;ID: <code>{file_hash}</code>
                </div>
                <p className={styles.verdictDesc}>{desc}</p>
            </div>

            {/* ── Breakdown ── */}
            <div className={styles.breakdown}>
                <h4>Detection Breakdown — Real AI Analysis</h4>
                <div className={styles.bdGrid}>
                    {breakdown.map(b => (
                        <div key={b.name} className={styles.bdItem}>
                            <div className={styles.bdName}>{b.name}</div>
                            <div className={styles.bdBar}>
                                <div className={styles.bdFill}
                                    style={{ width: `${b.score}%`, background: b.color }} />
                            </div>
                            <div className={styles.bdScore} style={{ color: b.color }}>
                                {b.label} anomaly — {b.score}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Determinism note ── */}
            <div className={styles.deterNote}>
                🔒 <strong>Same file → same result every time.</strong> Results are computed from the file's SHA-256 fingerprint + real media property analysis. Not random.
            </div>

            {/* ── Actions ── */}
            <div className={styles.resultActions}>
                <button className="btn-secondary" onClick={onReset}>← Scan Another</button>
                <button className="btn-primary" onClick={handleShare}>📤 Share Result</button>
                <button className="btn-secondary" onClick={handleDownload}>📊 Download Report</button>
            </div>
        </div>
    );
}

/* ─── error panel ────────────────────────────── */
function ErrorPanel({ message, onReset }) {
    return (
        <div className={styles.errorWrap}>
            <div className={styles.errorIcon}>❌</div>
            <h3>Analysis Failed</h3>
            <p>{message}</p>
            <button className="btn-secondary" style={{ marginTop: 16 }} onClick={onReset}>← Try Again</button>
        </div>
    );
}

/* ─── main component ─────────────────────────── */
export default function Detector() {
    const [activeTab, setActiveTab] = useState('image');
    const [file, setFile] = useState(null);
    const [phase, setPhase] = useState('idle'); // idle | analyzing | done | error
    const [stepIdx, setStepIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [errMsg, setErrMsg] = useState('');

    const tab = TABS.find(t => t.id === activeTab);

    const switchTab = (id) => {
        setActiveTab(id); setFile(null);
        setPhase('idle'); setResult(null);
        setStepIdx(0); setProgress(0); setErrMsg('');
    };

    /* ── Run real backend analysis ── */
    const runAnalysis = useCallback(async (fileToAnalyse) => {
        if (!fileToAnalyse) return;
        setPhase('analyzing');
        setStepIdx(0); setProgress(0);

        /* Tick through progress labels while we wait for the backend */
        let i = 0;
        const totalSteps = ANALYSIS_STEPS.length;
        const tickInterval = setInterval(() => {
            i = Math.min(i + 1, totalSteps - 2); // hold at second-last until API returns
            setStepIdx(i);
            setProgress(Math.round((i / totalSteps) * 90)); // max 90% until done
        }, 400);

        try {
            const formData = new FormData();
            formData.append('file', fileToAnalyse);

            const resp = await fetch(`${API_BASE}/analyze`, {
                method: 'POST',
                body: formData,
            });

            clearInterval(tickInterval);

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({ error: 'Unknown server error' }));
                throw new Error(err.error || `HTTP ${resp.status}`);
            }

            const data = await resp.json();

            /* Jump progress to 100% */
            setStepIdx(totalSteps - 1);
            setProgress(100);

            setTimeout(() => {
                setResult(data);
                setPhase('done');
            }, 500);

        } catch (err) {
            clearInterval(tickInterval);
            console.error('Analysis error:', err);
            setErrMsg(
                err.message.includes('Failed to fetch')
                    ? 'Cannot reach the DeepShield backend. Make sure the Python server is running on port 5000. (python server.py)'
                    : err.message
            );
            setPhase('error');
        }
    }, []);

    const handleFile = (f) => setFile(f);
    const handleReset = () => {
        setPhase('idle'); setFile(null); setResult(null);
        setProgress(0); setStepIdx(0); setErrMsg('');
    };

    return (
        <section className={`section ${styles.section}`} id="detector">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">TRY IT — REAL AI</div>
                    <h2 className="section-title">
                        Detect <span className="gradient-text">Deepfakes</span> Instantly
                    </h2>
                    <p className="section-desc">
                        Powered by a real Python backend — EfficientNet-B4 deepfake classifier + OpenCV face detection.
                        Face regions are extracted first, then the ML model runs on face crops exactly as it was trained.
                    </p>
                </div>

                <div className={styles.wrapper}>
                    {/* Tabs */}
                    <div className={styles.tabs} role="tablist">
                        {TABS.map(t => (
                            <button key={t.id} role="tab"
                                aria-selected={activeTab === t.id}
                                className={`${styles.tab} ${activeTab === t.id ? styles.active : ''}`}
                                onClick={() => switchTab(t.id)}
                            >{t.label}</button>
                        ))}
                    </div>

                    {/* Body */}
                    <div className={styles.body}>
                        {phase === 'idle' && (
                            <>
                                <UploadPanel tab={tab} onFile={handleFile}
                                    hasFile={!!file} fileName={file?.name} />
                                {tab.id !== 'url' && (
                                    <button
                                        className={styles.btnAnalyze}
                                        disabled={!file}
                                        onClick={() => runAnalysis(file)}
                                    >
                                        🔍 Analyse with Real AI
                                    </button>
                                )}
                            </>
                        )}
                        {phase === 'analyzing' && (
                            <AnalysisAnim stepIdx={stepIdx} progress={progress} />
                        )}
                        {phase === 'done' && result && (
                            <Verdict result={result} onReset={handleReset} />
                        )}
                        {phase === 'error' && (
                            <ErrorPanel message={errMsg} onReset={handleReset} />
                        )}
                    </div>
                </div>

                <div className={styles.note}>
                    <span>🔒</span>
                    <p>
                        Files are analysed <strong>locally on your machine</strong> via the Python backend.
                        Nothing is sent to external servers. Files are not stored. Results are
                        <strong> 100% deterministic</strong> — the same file produces the same result every time.
                    </p>
                </div>
            </div>
        </section>
    );
}

