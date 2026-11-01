# Ganasiri

Personal portfolio of Ganasiri M M: a scroll-led single page where scrolling drives the story, mostly vertically, with one pinned section that moves sideways.

## Branches

- `main` — base branch.
- `code-ganasiri` — working branch. All changes are made here and merged into `main` via pull request.

## Run it

Requires Node 20.19+ (or 22.12+).

```sh
npm install
npm run dev       # local dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

## Edit the content

All text lives in [`src/content.ts`](src/content.ts), so you never need to touch a component to update the site.

| Export | Where it shows |
| --- | --- |
| `profile` | Name, role, rotating focus areas, intro line, email, location, links |
| `about` | Big statement, bio paragraphs and the four counters |
| `services` | Stacking cards under "What I do" |
| `projects` | Cards in the sideways-scrolling Work section |
| `experience` | Timeline, oldest first; `marker` is the big rolling year |
| `marquee`, `skills`, `certifications` | Toolbox section |
| `contact` | Closing call to action |

- Wrap words in `*asterisks*` to set them in the italic serif accent.
- Keep `profile.displayName` to one word: it's sized to fill the hero's width.
- Project images go in `public/work/`. The current ones are placeholder illustrations, so swap in real screenshots when you have them (16:10 works best).
- To add LinkedIn or other profiles, add entries to `profile.links`.
- The page title and description for search engines are in `index.html`.

## How the scrolling works

| Section | Effect |
| --- | --- |
| Hero | Letters rise in after the loader and stand on a 3D landscape of data points (Three.js). Scrolling lifts the letters apart and raises the camera until the landscape reads as a flat heatmap |
| About | Words light up one by one as you scroll; the counters count up |
| What I do | Cards stick and stack on top of each other |
| Work | The section pins and vertical scroll moves the cards sideways, with image parallax and a progress counter |
| Experience | The timeline fills as you scroll and the big year rolls to each milestone |
| Toolbox | Rows of tool names slide in opposite directions |
| Contact | Headline lines slide up; the button leans towards the cursor |

The page colours fade between dark, light and orange as each section reaches the middle of the screen (`data-theme` on each section, colours in `src/index.css`).

Smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis), and the animations use [GSAP](https://gsap.com) ScrollTrigger and SplitText. If a visitor's system asks for reduced motion, the scroll animations are switched off, the Work row becomes a normal sideways scroller and the 3D scene stays still.

## Project structure

```
src/
  content.ts        all site copy
  App.tsx           page order, loader and scroll lock
  index.css         colours, fonts, shared styles
  lib/gsap.ts       GSAP plugin setup
  hooks/            media queries, text fitting, line reveals, section themes
  components/       loader, navbar, cursor, smooth scroll, 3D scene, small UI parts
  sections/         one component + stylesheet per section
public/
  work/             project cover images
```

## Deploying

`npm run build` writes a static site to `dist/`, which any static host can serve (Vercel, Netlify, GitHub Pages). If the site will live under a sub-path rather than at the domain root, set `base` in `vite.config.ts` to that path first, e.g. `base: '/portfolio/'`.

## Credits

The idea of a scroll-led, vertical-plus-horizontal portfolio was inspired by [Moncy Yohannan's portfolio](https://github.com/MoncyDev/Portfolio-Website). Its license allows inspiration but not copying its design, code or assets, so everything here is original: code, layout, 3D scene and artwork.
