import { useEffect, useState } from 'react';
import { Cpu, Brain, Layers, Satellite, Clock, SquareTerminal } from 'lucide-react';
import MagicBento from './rb/MagicBento/MagicBento';
import DotGrid from './rb/DotGrid/DotGrid';
import TrueFocus from './rb/TrueFocus/TrueFocus';
import CurvedLoop from './rb/CurvedLoop/CurvedLoop';
import AnimatedContent from './rb/AnimatedContent/AnimatedContent';
import { PROFILE } from '../data';

const Reveal = ({ children, delay = 0 }) => (
  <AnimatedContent distance={36} duration={0.9} delay={delay} ease="power3.out" threshold={0.15}>{children}</AnimatedContent>
);

/* Live time where I am. */
function useManilaTime() {
  const fmt = () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila' }).format(new Date());
  const [now, setNow] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setNow(fmt()), 15000); return () => clearInterval(id); }, []);
  return now;
}

/* Small line drawings for the cards, in the brand's black and white. */
const Trace = () => (
  <svg className="lab-art" viewBox="0 0 240 90" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="92" y="22" width="56" height="46" rx="6" />
    <path d="M100 22v-10M112 22v-10M124 22v-10M136 22v-10M100 68v10M112 68v10M124 68v10M136 68v10" />
    <path d="M92 36H40l-14 14H6M92 54H58l-10-10H6M148 36h46l12-12h28M148 54h30l16 16h40" />
    <circle cx="6" cy="50" r="3" fill="currentColor" /><circle cx="234" cy="24" r="3" fill="currentColor" /><circle cx="234" cy="70" r="3" fill="currentColor" />
  </svg>
);
const Stack = () => (
  <svg className="lab-art" viewBox="0 0 240 90" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="30" y="10" width="120" height="70" rx="8" /><path d="M30 26h120" /><circle cx="42" cy="18" r="2.5" fill="currentColor" /><circle cx="52" cy="18" r="2.5" fill="currentColor" />
    <rect x="166" y="18" width="44" height="66" rx="8" /><path d="M182 76h12" />
    <path d="M44 42h50M44 54h70M44 66h36" opacity=".6" />
  </svg>
);
const Neural = () => (
  <svg className="lab-art" viewBox="0 0 240 90" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    {[20, 45, 70].map((a) => [30, 55].map((b) => <path key={`a${a}${b}`} d={`M60 ${a}L120 ${b}`} opacity=".45" />))}
    {[30, 55].map((a) => [45].map((b) => <path key={`b${a}${b}`} d={`M120 ${a}L180 ${b}`} opacity=".45" />))}
    {[20, 45, 70].map((y) => <circle key={y} cx="60" cy={y} r="6" fill="var(--bg, #000)" strokeWidth="1.5" />)}
    {[30, 55].map((y) => <circle key={y} cx="120" cy={y} r="6" fill="var(--bg, #000)" strokeWidth="1.5" />)}
    <circle cx="180" cy="45" r="7" fill="currentColor" />
  </svg>
);

export function Lab({ theme, openTerminal }) {
  const dark = theme === 'dark';
  const time = useManilaTime();
  const ink = dark ? '#f5f5f5' : '#0a0a0a';

  const items = [
    { id: 'hw', label: 'Build', icon: <Cpu size={16} />, title: 'Boards, sensors and radios', description: 'ESP32, Arduino and LoRaWAN, plus power budgets and printable enclosures.', visual: <Trace />, colSpan: 2 },
    {
      id: 'eo', label: 'Research', icon: <Satellite size={16} />, colSpan: 2, rowSpan: 2,
      title: 'Satellite data, from radar to rainfall', description: 'Sentinel-1 radar, Sentinel-2, NASADEM and GPM, turned into maps someone can act on. Click the grid.',
      visual: (
        <div className="lab-grid">
          <DotGrid dotSize={4} gap={16} baseColor={dark ? '#2a2a2e' : '#d4d4d8'} activeColor={ink} proximity={110} shockRadius={220} shockStrength={4} glow={0.2} fade={0.35} />
        </div>
      ),
    },
    { id: 'sw', label: 'Software', icon: <Layers size={16} />, title: 'Apps and the backend', description: 'React, React Native, FastAPI.', visual: <Stack /> },
    { id: 'ai', label: 'Edge AI', icon: <Brain size={16} />, title: 'Models on the device', description: 'TensorFlow Lite, offline first.', visual: <Neural /> },
    {
      id: 'time', colSpan: 2,
      content: (
        <div className="lab-time">
          <span className="lab-k"><Clock size={14} aria-hidden="true" /> Local time</span>
          <span className="lab-clock">{time}</span>
          <span className="lab-sub">{PROFILE.city || 'Philippines'} · UTC+8</span>
        </div>
      ),
    },
    {
      id: 'term', colSpan: 2, onClick: openTerminal,
      title: 'Open the terminal', label: 'Easter egg', icon: <SquareTerminal size={16} />,
      content: (
        <div className="lab-term">
          <span className="lab-k"><SquareTerminal size={14} aria-hidden="true" /> Easter egg</span>
          <code className="lab-code"><span className="lab-dim">adrian@xavierlabs ~ %</span> whoami<span className="lab-caret" /></code>
          <span className="lab-sub">Click here or press <kbd>`</kbd> anywhere.</span>
        </div>
      ),
    },
  ];

  return (
    <section className="section wrap" id="lab" aria-labelledby="lab-t">
      <Reveal>
        <div className="sec-head">
          <p className="kicker"><span className="kicker-mark" aria-hidden="true" />Lab</p>
          <h2 className="sec-title" id="lab-t">What the lab runs on.</h2>
          <div className="lab-focus">
            <TrueFocus sentence="Build Research Explore" borderColor={ink} glowColor="transparent" blurAmount={4} animationDuration={0.6} pauseBetweenAnimations={1.2} cornerSize={14} borderWidth={2} />
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <MagicBento
          items={items}
          theme={dark ? 'dark' : 'light'}
          glowColor={ink}
          columns={4}
          rowHeight={210}
          gap={14}
          radius={18}
          textAutoHide={false}
          enableStars={false}
          enableTilt={false}
          enableMagnetism={false}
          spotlightRadius={260}
          className="lab-bento"
        />
      </Reveal>
    </section>
  );
}

/* The motto on a curve, between the lab and contact. */
export function Motto() {
  return (
    <div className="motto" aria-label="Born to inherit the stars.">
      <CurvedLoop marqueeText="Born to inherit the stars" separator="  ✕  " speed={1.2} curveAmount={220} fontSize={72} fontWeight={600} letterSpacing={-1} edgeFade={0.12} interactive />
    </div>
  );
}
