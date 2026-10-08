import { expertise } from "@/lib/content"
import { Chip, SectionTag } from "./section-tag"

export function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative overflow-hidden px-6 py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-1/3 size-72 rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="absolute bottom-10 right-[10%] size-80 rounded-full bg-fuchsia-500/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionTag>Core execution root map</SectionTag>
        <h2 id="expertise-title" data-reveal className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">
          Four roots, one goal: products that feel effortless.
        </h2>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {expertise.map((item) => (
            <li
              key={item.id}
              data-reveal
              className="glass group relative rounded-[1.75rem] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_60px_-20px_rgba(167,139,250,0.45)] md:p-9"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{`// root ${item.id}`}</p>
              <h3 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.chips.map((c) => (
                  <Chip key={c}>{c}</Chip>
                ))}
              </div>
              <span
                aria-hidden="true"
                className="absolute right-7 top-7 font-mono text-5xl font-bold text-white/5 transition-colors group-hover:text-accent/20"
              >
                {item.id}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
