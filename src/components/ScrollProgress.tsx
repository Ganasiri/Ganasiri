import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/** Thin bar along the top edge that fills as you scroll the whole page. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true,
        // Measure last, once pinned sections have added their length.
        refreshPriority: -2,
      },
    })
  })

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress__bar" />
    </div>
  )
}
