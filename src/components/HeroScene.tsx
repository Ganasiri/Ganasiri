import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { gsap, ScrollTrigger } from '../lib/gsap'

type Props = {
  /** Called after the first frame renders, or straight away without WebGL. */
  onReady: () => void
  /** Scrolling through this element turns the sphere into a surface plot. */
  morphTrigger: string
  /** The scene fades out as this element scrolls away. */
  fadeTrigger: string
  reducedMotion: boolean
}

const SPHERE_RADIUS = 1.55
const PLOT_WIDTH = 9
const PLOT_DEPTH = 5

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aTarget;
  attribute float aSeed;
  varying float vSeed;
  varying float vMorph;
  varying float vHeat;

  // Height of the surface plot the particles settle into.
  float surface(vec2 p, float t) {
    return 0.42 * sin(p.x * 0.85 + t * 0.5) * cos(p.y * 1.2 - t * 0.35)
         + 0.16 * sin((p.x + p.y) * 1.7 - t * 0.6);
  }

  void main() {
    float t = uTime;

    // Slowly spinning sphere that breathes with interfering waves.
    float a = t * 0.12;
    vec3 p = position;
    p.xz = mat2(cos(a), sin(a), -sin(a), cos(a)) * p.xz;
    float wave = sin(p.x * 3.1 + t * 0.9) * sin(p.y * 2.7 + t * 0.7) * sin(p.z * 3.3 + t * 0.8);
    vec3 sphere = p * (1.0 + wave * 0.14);

    float h = surface(aTarget.xz, t);
    vec3 plot = vec3(aTarget.x, h, aTarget.z);

    // Each particle leaves at a slightly different moment and arcs on the way.
    float delay = aSeed * 0.4;
    float m = smoothstep(delay, delay + 0.6, uMorph);
    vec3 pos = mix(sphere, plot, m);
    pos.y += sin(m * 3.14159) * (0.5 + aSeed * 0.9);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed * 0.8) / -mvPosition.z;

    vSeed = aSeed;
    vMorph = m;
    vHeat = smoothstep(-0.5, 0.5, h);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uLight;
  varying float vSeed;
  varying float vMorph;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d) * (0.55 + vSeed * 0.45);

    vec3 sphereColor = mix(uAccent, uLight, step(0.72, vSeed));
    // Low ground is dim, peaks glow in the accent colour, like a heatmap.
    vec3 plotColor = mix(uLight * 0.45, uAccent, vHeat);
    gl_FragColor = vec4(mix(sphereColor, plotColor, vMorph), alpha);
    #include <colorspace_fragment>
  }
`

function createGeometry(count: number) {
  const positions = new Float32Array(count * 3)
  const targets = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const golden = Math.PI * (3 - Math.sqrt(5))
  const cols = Math.round(Math.sqrt(count * (PLOT_WIDTH / PLOT_DEPTH)))
  const rows = Math.ceil(count / cols)
  const jitter = () => (Math.random() - 0.5) * 0.35

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere: even coverage without clumps at the poles.
    const y = 1 - (i / (count - 1)) * 2
    const ring = Math.sqrt(1 - y * y)
    const theta = golden * i
    positions[i * 3] = Math.cos(theta) * ring * SPHERE_RADIUS
    positions[i * 3 + 1] = y * SPHERE_RADIUS
    positions[i * 3 + 2] = Math.sin(theta) * ring * SPHERE_RADIUS

    // Slightly jittered grid, so the plot reads as data rather than a mesh.
    const col = i % cols
    const row = Math.floor(i / cols)
    targets[i * 3] = ((col + jitter()) / (cols - 1) - 0.5) * PLOT_WIDTH
    targets[i * 3 + 2] = ((row + jitter()) / Math.max(rows - 1, 1) - 0.5) * PLOT_DEPTH

    seeds[i] = Math.random()
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aTarget', new BufferAttribute(targets, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  return geometry
}

/**
 * A sphere of data points that settles into a 3D surface plot as the hero
 * scrolls away, then fades out with the About section. Pauses rendering
 * once it's out of view.
 */
export default function HeroScene({ onReady, morphTrigger, fadeTrigger, reducedMotion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    } catch {
      onReady() // No WebGL: the page works fine without the scene.
      return
    }

    const small = window.matchMedia('(max-width: 767px)').matches
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(35, 1, 0.1, 100)
    const group = new Group()
    scene.add(group)

    const geometry = createGeometry(small ? 6000 : 12000)
    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: small ? 24 : 27 },
      uPixelRatio: { value: pixelRatio },
      uAccent: { value: new Color('#ff5b24') },
      uLight: { value: new Color('#efebe3') },
    }
    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    group.add(new Points(geometry, material))

    const pointer = { x: 0, y: 0 }
    const tilt = { x: 0, y: 0 }

    const render = () => {
      const morph = uniforms.uMorph.value
      // Sit between the role and the intro on wide screens, centre as it morphs.
      group.position.x = camera.aspect > 1.1 ? (1 - morph) * 0.3 : 0
      group.position.y = (1 - morph) * 0.15 - morph * 0.35
      group.rotation.x = 0.12 + morph * 0.5 + tilt.x
      group.rotation.y = tilt.y
      renderer.render(scene, camera)
    }

    const resize = () => {
      const width = container.clientWidth || window.innerWidth
      const height = container.clientHeight || window.innerHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      // Pull back on narrow screens so the sphere stays inside the width.
      const halfFov = (camera.fov * Math.PI) / 360
      const fit = (SPHERE_RADIUS * 2.9) / (2 * Math.tan(halfFov) * camera.aspect)
      camera.position.z = Math.max(9, fit)
      camera.updateProjectionMatrix()
      render()
    }

    let visibility: ScrollTrigger | undefined
    const ctx = gsap.context(() => {
      const heroRange = { trigger: morphTrigger, start: 'top top', end: 'bottom top', scrub: true }
      if (!reducedMotion) {
        gsap.to(uniforms.uMorph, { value: 1, ease: 'none', scrollTrigger: heroRange })
      }
      // Without the morph there's nothing to show behind About, so fade out fully.
      gsap.to(container, { opacity: reducedMotion ? 0 : 0.4, ease: 'none', scrollTrigger: heroRange })
      gsap.to(renderer.domElement, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: fadeTrigger, start: 'center 60%', end: 'bottom 40%', scrub: true },
      })
      visibility = ScrollTrigger.create({
        trigger: morphTrigger,
        start: 'top bottom',
        endTrigger: fadeTrigger,
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive && reducedMotion) render()
        },
      })
    })

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
    }

    const tick = (_time: number, deltaTime: number) => {
      if (!visibility?.isActive) return
      uniforms.uTime.value += Math.min(deltaTime, 50) / 1000
      tilt.x += (pointer.y * 0.12 - tilt.x) * 0.05
      tilt.y += (pointer.x * 0.2 - tilt.y) * 0.05
      render()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    onReady()

    if (!reducedMotion) {
      gsap.ticker.add(tick)
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onPointerMove)
      observer.disconnect()
      ctx.revert()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [onReady, morphTrigger, fadeTrigger, reducedMotion])

  return <div ref={containerRef} className="hero-scene" aria-hidden="true" />
}
