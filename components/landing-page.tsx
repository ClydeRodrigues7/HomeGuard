'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const metrics = [
  { icon: '<', target: 120, suffix: 'ms', decimals: 0, label: 'Inference Time' },
  { icon: '%', target: 99.99, suffix: '%', decimals: 2, label: 'Platform Uptime' },
  { icon: '*', target: 24, suffix: '/7', decimals: 0, label: 'Autonomous Runtime' },
  { icon: '#', target: 2.4, suffix: 'M', decimals: 1, label: 'Context Windows' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [counts, setCounts] = useState(metrics.map(() => 0));

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const update = (now: number) => {
      setCounts(metrics.map((metric, index) => {
        const elapsed = Math.max(0, now - started - (480 + index * 90));
        const progress = Math.min(1, elapsed / (1500 + index * 80));
        return metric.target * (1 - Math.pow(1 - progress, 3));
      }));
      if (now - started < 2300) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    const closeOnResize = () => { if (window.innerWidth > 720) setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnResize);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return <main className="landing landing-rebuild">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    <link href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    <div className="landing-video" aria-hidden="true"><video className="bg-video" autoPlay muted loop playsInline><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" /></video></div>
    <div className="landing-shade" aria-hidden="true" />
    <div className="landing-page">
      <header className="landing-header">
        <Link className="landing-logo" href="/" aria-label="HomeGuard home"><Image src="/homeguard-mark.svg" width={27} height={27} alt="" priority /></Link>
        <nav className="landing-nav-pill" aria-label="Main navigation"><a className="active" href="#home">Home</a><Link href="/dashboard">Dashboard</Link><Link href="/devices">Devices</Link><Link href="/security">Security</Link></nav>
        <Link className="landing-sign-in" href="/dashboard">Sign in</Link>
        <button className="landing-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </header>

      <section className="landing-center" id="home">
        <div className="trust-row anim" style={{'--d':'0.05s'} as React.CSSProperties}>
          <div className="trust-avatars" aria-label="Connected home devices"><span className="trust-avatar trust-a1"><i className="fa-solid fa-wifi" /></span><span className="trust-avatar trust-a2"><i className="fa-solid fa-house" /></span><span className="trust-avatar trust-a3"><i className="fa-solid fa-shield-halved" /></span></div>
          <span className="trust-label">Home network security, made clear</span>
        </div>
        <h1 className="headline anim"><span>Know Every Device</span><span>Keep Home Protected</span></h1>
        <p className="landing-subhead anim" style={{'--d':'0.28s'} as React.CSSProperties}>See what’s connected, understand security signals, and take practical steps to protect your home—all in one place.</p>
        <Link className="landing-cta anim" style={{'--d':'0.4s'} as React.CSSProperties} href="/dashboard">Get Started</Link>
      </section>

      <footer className="landing-stats">{metrics.map((metric, index) => <div className="landing-stat anim" style={{'--d':`${0.5 + index * 0.08}s`} as React.CSSProperties} key={metric.label}><span className="stat-icon">{metric.icon}</span><strong>{counts[index].toFixed(metric.decimals)}<small>{metric.suffix}</small></strong><span className="stat-label">{metric.label}</span></div>)}</footer>
    </div>

    {menuOpen && <><button className="mobile-menu-overlay" aria-label="Close menu" onClick={closeMenu} /><nav className="mobile-menu-sheet" aria-label="Mobile navigation"><a className="active" href="#home" onClick={closeMenu}>Home</a><Link href="/dashboard" onClick={closeMenu}>Dashboard</Link><Link href="/devices" onClick={closeMenu}>Devices</Link><Link href="/security" onClick={closeMenu}>Security</Link><Link href="/dashboard" onClick={closeMenu}>Sign in</Link></nav></>}
  </main>;
}
