import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Command, Home, Mail, Moon, SquareTerminal, Sun, User } from 'lucide-react';
import Hero from './components/Hero';
import { About, Band, Contact, Footer } from './components/Sections';
import GooeyNav from './components/rb/GooeyNav/GooeyNav';
import { Logo } from './components/Logo';
import Dock from './components/rb/Dock/Dock';
import ClickSpark from './components/rb/ClickSpark/ClickSpark';
import { CommandMenu, ScrollProgress, ShortcutsSheet, ToastProvider, useCopyEmail, useShortcuts } from './components/ui';
import Terminal from './components/Terminal';

// Where the last click happened, so the theme reveal can start there.
const lastPointer = { x: typeof window !== 'undefined' ? innerWidth / 2 : 0, y: typeof window !== 'undefined' ? innerHeight / 2 : 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => { lastPointer.x = e.clientX; lastPointer.y = e.clientY; }, { passive: true });
  window.addEventListener('keydown', () => { lastPointer.x = innerWidth / 2; lastPointer.y = innerHeight / 2; }, { passive: true });
}

// Black-and-white theme: follows the system until the visitor picks one.
function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme]);
  const flip = useCallback(() => setTheme((t) => {
    const next = t === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
    return next;
  }), []);
  // the new theme grows as a circle from the last click (or the centre for the T key)
  const toggle = useCallback(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) { flip(); return; }
    const { x, y } = lastPointer;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => flushSync(flip));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  }, [flip]);
  return [theme, toggle];
}

const GithubMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// Global keys need the toast context, so they run in a child of ToastProvider.
function Shortcuts(props) {
  useShortcuts(props);
  return null;
}

// Terminal needs the toast context for the email command.
function TerminalHost(props) {
  const copyEmail = useCopyEmail();
  return <Terminal {...props} copyEmail={copyEmail} />;
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [cmd, setCmd] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [term, setTerm] = useState(false);
  const toggleTerm = useCallback(() => setTerm((v) => !v), []);
  const openCmd = useCallback(() => setCmd(true), []);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('top');
  useEffect(() => {
    const ids = ['top', 'about', 'contact'];
    const on = () => {
      setScrolled(window.scrollY > 8);
      const y = window.scrollY + window.innerHeight * 0.4;
      let cur = 'top';
      for (const id of ids) { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; }
      setActive(cur);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const dark = theme === 'dark';
  const small = typeof window !== 'undefined' && window.innerWidth < 560;
  const ic = { size: 20, strokeWidth: 1.8 };

  const dockItems = [
    { label: 'Home', icon: <Home {...ic} />, onClick: () => go('top'), active: active === 'top' },
    { label: 'About', icon: <User {...ic} />, onClick: () => go('about'), active: active === 'about' },
    { label: 'Contact', icon: <Mail {...ic} />, onClick: () => go('contact'), active: active === 'contact' },
    { label: 'GitHub', icon: <GithubMark />, onClick: () => window.open('https://github.com/venstqs', '_blank', 'noopener') },
    { label: dark ? 'Light mode' : 'Dark mode', icon: dark ? <Sun {...ic} /> : <Moon {...ic} />, onClick: toggleTheme },
    { label: 'Terminal', icon: <SquareTerminal {...ic} />, onClick: toggleTerm, active: term },
    { label: 'Command menu', icon: <Command {...ic} />, onClick: () => setCmd(true) },
  ];

  return (
    <ToastProvider>
    <ClickSpark sparkColor={dark ? '#ffffff' : '#0a0a0a'} sparkCount={9} sparkRadius={26} sparkSize={12} layer="front">
      <a className="skip" href="#about">Skip to content</a>
      <div className={`navwrap ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="nav wrap" aria-label="Main">
          <a href="#top" aria-label="XavierLabs, back to top"><Logo /></a>
          <div className="nav-center">
            <GooeyNav
              items={NAV}
              activeIndex={Math.max(0, NAV.findIndex((n) => n.href === `#${active}`))}
              theme={theme}
              size="sm"
              particleCount={10}
            />
          </div>
        </nav>
        <ScrollProgress />
      </div>
      <Hero theme={theme} />
      <main>
        <About theme={theme} />
        <Band />
        <Contact theme={theme} />
      </main>
      <Footer />
      <Dock items={small ? dockItems.filter((d) => !['GitHub', 'Command menu', 'Terminal'].includes(d.label)) : dockItems} theme={theme} baseItemSize={small ? 40 : 44} magnification={small ? 40 : 64} panelHeight={small ? 54 : 60} accentColor={dark ? '#ffffff' : '#0a0a0a'} className="dock-fixed" />
      <Shortcuts toggleTheme={toggleTheme} openCmd={openCmd} cmdOpen={cmd || term} setSheet={setSheet} toggleTerm={toggleTerm} />
      <CommandMenu open={cmd} setOpen={setCmd} theme={theme} toggleTheme={toggleTheme} openShortcuts={() => setSheet(true)} openTerminal={() => setTerm(true)} />
      <ShortcutsSheet open={sheet} setOpen={setSheet} />
      <TerminalHost open={term} setOpen={setTerm} toggleTheme={toggleTheme} />
    </ClickSpark>
    </ToastProvider>
  );
}
