import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

type Props = {
  href: string
  className?: string
  children: ReactNode
  'data-cursor'?: string
}

/** A link that leans towards the mouse pointer and springs back on leave. */
export function MagneticLink({ href, className, children, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const inner = el.querySelector('.magnetic__inner')
        const spring = { duration: 0.9, ease: 'elastic.out(1, 0.35)' }
        const x = gsap.quickTo(el, 'x', spring)
        const y = gsap.quickTo(el, 'y', spring)
        const innerX = inner ? gsap.quickTo(inner, 'x', spring) : null
        const innerY = inner ? gsap.quickTo(inner, 'y', spring) : null
        let bounds = el.getBoundingClientRect()

        const onEnter = () => {
          bounds = el.getBoundingClientRect()
        }
        const onMove = (event: PointerEvent) => {
          const dx = event.clientX - (bounds.left + bounds.width / 2)
          const dy = event.clientY - (bounds.top + bounds.height / 2)
          x(dx * 0.3)
          y(dy * 0.3)
          innerX?.(dx * 0.15)
          innerY?.(dy * 0.15)
        }
        const onLeave = () => {
          x(0)
          y(0)
          innerX?.(0)
          innerY?.(0)
        }

        el.addEventListener('pointerenter', onEnter)
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        return () => {
          el.removeEventListener('pointerenter', onEnter)
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', onLeave)
        }
      })
    },
    { scope: ref },
  )

  return (
    <a ref={ref} href={href} className={`magnetic ${className ?? ''}`.trim()} {...rest}>
      <span className="magnetic__inner">{children}</span>
    </a>
  )
}
