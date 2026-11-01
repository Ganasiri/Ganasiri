import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

type Props = {
  children: ReactNode
  /** Freezes scrolling, e.g. while the loader is on screen. */
  locked: boolean
}

/**
 * Smooth scrolling with Lenis, ticked by GSAP so Lenis and ScrollTrigger
 * update in the same frame. Lenis moves the real window scroll position,
 * so CSS sticky, anchors and ScrollTrigger pinning keep working.
 * It also honours prefers-reduced-motion by itself (no smoothing).
 */
export function SmoothScroll({ children, locked }: Props) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }}>
      <ScrollSync locked={locked} />
      {children}
    </ReactLenis>
  )
}

function ScrollSync({ locked }: { locked: boolean }) {
  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', locked)
    if (locked) lenis?.stop()
    else lenis?.start()
  }, [lenis, locked])

  return null
}
