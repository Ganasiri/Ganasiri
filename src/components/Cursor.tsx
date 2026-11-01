import { useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { gsap, useGSAP } from '../lib/gsap'
import './Cursor.css'

const INTERACTIVE = 'a, button, [data-cursor]'

/**
 * A dot plus a trailing ring for mouse users. The ring grows over links
 * and shows a label over elements with `data-cursor="Label"`. Touch
 * devices and reduced-motion users keep the system cursor.
 */
export function Cursor() {
  const enabled = useMediaQuery(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  )
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const dot = dotRef.current
      const ring = ringRef.current
      const label = labelRef.current
      if (!enabled || !dot || !ring || !label) return

      const root = document.documentElement
      root.classList.add('has-custom-cursor')

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })

      let visible = false
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        if (!visible) {
          // Jump straight to the pointer the first time instead of flying in.
          gsap.set([dot, ring], { x: event.clientX, y: event.clientY })
          dot.classList.add('is-visible')
          ring.classList.add('is-visible')
          visible = true
        }
        dotX(event.clientX)
        dotY(event.clientY)
        ringX(event.clientX)
        ringY(event.clientY)
      }

      const onOver = (event: PointerEvent) => {
        const target = (event.target as Element | null)?.closest<HTMLElement>(INTERACTIVE)
        const text = target?.dataset.cursor ?? ''
        ring.classList.toggle('is-hover', Boolean(target) && !text)
        ring.classList.toggle('has-label', Boolean(text))
        label.textContent = text
      }

      const onLeave = () => {
        dot.classList.remove('is-visible')
        ring.classList.remove('is-visible')
        visible = false
      }

      const onDown = () => ring.classList.add('is-pressed')
      const onUp = () => ring.classList.remove('is-pressed')

      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerover', onOver, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
      window.addEventListener('pointerup', onUp, { passive: true })
      root.addEventListener('pointerleave', onLeave)

      return () => {
        root.classList.remove('has-custom-cursor')
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerover', onOver)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
        root.removeEventListener('pointerleave', onLeave)
      }
    },
    { dependencies: [enabled], revertOnUpdate: true },
  )

  if (!enabled) return null

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span className="cursor__ring-shape" />
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  )
}
