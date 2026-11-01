import { ScrollTrigger, useGSAP } from '../lib/gsap'

/**
 * Each `main section[data-theme]` sets the page theme while it covers the
 * middle of the viewport. The theme stays put between sections, so pinned
 * sections and gaps never flash back to a default.
 */
export function useScrollThemes() {
  useGSAP(() => {
    const root = document.documentElement
    document.querySelectorAll<HTMLElement>('main section[data-theme]').forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        // Measure after pinned sections have added their scroll distance.
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive && section.dataset.theme) root.dataset.theme = section.dataset.theme
        },
      })
    })
  })
}
