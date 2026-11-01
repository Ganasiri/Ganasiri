import { useRef } from 'react'
import { Emphasis, SectionLabel } from '../components/text'
import { about } from '../content'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'
import './About.css'

export function About() {
  const rootRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const statement = statementRef.current
      if (!statement) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Words light up one after another as the statement scrolls through.
        const split = SplitText.create(statement, { type: 'words', wordsClass: 'about__word', aria: 'none' })
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: '.about__statement', start: 'top 80%', end: 'bottom 50%', scrub: true },
          },
        )

        gsap.from('.about__body p', {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.about__grid', start: 'top 82%', once: true },
        })

        // Each stat fades in and counts up from zero. Opacity only, so the
        // trigger isn't measured from a shifted position.
        gsap.utils.toArray<HTMLElement>('.about__stat').forEach((stat) => {
          const value = stat.querySelector('.about__stat-value')
          const tl = gsap.timeline({ scrollTrigger: { trigger: stat, start: 'top 90%', once: true } })
          tl.from(stat, { opacity: 0, duration: 0.8, ease: 'power2.out' })
          if (value) {
            tl.from(value, { textContent: 0, duration: 1.6, ease: 'power2.out', snap: { textContent: 1 } }, 0)
          }
        })
      })
    },
    { scope: rootRef },
  )

  return (
    <section
      id="about"
      ref={rootRef}
      className="about section"
      data-theme="dark"
      tabIndex={-1}
      aria-labelledby="about-title"
    >
      <div className="container">
        <SectionLabel index="01" as="h2" id="about-title">
          About me
        </SectionLabel>

        <p className="about__statement">
          <span className="visually-hidden">{about.statement.replaceAll('*', '')}</span>
          <span ref={statementRef} aria-hidden="true">
            <Emphasis text={about.statement} />
          </span>
        </p>

        <div className="about__grid">
          <div className="about__body">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="about__stats">
            {about.stats.map((stat) => (
              <div key={stat.label} className="about__stat">
                <dt className="about__stat-label">{stat.label}</dt>
                <dd className="about__stat-number">
                  <span aria-hidden="true">
                    <span className="about__stat-value">{stat.value}</span>
                    {stat.suffix}
                  </span>
                  <span className="visually-hidden">
                    {stat.value}
                    {stat.suffix}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
