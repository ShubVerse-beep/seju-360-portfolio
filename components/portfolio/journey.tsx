import { Award } from "lucide-react"
import { certifications, experience } from "@/lib/content"
import { SectionTag } from "./section-tag"

export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionTag>Experience & certifications</SectionTag>
        <h2 id="journey-title" data-reveal className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-6xl">
          The journey so far
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <ol className="relative border-l border-white/10">
            {experience.map((item) => (
              <li key={item.role} data-reveal className="relative pb-10 pl-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(167,139,250,0.15)]"
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{item.period}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{item.role}</h3>
                <p className="text-sm text-accent">{item.org}</p>
                <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {item.points.map((p) => (
                    <li key={p}>— {p}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <ul className="grid content-start gap-3">
            {certifications.map((c) => (
              <li key={c.title} data-reveal className="glass flex items-center gap-4 rounded-2xl p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Award className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {c.issuer} · {c.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
