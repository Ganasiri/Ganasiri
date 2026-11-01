import type { RefObject } from 'react'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'

/**
 * Splits matching headings into lines and slides each line up out of a
 * mask as the heading scrolls into view. Lines re-split on resize.
 */
export function useLineReveal(scope: RefObject<HTMLElement | null>, selector: string) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        root.querySelectorAll<HTMLElement>(selector).forEach((heading) => {
          SplitText.create(heading, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'reveal-line',
            autoSplit: true,
            onSplit: (split) =>
              gsap.from(split.lines, {
                yPercent: 110,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.09,
                scrollTrigger: {
                  trigger: heading,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              }),
          })
        })
      })
    },
    { scope },
  )
}
