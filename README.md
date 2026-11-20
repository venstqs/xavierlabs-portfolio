# Adrian Xavier Moral · XavierLabs

Personal portfolio website for **Adrian Xavier Moral** (`@venstqs`), live at [adrianfolio.vercel.app](https://adrianfolio.vercel.app).

Minimal black-and-white design with light/dark theme toggle (radial View Transitions reveal), keyboard shortcuts (`?`), a command palette (`Ctrl`/`⌘` + `K`), and live GitHub contribution stats.

## Stack

- **React 19** & **Vite 8**
- **[React Bits](https://reactbits.dev)** components in `src/components/rb/`:
  `Threads`, `SplitText`, `RotatingText`, `BlurText`, `ProfileCard`, `LogoLoop`, `GooeyNav`, `Dock`, `ClickSpark`, `ScrollReveal`, `CircularText`, `Counter`, `GlassIcons`, `Folder`, `SpotlightCard`, `ScrollVelocity`, `TextPressure`, `FlowingMenu`, `Magnet`, `AnimatedContent`
- **GSAP**, **Motion**, **lucide-react**, and **Geist** / **Geist Mono** via Google Fonts

## Project Structure

```text
public/
  avatar-github.jpg     ProfileCard & GitHub widget avatar
  logo.svg              AX monogram favicon & OpenGraph image
src/
  App.jsx               Navigation, theme toggle, dock, command menu & shortcuts
  data.js               Profile, socials, focus areas, rotating hero lines, tools & XavierLabs links
  index.css             Light/dark design tokens and layout styles
  main.jsx              React entry point
  components/
    Hero.jsx            Threads background, headline, rotating line, ProfileCard & tools loop
    Logo.jsx            AX monogram SVG and XavierLabs wordmark
    Sections.jsx        About, live GitHub stats, velocity band, Contact & Footer
    ui.jsx              Command palette, shortcuts modal, contribution graph, toast & scroll progress
    rb/                 React Bits components
index.html              Meta tags, fonts, and pre-paint theme script
```

## Development

```bash
npm install
npm run dev       # Start local dev server
npm run build     # Build production bundle to dist/
npm run preview   # Preview production build locally
```

## Customization

All editable copy—profile details, social links, rotating hero lines, tools, and XavierLabs links—lives in [`src/data.js`](src/data.js).

## Deployment

Configured for Vite static hosting (including Vercel via `vercel.json` and GitHub Pages via `base: './'` in `vite.config.js`).
