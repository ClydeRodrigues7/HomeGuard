'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, BellRing, Eye, Menu, ShieldCheck, Wifi, X } from 'lucide-react';

const heroHighlights = [
  { icon: Wifi, title: 'Every device', label: 'in one clear inventory' },
  { icon: ShieldCheck, title: 'Useful signals', label: 'with context that helps' },
  { icon: BellRing, title: 'Practical steps', label: 'at your own pace' },
  { icon: Eye, title: 'One dashboard', label: 'for your home network' },
];

const features = [
  { icon: Eye, number: '01 / VISIBILITY', title: 'Know what’s connected', text: 'Keep your devices in one inventory, with their connection status and the details that help you recognize them.', href: '/devices', link: 'Explore devices' },
  { icon: ShieldCheck, number: '02 / CONTEXT', title: 'Understand security signals', text: 'Review noteworthy changes, see why they matter, and decide what deserves a closer look.', href: '/security', link: 'Explore security' },
  { icon: BellRing, number: '03 / ACTION', title: 'Take practical next steps', text: 'Work through clear recommendations at your pace and keep track of what you’ve reviewed.', href: '/recommendations', link: 'View recommendations' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <section className="landing-hero-screen" id="home">
      <div className="landing-video" aria-hidden="true"><video className="bg-video" autoPlay muted loop playsInline><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" /></video></div>
      <div className="landing-shade" aria-hidden="true" />
      <div className="landing-page">
        <header className="landing-header">
          <Link className="landing-logo" href="/" aria-label="HomeGuard home"><Image src="/homeguard-mark.svg" width={27} height={27} alt="" priority /></Link>
          <nav className="landing-nav-pill" aria-label="Main navigation"><a className="active" href="#home">Home</a><a href="#features">Features</a><a href="#how-it-works">How it works</a><Link href="/dashboard">Dashboard</Link></nav>
          <Link className="landing-sign-in" href="/dashboard">Sign in</Link>
          <button className="landing-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </header>
        <section className="landing-center">
          <div className="trust-row anim" style={{'--d':'0.05s'} as React.CSSProperties}>
            <div className="trust-avatars" aria-label="Connected home devices"><span className="trust-avatar trust-a1"><i className="fa-solid fa-wifi" /></span><span className="trust-avatar trust-a2"><i className="fa-solid fa-house" /></span><span className="trust-avatar trust-a3"><i className="fa-solid fa-shield-halved" /></span></div>
            <span className="trust-label">Home network security, made clear</span>
          </div>
          <h1 className="headline anim"><span>Know Every Device</span><span>Keep Home Protected</span></h1>
          <p className="landing-subhead anim" style={{'--d':'0.28s'} as React.CSSProperties}>See what’s connected, understand security signals, and take practical steps to protect your home—all in one place.</p>
          <Link className="landing-cta anim" style={{'--d':'0.4s'} as React.CSSProperties} href="/dashboard">Get Started</Link>
        </section>
        <footer className="landing-stats">{heroHighlights.map(({icon: Icon, title, label}, index) => <div className="landing-stat anim" style={{'--d':`${0.5 + index * 0.08}s`} as React.CSSProperties} key={title}><span className="stat-icon"><Icon size={19} strokeWidth={1.6}/></span><span className="stat-copy"><strong>{title}</strong><span className="stat-label">{label}</span></span></div>)}</footer>
      </div>
      <a className="hero-scroll-cue" href="#features"><span>Discover HomeGuard</span><ArrowDown size={14}/></a>
    </section>

    <section className="home-section features-section" id="features">
      <div className="section-intro"><span className="section-kicker"><i/> A clearer view of your network</span><h2>Security that starts<br/><span>with knowing your home.</span></h2><p>HomeGuard brings your connected devices and security signals into one calm, easy-to-understand workspace.</p></div>
      <div className="feature-grid">{features.map(({icon: Icon, number, title, text, href, link}) => <article className="home-feature-card" key={number}><div className="feature-icon"><Icon size={19}/></div><span className="feature-index">{number}</span><h3>{title}</h3><p>{text}</p><Link href={href}>{link} <ArrowRight size={14}/></Link></article>)}</div>
    </section>

    <section className="home-section how-section" id="how-it-works">
      <div className="how-panel"><div className="how-copy"><span className="section-kicker"><i/> Simple by design</span><h2>A more confident<br/>way to manage<br/><span>your home network.</span></h2><p>Start with a clear inventory. Review the signals that need your attention. Make changes only when you’re ready.</p><Link className="landing-cta how-cta" href="/dashboard">Open your dashboard <ArrowRight size={15}/></Link></div><div className="how-steps"><div className="how-step"><span>01</span><div><h3>See your devices</h3><p>Bring your home network into view from one place.</p></div><Wifi size={18}/></div><div className="how-step"><span>02</span><div><h3>Review what stands out</h3><p>Get useful context for changes and security findings.</p></div><Eye size={18}/></div><div className="how-step"><span>03</span><div><h3>Choose what to do</h3><p>Follow a recommendation or simply keep an eye on it.</p></div><ShieldCheck size={18}/></div></div></div>
    </section>

    <footer className="home-footer"><Link className="footer-brand" href="/" aria-label="HomeGuard home"><Image src="/homeguard-mark.svg" width={22} height={22} alt=""/><span>HomeGuard</span></Link><span className="footer-tagline">Know every device. Keep home protected.</span><div><a href="#features">Features</a><Link href="/dashboard">Dashboard</Link><a href="#home">Back to top ↑</a></div><small>© {new Date().getFullYear()} HomeGuard</small></footer>
    {menuOpen && <><button className="mobile-menu-overlay" aria-label="Close menu" onClick={closeMenu} /><nav className="mobile-menu-sheet" aria-label="Mobile navigation"><a className="active" href="#home" onClick={closeMenu}>Home</a><a href="#features" onClick={closeMenu}>Features</a><a href="#how-it-works" onClick={closeMenu}>How it works</a><Link href="/dashboard" onClick={closeMenu}>Dashboard</Link><Link href="/dashboard" onClick={closeMenu}>Sign in</Link></nav></>}
  </main>;
}
