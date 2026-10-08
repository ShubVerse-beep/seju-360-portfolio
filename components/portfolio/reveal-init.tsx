"use client"

import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap"

export function RevealInit() {
  useGSAP(() => {
    if (prefersReducedMotion()) return
    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]")
    gsap.set(items, { y: 40, opacity: 0 })
    ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true }),
    })
  })
  return null
}
