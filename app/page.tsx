import { Experience } from "@/components/portfolio/experience"
import { Nav } from "@/components/portfolio/nav"
import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { TechMarquee } from "@/components/portfolio/tech-marquee"
import { Expertise } from "@/components/portfolio/expertise"
import { Projects } from "@/components/portfolio/projects"
import { Journey } from "@/components/portfolio/journey"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { RevealInit } from "@/components/portfolio/reveal-init"

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <Experience />
      <Nav />
      <main id="main" className="bg-aurora">
        <Hero />
        <About />
        <TechMarquee />
        <Expertise />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <RevealInit />
    </>
  )
}
