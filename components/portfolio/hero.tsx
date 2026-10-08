"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { gsap, ScrollTrigger, useGSAP, READY_EVENT, prefersReducedMotion } from "@/lib/gsap"
import { profile, skillsRowA, skillsRowB } from "@/lib/content"
import { createFrameSequence, FRAME_COUNT, FRAME_HEIGHT, FRAME_WIDTH } from "@/lib/frame-sequence"
import { RoleSwitcher } from "./role-switcher"

const ORBIT = [...skillsRowA.slice(0, 6), ...skillsRowB.slice(0, 4)]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const rigRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sequenceRef = useRef<ReturnType<typeof createFrameSequence> | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sequence = createFrameSequence(canvas)
    sequenceRef.current = sequence
    sequence.render(0)
    return () => {
      sequence.dispose()
      sequenceRef.current = null
    }
  }, [])

  useGSAP(
    (_, contextSafe) => {
      const reduced = prefersReducedMotion()
      const q = gsap.utils.selector(sectionRef)

      const intro = contextSafe!(() => {
        if (reduced) return
        gsap
          .timeline()
          .from(q("[data-intro-card]"), { y: 80, opacity: 0, scale: 0.92, duration: 1.6, ease: "expo.out" })
          .from(q("[data-intro-headline]"), { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out" }, 0.1)
          .from(q("[data-hero-ring]"), { opacity: 0, duration: 1.2 }, 0.4)
          .from(q("[data-hero-fade]"), { y: 24, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" }, 0.4)
      })

      if ((window as unknown as { __portfolioReady?: boolean }).__portfolioReady) intro()
      else window.addEventListener(READY_EVENT, intro, { once: true })
      const removeIntroListener = () => window.removeEventListener(READY_EVENT, intro)

      if (reduced) return removeIntroListener

      const playhead = { frame: 0 }
      const mm = gsap.matchMedia()
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const isDesktop = ctx.conditions?.desktop
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: isDesktop ? "+=260%" : "+=180%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        })
        tl.to(
          playhead,
          {
            frame: FRAME_COUNT - 1,
            duration: 0.85,
            onUpdate: () => sequenceRef.current?.render(playhead.frame),
          },
          0,
        )
          .to(q("[data-hero-ring-inner]"), { rotateY: -540, duration: 1 }, 0)
          .to(q("[data-hero-headline]"), { scale: 1.25, duration: 1 }, 0)
          .to(q("[data-hero-progress]"), { scaleX: 1, duration: 0.85 }, 0)
          .to(q("[data-hero-bottom]"), { opacity: 0, y: -30, duration: 0.15 }, 0.85)
          .to(q("[data-hero-stage]"), { scale: 0.9, opacity: 0.2, duration: 0.15 }, 0.85)
      })

      return () => {
        removeIntroListener()
        mm.revert()
      }
    },
    { scope: sectionRef },
  )

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return
    const rig = rigRef.current
    if (!rig) return
    const rx = gsap.quickTo(rig, "rotateX", { duration: 0.8, ease: "power3.out" })
    const ry = gsap.quickTo(rig, "rotateY", { duration: 0.8, ease: "power3.out" })
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      ry(x * 8)
      rx(-y * 5)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)
    return () => window.removeEventListener("load", refresh)
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-aurora grain"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_45%,rgba(167,139,250,0.22),transparent_70%)]"
      />

      <div
        data-hero-headline
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none px-4 text-center"
      >
        <h1 id="hero-title" className="sr-only">
          {profile.fullName} — {profile.role}
        </h1>
        <div data-intro-headline>
          <RoleSwitcher />
        </div>
      </div>

      <div data-hero-stage className="absolute inset-0 z-10 flex items-end justify-center [perspective:1400px]">
        <div ref={rigRef} className="preserve-3d relative">
          <div
            data-hero-ring
            className="preserve-3d pointer-events-none absolute left-1/2 top-[34%] z-10 [--orbit-r:170px] md:[--orbit-r:320px]"
            aria-hidden="true"
          >
            <div className="preserve-3d" style={{ transform: "rotateX(-12deg)" }}>
              <div data-hero-ring-inner className="preserve-3d">
                {ORBIT.map((skill, i) => (
                  <span
                    key={skill}
                    className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/80 backdrop-blur-sm md:text-xs"
                    style={{ transform: `rotateY(${(360 / ORBIT.length) * i}deg) translateZ(var(--orbit-r))` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div data-intro-card className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[15%] top-[10%] bottom-0 rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.35),transparent)] blur-2xl"
            />
            <canvas
              ref={canvasRef}
              width={FRAME_WIDTH}
              height={FRAME_HEIGHT}
              role="img"
              aria-label={`${profile.fullName}, rotating 360 degrees as you scroll`}
              className="relative block h-auto w-[min(96vw,460px)] [mask-image:linear-gradient(to_bottom,black_72%,transparent)] md:w-[min(82svh,720px)]"
            />
          </div>
        </div>
      </div>

      <div
        data-hero-bottom
        className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-8 md:flex-row md:items-end md:justify-between md:pb-10"
      >
        <div className="max-w-sm">
          <p data-hero-fade className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            {"// Hi, I'm "}
            {profile.firstName}
          </p>
          <p data-hero-fade className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            {profile.tagline}
          </p>
          <div data-hero-fade className="mt-5 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              View Work <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Contact Me
            </a>
          </div>
        </div>

        <div data-hero-fade className="hidden w-56 md:block">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <ArrowDown className="size-3" aria-hidden="true" /> Scroll to orbit 360°
          </p>
          <div className="mt-3 h-px w-full bg-white/10">
            <div data-hero-progress className="h-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}
