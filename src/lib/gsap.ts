import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

// Mobile browsers resize the viewport as the address bar shows and hides.
// Ignoring those resizes stops pinned sections from jumping mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true })

/** Conditions for gsap.matchMedia(), shared by every animated section. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export { gsap, ScrollTrigger, SplitText, useGSAP }
