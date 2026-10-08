"use client"

import { useRef } from "react"
import { ArrowUpRight, Code2 as Github } from "lucide-react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { projects, type Project } from "@/lib/content"
import { Chip, SectionTag } from "./section-tag"

function ProjectLink({ href, label, icon }: { href: string; label: string; icon: "live" | "repo" }) {
  const Icon = icon === "live" ? ArrowUpRight : Github
  if (!href) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-dashed border-white/15 px-4 py-2 text-sm text-muted-foreground">
        {label} · soon
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        icon === "live"
          ? "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.04]"
          : "glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/10"
      }
    >
      {label} <Icon className="size-4" aria-hidden="true" />
    </a>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-project-card
      className="glass relative flex h-full w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] p-7 sm:w-[440px] md:p-9"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-violet-500/20 blur-[80px]"
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{`// project ${project.id}`}</p>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/80">
            {project.status}
          </span>
        </div>
        <h3 className="mt-10 text-balance text-3xl font-bold tracking-tight md:text-4xl">{project.title}</h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{project.year}</p>
        <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{project.description}</p>
      </div>
      <div className="relative mt-8">
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ProjectLink href={project.liveUrl} label="Live" icon="live" />
          <ProjectLink href={project.repoUrl} label="Code" icon="repo" />
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current
        if (!track) return
        const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]")
        const distance = () => track.scrollWidth - window.innerWidth

        const emphasise = () => {
          const center = window.innerWidth / 2
          cards.forEach((card) => {
            const r = card.getBoundingClientRect()
            const d = (r.left + r.width / 2 - center) / window.innerWidth
            gsap.set(card, {
              rotateY: gsap.utils.clamp(-28, 28, -d * 40),
              scale: 1 - Math.min(Math.abs(d) * 0.18, 0.12),
              opacity: 1 - Math.min(Math.abs(d) * 0.6, 0.5),
            })
          })
        }

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: emphasise,
            onRefresh: emphasise,
          },
        })
        emphasise()
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-title"
      className="relative overflow-hidden py-24 md:flex md:h-svh md:flex-col md:justify-center md:py-0"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionTag>Featured work</SectionTag>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="projects-title" data-reveal className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Featured engineering projects
          </h2>
          <p data-reveal className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {String(projects.length).padStart(2, "0")} builds · scroll to explore
          </p>
        </div>
      </div>

      <div className="mt-12 [perspective:1600px]">
        <div
          ref={trackRef}
          className="preserve-3d flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:snap-none md:overflow-visible md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-[30vw]"
        >
          {projects.map((p) => (
            <div key={p.id} className="snap-center">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
