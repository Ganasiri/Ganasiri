import { useRef } from 'react'
import { profile } from '../content'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { gsap, useGSAP } from '../lib/gsap'
import './Loader.css'

type Props = {
  /** True once fonts, images and the 3D scene are ready. */
  ready: boolean
  /** Fires as the curtain starts to lift, so the hero intro can overlap it. */
  onReveal: () => void
  /** Fires once the loader is fully off screen. */
  onDone: () => void
}

export function Loader({ ready, onReveal, onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const progress = useRef({ value: 0 })
  const reducedMotion = useReducedMotion()

  const render = () => {
    const { value } = progress.current
    if (countRef.current) countRef.current.textContent = String(Math.round(value)).padStart(3, '0')
    if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`
  }

  // Creep towards 85% while assets load.
  useGSAP(
    () => {
      gsap.to(progress.current, {
        value: 85,
        duration: reducedMotion ? 0.3 : 2.6,
        ease: 'power2.out',
        onUpdate: render,
      })
    },
    { scope: rootRef },
  )

  // Finish the count, then lift the curtain.
  useGSAP(
    () => {
      if (!ready) return
      const tl = gsap.timeline({ onComplete: onDone })
      tl.to(progress.current, {
        value: 100,
        duration: reducedMotion ? 0.2 : 0.55,
        ease: 'power2.inOut',
        overwrite: true,
        onUpdate: render,
      })

      if (reducedMotion) {
        tl.add(onReveal).to(rootRef.current, { autoAlpha: 0, duration: 0.3 })
        return
      }

      tl.to('.loader__reveal', { yPercent: -110, duration: 0.5, ease: 'power3.in', stagger: 0.04 }, '+=0.05')
        .add(onReveal, '-=0.15')
        .fromTo(
          rootRef.current,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.95, ease: 'expo.inOut' },
          '<',
        )
    },
    { scope: rootRef, dependencies: [ready] },
  )

  return (
    <div ref={rootRef} className="loader">
      <p className="visually-hidden" role="status">
        Loading
      </p>
      <div className="loader__row mono" aria-hidden="true">
        <span className="loader__mask">
          <span className="loader__reveal">{profile.name}</span>
        </span>
        <span className="loader__mask">
          <span className="loader__reveal">{profile.role}</span>
        </span>
      </div>
      <div className="loader__bottom" aria-hidden="true">
        <span className="loader__mask">
          <span ref={countRef} className="loader__count loader__reveal">
            000
          </span>
        </span>
        <span className="loader__bar">
          <span ref={barRef} className="loader__bar-fill" />
        </span>
      </div>
    </div>
  )
}
