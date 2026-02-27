import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Detector from './components/Detector';
import Stats from './components/Stats';
import Tips from './components/Tips';
import About from './components/About';
import Footer from './components/Footer';
import styles from './App.module.css';

function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaGlow} />
      <div className="container">
        <div className={styles.ctaContent}>
          <h2>Don't Share Without Verifying</h2>
          <p>Every share matters. Before you forward that video or post that image, ensure it's real.</p>
          <div className={styles.ctaActions}>
            <a href="#detector" className={`btn-primary ${styles.ctaBtn}`}>🔍 Scan Media for Free</a>
            <a href="#features" className={`btn-secondary ${styles.ctaBtn}`}>Explore Features</a>
          </div>
          <p className={styles.ctaNote}>100% Free · No Account Required · Instant Results</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Features />
        <HowItWorks />
        <Detector />
        <Stats />
        <Tips />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
