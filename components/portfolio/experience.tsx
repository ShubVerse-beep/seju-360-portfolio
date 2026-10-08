"use client"

import { useEffect, useRef, useState } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger, READY_EVENT, prefersReducedMotion } from "@/lib/gsap"
import { profile } from "@/lib/content"

const MIN_DURATION = 1800

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export function Experience() {
  const [percent, setPercent] = useState(0)
  const [done, setDone] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    let lenis: Lenis | null = null
    let tick: ((time: number) => void) | null = null

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      lenisRef.current = lenis
      lenis.on("scroll", ScrollTrigger.update)
      tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      lenis.stop()
    }
    document.documentElement.style.overflow = "hidden"
    window.scrollTo(0, 0)

    const start = performance.now()
    const assetsReady = Promise.all([preloadImage(profile.photo), document.fonts?.ready])
    let assetsLoaded = false
    assetsReady.then(() => (assetsLoaded = true))

    let raf = 0
    const step = () => {
      const elapsed = performance.now() - start
      const timeProgress = Math.min(elapsed / (reduced ? 300 : MIN_DURATION), 1)
      const cap = assetsLoaded ? 1 : 0.9
      const value = Math.round(Math.min(timeProgress, cap) * 100)
      setPercent(value)
      if (value >= 100) {
        finish()
        return
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    function finish() {
      const overlay = overlayRef.current
      const release = () => {
        document.documentElement.style.overflow = ""
        lenis?.start()
        setDone(true)
        window.dispatchEvent(new Event(READY_EVENT))
        ;(window as unknown as { __portfolioReady?: boolean }).__portfolioReady = true
        ScrollTrigger.refresh()
      }
      if (!overlay || reduced) return release()
      gsap
        .timeline({ onComplete: release })
        .to(overlay.querySelectorAll("[data-loader-item]"), {
          y: -30,
          opacity: 0,
          stagger: 0.04,
          duration: 0.5,
          ease: "power3.in",
        })
        .to(overlay, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.1")
    }

    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return
      const id = link.getAttribute("href")
      if (!id || id === "#") return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 })
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
    }
    document.addEventListener("click", onAnchorClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("click", onAnchorClick)
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
      document.documentElement.style.overflow = ""
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio ${percent}%`}
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-aurora grain p-6 md:p-10"
    >
      <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        <span data-loader-item>Initializing system</span>
        <span data-loader-item>Portfolio 2026</span>
      </div>

      <div className="flex flex-col items-center text-center">
        <p data-loader-item className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
          {"// booting profile"}
        </p>
        <h1
          data-loader-item
          className="mt-4 text-balance text-6xl font-bold uppercase leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl"
        >
          {profile.firstName} {profile.lastName}
        </h1>
        <p data-loader-item className="mt-4 text-sm text-muted-foreground md:text-base">
          {profile.role}
        </p>
      </div>

      <div data-loader-item className="mx-auto w-full max-w-xl">
        <div className="flex items-end justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Loading assets</span>
          <span className="text-3xl tabular-nums text-foreground md:text-4xl">
            {String(percent).padStart(3, "0")}%
          </span>
        </div>
        <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
          <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-status" aria-hidden="true" />
          Secure connection established
        </p>
      </div>
    </div>
  )
}
