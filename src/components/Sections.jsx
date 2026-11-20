import { useEffect, useState } from 'react';
import { Bot, Brain, Copy, Cpu, Eye, FlaskConical, Layers, Satellite } from 'lucide-react';
import ScrollReveal from './rb/ScrollReveal/ScrollReveal';
import CircularText from './rb/CircularText/CircularText';
import Counter from './rb/Counter/Counter';
import GlassIcons from './rb/GlassIcons/GlassIcons';
import Folder from './rb/Folder/Folder';
import SpotlightCard from './rb/SpotlightCard/SpotlightCard';
import ScrollVelocity from './rb/ScrollVelocity/ScrollVelocity';
import TextPressure from './rb/TextPressure/TextPressure';
import FlowingMenu from './rb/FlowingMenu/FlowingMenu';
import Magnet from './rb/Magnet/Magnet';
import AnimatedContent from './rb/AnimatedContent/AnimatedContent';
import ScrambledText from './rb/ScrambledText/ScrambledText';
import { FOCUS, LABS, PROFILE, SOCIALS, TAGLINE } from '../data';
import { LogoMark } from './Logo';
import { ContributionGraph, useCopyEmail } from './ui';

const Reveal = ({ children, delay = 0 }) => (
  <AnimatedContent distance={36} duration={0.9} delay={delay} ease="power3.out" threshold={0.15}>{children}</AnimatedContent>
);

/* Every section opens with the same header: kicker, title, optional line. */
function SecHead({ id, kicker, title, children }) {
  return (
    <Reveal>
      <div className="sec-head">
        <p className="kicker"><span className="kicker-mark" aria-hidden="true" />{kicker}</p>
        <h2 className="sec-title" id={id}>{title}</h2>
        {children && <p className="sec-sub">{children}</p>}
      </div>
    </Reveal>
  );
}

/* ── About ──────────────────────────────────────────────────────────────── */
const FOCUS_ICON = { 'Machine learning': Brain, 'Computer vision': Eye, 'AI agents': Bot, 'Remote sensing': Satellite, 'Embedded systems': Cpu, 'Scientific research': FlaskConical, 'Full-stack apps': Layers };
const FOCUS_SHORT = { 'Machine learning': 'ML', 'Computer vision': 'Vision', 'AI agents': 'Agents', 'Remote sensing': 'Sensing', 'Embedded systems': 'Embedded', 'Scientific research': 'Research', 'Full-stack apps': 'Full-stack' };
const FOCUS_ICONS = FOCUS.map((f) => { const I = FOCUS_ICON[f] || Layers; return { label: FOCUS_SHORT[f] || f, icon: <I size={26} strokeWidth={1.6} />, color: 'graphite' }; });
function useGithubStats() {
  const [stats, setStats] = useState({ contributions: 292, repos: 19 });
  useEffect(() => {
    const ac = new AbortController();
    fetch('https://github-contributions-api.jogruber.de/v4/venstqs?y=last', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => d?.total?.lastYear && setStats((s) => ({ ...s, contributions: d.total.lastYear }))).catch(() => {});
    fetch('https://api.github.com/users/venstqs', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => d?.public_repos && setStats((s) => ({ ...s, repos: d.public_repos }))).catch(() => {});
    return () => ac.abort();
  }, []);
  return stats;
}

export function About({ theme }) {
  const stats = useGithubStats();
  return (
    <section className="section wrap" id="about" aria-labelledby="about-t">
      <SecHead id="about-t" kicker="About" title="Curious about how things work, and how to make them smarter.">{TAGLINE}</SecHead>
      <div className="about-grid">
        <div className="about-side">
        <div className="about-badge" aria-hidden="true">
          <CircularText text="ADRIAN XAVIER MORAL • SCIENCE • TECHNOLOGY • " size={220} fontSize={15} fontWeight={600} letterSpacing={2} spinDuration={22} onHover="speedUp">
            <span className="about-badge-mark"><LogoMark size={56} /></span>
          </CircularText>
        </div>
        <div className="about-folder">
          <Folder
            items={LABS.map((l) => ({ title: l.title, description: l.description }))}
            label="XavierLabs"
            color={theme === 'dark' ? '#d4d4d4' : '#262626'}
            paperColor={theme === 'dark' ? '#1a1a1a' : '#ffffff'}
            theme={theme}
            size={0.9}
            onItemClick={(_, i) => window.open(LABS[i].href, '_blank', 'noopener')}
          />
          <p className="about-folder-note">Open the folder: my own tools.</p>
        </div>
        </div>
        <div>
          <ScrollReveal baseOpacity={0.12} enableBlur blurStrength={6} baseRotation={2} textClassName="about-reveal">
            I build for the edge of the stack: quantized models that run with no signal, sensor nodes wired to survive outside, and local AI agents that do the heavy lifting. If an idea only lives in a notebook, it isn’t finished yet.
          </ScrollReveal>
          <Reveal>
            <ScrambledText className="body body-scramble" radius={90} duration={1} speed={0.5} scrambleChars=".:/01" intro={false} clickBurst={false}>
              Most of my work sits in the tight spots between hardware, on-device ML, and developer tooling, from ESP32 and LoRaWAN boards to browser-based electronics labs and terminal research pipelines. Everything I ship for myself lives under XavierLabs.
            </ScrambledText>
            <div className="glass-wrap">
              <GlassIcons items={FOCUS_ICONS} size={60} gap={44} columns={4} labels="always" theme={theme} color="graphite" tint={theme === 'dark' ? '#3a3a3a' : '#dcdcdc'} />
            </div>
            <ul className="sr-only">{FOCUS.map((f) => <li key={f}>{f}</li>)}</ul>
          </Reveal>
        </div>
      </div>

      <div className="stats">
        {[
          { n: stats.contributions, l: 'GitHub contributions in the last year' },
          { n: stats.repos, l: 'public repositories' },
        ].map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08}>
            <SpotlightCard theme={theme} className="stat" intensity={0.12} spotlightSize={220}>
              <p className="stat-n"><Counter value={s.n} fontSize={52} fontWeight={600} /></p>
              <p className="stat-l">{s.l}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      <Reveal><ContributionGraph /></Reveal>
    </section>
  );
}

/* ── Velocity band ──────────────────────────────────────────────────────── */
export function Band() {
  return (
    <div className="band" aria-hidden="true">
      <ScrollVelocity texts={['Science and technology ✕ ', 'Machine learning · research · engineering ✕ ']} velocity={60} numCopies={6} fadeEdges outlineAlternate className="band-text" />
    </div>
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */
export function Contact({ theme }) {
  const copyEmail = useCopyEmail();
  const dark = theme === 'dark';
  // the card is the inverse of the page, so its menu colours flip too
  const fg = dark ? '#0a0a0a' : '#ffffff';
  const bg = dark ? '#f5f5f5' : '#0a0a0a';
  return (
    <section className="section wrap" id="contact" aria-labelledby="contact-t">
      <SecHead id="contact-t" kicker="Contact" title="Let’s build something.">
        Competition team, research idea, or just a question? Email reaches me fastest.
      </SecHead>
      <Reveal>
        <div className="cta">
          <div className="cta-pressure" aria-hidden="true">
            <TextPressure text="SAY HELLO" textColor="currentColor" minFontSize={48} weight width italic={false} />
          </div>
          <div className="cta-row">
            <Magnet padding={50} magnetStrength={6}>
              <a className="cta-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </Magnet>
            <button type="button" className="btn btn-cta" onClick={copyEmail}><Copy size={15} aria-hidden="true" /> Copy</button>
          </div>
          <div className="cta-menu">
            <FlowingMenu
              items={SOCIALS.map((s) => ({ link: s.href, text: s.label, marquee: s.handle }))}
              textColor={fg}
              bgColor={bg}
              marqueeBgColor={fg}
              marqueeTextColor={bg}
              borderColor={dark ? 'rgba(10,10,10,.14)' : 'rgba(255,255,255,.14)'}
              align="left"
              showArrow
              ariaLabel="Social links"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer wrap">
      <span className="footer-brand"><LogoMark size={20} /> XavierLabs</span>
      <span className="footer-motto">{PROFILE.motto}</span>
      <span className="footer-keys">Press <kbd>?</kbd> for keyboard shortcuts</span>
      <a className="footer-build" href={__BUILD__.commit ? `https://github.com/venstqs/xavierlabs-portfolio/commit/${__BUILD__.commit}` : 'https://github.com/venstqs/xavierlabs-portfolio'} target="_blank" rel="noopener noreferrer" title="The exact commit this site was built from">
        build {__BUILD__.commit || 'local'} · {__BUILD__.date}
      </a>
      <span className="footer-year">© {new Date().getFullYear()}</span>
    </footer>
  );
}
