import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, Copy, CornerDownLeft, Home, Keyboard, Mail, Moon, Search, Sparkles, SquareTerminal, Sun, User, X } from 'lucide-react';
import { PROFILE, SOCIALS } from '../data';

/* ── Toast ──────────────────────────────────────────────────────────────── */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(0);
  const show = useCallback((text) => {
    clearTimeout(timer.current);
    setToast({ text, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div key={toast.id} className="toast" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
              <Check size={15} aria-hidden="true" /> {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useCopyEmail() {
  const toast = useToast();
  return useCallback(async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); toast('Email copied to clipboard'); }
    catch { window.location.href = `mailto:${PROFILE.email}`; }
  }, [toast]);
}

/* ── Scroll progress ────────────────────────────────────────────────────── */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return <div className="progress" aria-hidden="true"><i ref={ref} /></div>;
}

/* ── Command menu (Ctrl/⌘ + K) ──────────────────────────────────────────── */
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export function CommandMenu({ open, setOpen, theme, toggleTheme, openShortcuts, openTerminal }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const inputRef = useRef(null);
  const copyEmail = useCopyEmail();

  const actions = useMemo(() => [
    { group: 'Go to', label: 'Top', icon: Home, run: () => go('top') },
    { group: 'Go to', label: 'About', icon: User, run: () => go('about') },
    { group: 'Go to', label: 'Contact', icon: Mail, run: () => go('contact') },
    { group: 'Actions', label: 'Copy email address', icon: Copy, run: copyEmail },
    { group: 'Actions', label: 'Keyboard shortcuts', icon: Keyboard, run: () => openShortcuts?.() },
    { group: 'Actions', label: 'Open Terminal', icon: SquareTerminal, run: () => openTerminal?.() },
    { group: 'Actions', label: 'Send an email', icon: Mail, run: () => { window.location.href = `mailto:${PROFILE.email}`; } },
    { group: 'Actions', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', icon: theme === 'dark' ? Sun : Moon, run: toggleTheme },
    ...SOCIALS.map((s) => ({ group: 'Links', label: `Open ${s.label}`, hint: s.handle, icon: ArrowUpRight, run: () => window.open(s.href, '_blank', 'noopener') })),
  ], [copyEmail, theme, toggleTheme, openShortcuts, openTerminal]);

  const list = actions.filter((a) => (a.label + ' ' + (a.hint || '')).toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((v) => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) { setQ(''); setI(0); setTimeout(() => inputRef.current?.focus(), 10); }
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const run = (a) => { setOpen(false); setTimeout(a.run, 60); };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(v + 1, list.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(v - 1, 0)); }
    else if (e.key === 'Enter' && list[i]) { e.preventDefault(); run(list[i]); }
  };

  let lastGroup = null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmd-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onMouseDown={() => setOpen(false)}>
          <motion.div
            className="cmd"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 460, damping: 34 }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKey}
          >
            <div className="cmd-search">
              <Search size={17} aria-hidden="true" />
              <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} placeholder="Type a command or search…" aria-label="Search commands" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant={list[i] ? `cmd-${i}` : undefined} />
              <kbd>Esc</kbd>
            </div>
            <ul className="cmd-list" id="cmd-list" role="listbox">
              {list.map((a, n) => {
                const Icon = a.icon;
                const head = a.group !== lastGroup ? a.group : null;
                lastGroup = a.group;
                return (
                  <li key={a.label} role="presentation">
                    {head && <p className="cmd-group">{head}</p>}
                    <button type="button" id={`cmd-${n}`} role="option" aria-selected={n === i} className={`cmd-item ${n === i ? 'is-on' : ''}`} onMouseMove={() => setI(n)} onClick={() => run(a)}>
                      <Icon size={16} aria-hidden="true" />
                      <span>{a.label}</span>
                      {a.hint && <small>{a.hint}</small>}
                      {n === i && <CornerDownLeft size={14} className="cmd-enter" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
              {!list.length && <li className="cmd-empty">No command matches “{q}”.</li>}
            </ul>
            <div className="cmd-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> run</span><span><kbd>Ctrl</kbd><kbd>K</kbd> toggle</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Keyboard shortcuts (press ?) ───────────────────────────────────────── */
const SECTION_KEYS = [['1', 'top', 'Top'], ['2', 'about', 'About'], ['3', 'contact', 'Contact']];

export function useShortcuts({ toggleTheme, openCmd, cmdOpen, setSheet, toggleTerm }) {
  const copyEmail = useCopyEmail();
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, [contenteditable="true"]')) return;
      if (e.key === '`' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); toggleTerm?.(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey || cmdOpen) return;
      if (e.key === '?') { e.preventDefault(); setSheet((v) => !v); return; }
      if (e.key === 'Escape') { setSheet(false); return; }
      const k = e.key.toLowerCase();
      const sec = SECTION_KEYS.find(([key]) => key === k);
      if (sec) { go(sec[1]); setSheet(false); return; }
      if (k === 't') toggleTheme();
      else if (k === 'e') copyEmail();
      else if (k === '/') { e.preventDefault(); openCmd(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleTheme, openCmd, cmdOpen, copyEmail, setSheet, toggleTerm]);
}

export function ShortcutsSheet({ open, setOpen }) {
  const rows = [
    ...SECTION_KEYS.map(([k, , label]) => [[k], `Go to ${label}`]),
    [['Ctrl', 'K'], 'Command menu'],
    [['/'], 'Command menu'],
    [['T'], 'Toggle black / white'],
    [['E'], 'Copy my email'],
    [['`'], 'Toggle Terminal'],
    [['?'], 'Show this sheet'],
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmd-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onMouseDown={() => setOpen(false)}>
          <motion.div className="sheet-win" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 460, damping: 34 }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="mac-bar">
              <span className="mac-lights" aria-hidden="true"><i /><i /><i /></span>
              <span className="mac-title">Keyboard Shortcuts</span>
              <button type="button" className="sheet-x" onClick={() => setOpen(false)} aria-label="Close"><X size={15} /></button>
            </div>
            <ul className="sheet-list">
              {rows.map(([keys, label]) => (
                <li key={label + keys.join('')}><span>{label}</span><span className="sheet-keys">{keys.map((k) => <kbd key={k}>{k}</kbd>)}</span></li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── GitHub contribution graph (live from github.com/venstqs) ──────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (iso) => { const d = new Date(`${iso}T00:00:00`); return `${MONTHS[d.getMonth()]} ${d.getDate()}`; };

export function ContributionGraph() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    const ac = new AbortController();
    fetch('https://github-contributions-api.jogruber.de/v4/venstqs?y=last', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => (d?.contributions?.length ? setData(d) : setFailed(true)))
      .catch((e) => { if (e?.name !== 'AbortError') setFailed(true); });
    return () => ac.abort();
  }, []);
  const { weeks, months, total } = useMemo(() => {
    if (!data) return { weeks: [], months: [], total: 0 };
    const days = data.contributions;
    const first = new Date(`${days[0].date}T00:00:00`).getDay();
    const cells = [...Array(first).fill(null), ...days];
    const w = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));
    const m = [];
    w.forEach((wk, i) => { const d = wk.find(Boolean); if (!d) return; const mo = new Date(`${d.date}T00:00:00`).getMonth(); if (!m.length || m[m.length - 1].mo !== mo) m.push({ mo, i }); });
    return { weeks: w, months: m, total: data.total?.lastYear ?? days.reduce((a, d) => a + d.count, 0) };
  }, [data]);

  return (
    <div className="gh-widget">
      <div className="gh-head">
        <img src="/avatar-github.jpg" alt="" className="gh-avatar" width="36" height="36" />
        <div>
          <p className="gh-name">venstqs</p>
          <p className="gh-sub">{data ? `${total} contributions in the last year` : failed ? 'Activity is on GitHub' : 'Loading activity…'}</p>
        </div>
        <a className="gh-open" href="https://github.com/venstqs" target="_blank" rel="noopener noreferrer">Open profile <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
      {data && (
        <div className="gh-scroll">
          <div className="gh-graph" style={{ '--weeks': weeks.length }}>
            <div className="gh-months" aria-hidden="true">{months.map((m) => <span key={`${m.mo}-${m.i}`} style={{ gridColumn: m.i + 1 }}>{MONTHS[m.mo]}</span>)}</div>
            <div className="gh-grid" role="img" aria-label={`${total} GitHub contributions in the last year`} onMouseLeave={() => setHover(null)}>
              {weeks.map((wk, i) => (
                <div key={i} className="gh-week">
                  {Array.from({ length: 7 }, (_, j) => {
                    const d = wk[j];
                    return <span key={j} className={d ? `lv${d.level}` : 'gh-empty'} onMouseEnter={d ? () => setHover(d) : undefined} />;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="gh-foot">
        <span className="gh-tip" aria-live="polite">{hover ? `${hover.count} contribution${hover.count === 1 ? '' : 's'} on ${fmt(hover.date)}` : 'Hover a day for details'}</span>
        <span className="gh-legend" aria-hidden="true">Less {[0, 1, 2, 3, 4].map((l) => <i key={l} className={`lv${l}`} />)} More</span>
      </div>
    </div>
  );
}
