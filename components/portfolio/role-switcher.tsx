"use client"

import { useEffect, useState } from "react"
import { profile } from "@/lib/content"
import { prefersReducedMotion } from "@/lib/gsap"

export function RoleSwitcher() {
  const [index, setIndex] = useState(0)
  const roles = profile.roles

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800)
    return () => window.clearInterval(id)
  }, [roles.length])

  return (
    <div aria-hidden="true" className="relative mx-auto h-[1em] overflow-hidden text-[clamp(2.5rem,11vw,11rem)] font-bold uppercase leading-[1] tracking-[-0.05em]">
      {roles.map((role, i) => {
        const [first, ...rest] = role.split(" ")
        const offset = (i - index + roles.length) % roles.length
        const state = offset === 0 ? "translate-y-0 opacity-100" : offset === 1 ? "translate-y-full opacity-0" : "-translate-y-full opacity-0"
        return (
          <div
            key={role}
            className={`absolute inset-0 flex items-center justify-center gap-[0.25em] whitespace-nowrap transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${state}`}
          >
            <span className="text-foreground/95">{first}</span>
            <span className="text-outline">{rest.join(" ")}</span>
          </div>
        )
      })}
    </div>
  )
}
