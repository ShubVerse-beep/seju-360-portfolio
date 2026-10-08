"use client"

import { useRef } from "react"
import Image from "next/image"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { profile, stats } from "@/lib/content"
import { SectionTag } from "./section-tag"

export function About() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        "[data-about-card]",
        { rotateZ: -8, rotateY: 22, y: 60 },
        {
          rotateZ: -2,
          rotateY: 0,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: 1 },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section id="about" ref={ref} aria-labelledby="about-title" className="relative px-6 py-28 md:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="[perspective:1200px]">
          <div
            data-about-card
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_80px_-30px_rgba(167,139,250,0.5)]"
          >
            <Image
              src={profile.photo || "/placeholder.svg"}
              alt={`${profile.fullName} smiling`}
              fill
              sizes="(min-width: 768px) 384px, 90vw"
              className="object-cover object-[50%_25%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(7,6,11,0.8))]" />
            <span className="glass absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest">
              <span className="pulse-dot size-1.5 rounded-full bg-status" aria-hidden="true" />
              Open to opportunities · 2026
            </span>
          </div>
        </div>

        <div>
          <SectionTag>System profile</SectionTag>
          <h2 id="about-title" data-reveal className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Hello, I&apos;m {profile.firstName}.{" "}
            <span className="text-muted-foreground">I build apps, worlds and the web.</span>
          </h2>
          <p data-reveal className="mt-6 text-pretty leading-relaxed text-muted-foreground md:text-lg">
            {profile.bio}
          </p>

          <ul className="mt-10 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <li key={s.label} data-reveal className="glass rounded-2xl p-4">
                <p className="text-2xl font-bold tracking-tight md:text-3xl">{s.value}</p>
                <p className="mt-1 text-sm font-medium">{s.label}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.sub}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
