import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HERO_WORDS, LABS, PROFILE, SOCIALS, TAGLINE } from '../data';

/**
 * Terminal.app: a draggable macOS window with a small shell.
 * Opens with the ` key or from the Dock. Everything it prints comes from data.js.
 */
const PS1 = 'adrian@xavierlabs';
const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));
const LINKS = Object.fromEntries([...SOCIALS.map((s) => [s.label.toLowerCase(), s.href]), ...LABS.map((l) => [l.title.toLowerCase().replace(/\s+/g, '-'), l.href])]);

function run(raw, ctx) {
  const [cmd = '', ...args] = raw.trim().split(/\s+/);
  const arg = args.join(' ').toLowerCase();
  switch (cmd.toLowerCase()) {
    case '': return [];
    case 'help': return [
      'commands:',
      '  whoami          who runs this lab',
      '  builds          what I build',
      '  ls              list the lab',
      '  open <name>     open a link, e.g. open github',
      '  email           copy my email',
      '  theme           flip black / white',
      '  neofetch        system info, lab edition',
      '  clear           clear the screen',
      { t: 'tip: press ` to toggle this window, drag it by the title bar.', c: 'dim' },
    ];
    case 'whoami': return [`${PROFILE.name.toLowerCase()}, builder and researcher.`, `stem student at ${PROFILE.school.toLowerCase()}.`];
    case 'builds': return HERO_WORDS.map((w) => ({ t: `→ ${w}`, c: 'ok' }));
    case 'ls': return [{ t: Object.keys(LINKS).join('  '), c: 'accent' }];
    case 'open': {
      const href = LINKS[arg];
      if (!href) return [{ t: `open: ${arg || '(nothing)'}: not found. try: ls`, c: 'err' }];
      window.open(href, '_blank', 'noopener');
      return [{ t: `opening ${href.replace('https://', '')}`, c: 'ok' }];
    }
    case 'email': ctx.copyEmail(); return [{ t: `${PROFILE.email} (copied)`, c: 'ok' }];
    case 'theme': ctx.toggleTheme(); return [{ t: 'theme flipped.', c: 'ok' }];
    case 'neofetch': return [
      { t: '   ▲▲     adrian@xavierlabs', c: 'accent' },
      { t: '  ▲  ▲    ------------------', c: 'accent' },
      `           os       XavierLabs (React 19 + Vite)`,
      `           host     ${PROFILE.school}`,
      `           shell    zsh-ish`,
      `           focus    ${TAGLINE.toLowerCase()}`,
      `           uptime   since the first blinking LED`,
    ];
    case 'clear': ctx.clear(); return null;
    case 'sudo': return [{ t: 'nice try. this incident will be reported to the lab.', c: 'err' }];
    case 'exit': ctx.close(); return null;
    default: return [{ t: `zsh: command not found: ${cmd}`, c: 'err' }];
  }
}

export default function Terminal({ open, setOpen, toggleTheme, copyEmail }) {
  const [lines, setLines] = useState([{ t: 'Last login: just now on ttys000', c: 'dim' }, { t: 'type help to look around.', c: 'dim' }]);
  const [value, setValue] = useState('');
  const [pos, setPos] = useState(null);
  const hist = useRef([]);
  const hi = useRef(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const drag = useRef(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const cmd = value;
    setValue('');
    hi.current = -1;
    if (cmd.trim()) hist.current.unshift(cmd);
    const out = run(cmd, { clear: () => setLines([]), close: () => setOpen(false), toggleTheme, copyEmail });
    if (out !== null) setLines((l) => [...l, { cmd }, ...out.map((o) => (typeof o === 'string' ? { t: o } : o))]);
  };
  const onKey = (e) => {
    if (e.key === 'Escape' || e.key === '`') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowUp' && hist.current.length) { e.preventDefault(); hi.current = Math.min(hi.current + 1, hist.current.length - 1); setValue(hist.current[hi.current]); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi.current = Math.max(hi.current - 1, -1); setValue(hi.current === -1 ? '' : hist.current[hi.current]); }
  };

  // drag by the title bar
  const onDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    const box = e.currentTarget.parentElement.getBoundingClientRect();
    drag.current = { dx: e.clientX - box.left, dy: e.clientY - box.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current) return;
    setPos({ x: Math.max(8, Math.min(innerWidth - 120, e.clientX - drag.current.dx)), y: Math.max(8, Math.min(innerHeight - 60, e.clientY - drag.current.dy)) });
  };
  const onUp = () => { drag.current = null; };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="term-win"
          role="dialog"
          aria-label="Terminal"
          style={pos ? { left: pos.x, top: pos.y, translate: 'none' } : undefined}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          <div className="term-bar" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
            <span className="mac-lights">
              <button type="button" aria-label="Close terminal" onClick={() => setOpen(false)} />
              <i /><i />
            </span>
            <span className="mac-title">{PS1} — zsh</span>
          </div>
          <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
            {lines.map((l, i) => (l.cmd !== undefined
              ? <p key={i}><span className="t-ps1">{PS1}</span> <span className="t-dim">~ %</span> {l.cmd}</p>
              : <p key={i} className={`t-${l.c || 'out'}`}>{l.t}</p>))}
            <form onSubmit={submit} className="term-form">
              <label htmlFor="term-in"><span className="t-ps1">{PS1}</span> <span className="t-dim">~ %</span></label>
              <input id="term-in" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} autoComplete="off" autoCapitalize="off" spellCheck="false" aria-label="Terminal command. Type help for commands." />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
