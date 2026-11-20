import Threads from './rb/Threads/Threads';
import SplitText from './rb/SplitText/SplitText';
import RotatingText from './rb/RotatingText/RotatingText';
import BlurText from './rb/BlurText/BlurText';
import ProfileCard from './rb/ProfileCard/ProfileCard';
import LogoLoop from './rb/LogoLoop/LogoLoop';
import { HERO_WORDS, PROFILE, TOOLS } from '../data';

const TOOL_LOGOS = TOOLS.map((t) => ({ node: <span className="tool-pill">{t}</span>, title: t }));

export default function Hero({ theme }) {
  const dark = theme === 'dark';
  return (
    <header className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <Threads
          key={theme}
          color={dark ? [1, 1, 1] : [0.05, 0.05, 0.06]}
          amplitude={1.4}
          distance={0.3}
          lineCount={70}
          thickness={0.5}
          opacity={dark ? 0.5 : 0.35}
          enableMouseInteraction
        />
      </div>

      <div className="wrap hero-grid">
        <div className="hero-copy">

          <SplitText
            text="I love computers, all the way down to the silicon."
            tag="h1"
            className="hero-title"
            textAlign="left"
            splitType="words"
            delay={70}
            duration={1.1}
            effect="rise"
            trigger="load"
            rootMargin="0px"
          />

          <div className="hero-sub">
            <span>I build</span>
            <RotatingText
              texts={HERO_WORDS}
              mainClassName="rot"
              splitLevelClassName="rot-split"
              highlight
              highlightColor={dark ? '#f5f5f5' : '#0a0a0a'}
              staggerDuration={0.02}
              staggerFrom="last"
              rotationInterval={2200}
              effect="slide"
            />
          </div>

          <BlurText
            className="hero-intro"
            text={`STEM student at ${PROFILE.school}. I build prototypes, run research and keep exploring new tech, from sensors and apps to AI models and satellite data.`}
            animateBy="words"
            direction="bottom"
            delay={25}
            trigger="load"
          />
        </div>

        <div className="hero-card">
          <ProfileCard
            key={theme}
            avatarUrl="/avatar-github.jpg"
            name="Adrian Xavier Moral"
            title="Science and technology"
            handle="venstqs"
            status=""
            contactText="Contact"
            theme={theme}
            holo={0}
            glare={0.3}
            onContactClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>
      </div>

      <div className="hero-tools">
        <LogoLoop logos={TOOL_LOGOS} speed={55} gap={14} logoHeight={34} pauseOnHover fadeOut ariaLabel="Tools I use" />
      </div>
    </header>
  );
}
