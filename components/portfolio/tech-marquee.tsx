import { skillsRowA, skillsRowB } from "@/lib/content"
import { SectionTag } from "./section-tag"

function Row({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const track = [...items, ...items]
  return (
    <div className="marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <ul className={`flex w-max gap-3 py-2 ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {track.map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="glass whitespace-nowrap rounded-full px-6 py-3 text-base font-medium md:text-lg"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TechMarquee() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-6xl px-6">
        <SectionTag>Technical stack</SectionTag>
        <h2 id="skills-title" data-reveal className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-6xl">
          Technologies I work with
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <Row items={skillsRowA} direction="left" />
        <Row items={skillsRowB} direction="right" />
      </div>
    </section>
  )
}
