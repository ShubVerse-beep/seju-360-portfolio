import { profile } from "@/lib/content"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-6 pt-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:grid-cols-4">
        <div>
          <p className="text-foreground/60">Stack</p>
          <p className="mt-2">Flutter · Node · XR · Web</p>
        </div>
        <div>
          <p className="text-foreground/60">Status</p>
          <p className="mt-2 flex items-center gap-2">
            <span className="pulse-dot size-1.5 rounded-full bg-status" aria-hidden="true" /> Open to opportunities
          </p>
        </div>
        <div>
          <p className="text-foreground/60">Region</p>
          <p className="mt-2">{profile.region}</p>
        </div>
        <div className="md:text-right">
          <p className="text-foreground/60">Navigate</p>
          <a href="#home" className="mt-2 inline-block hover:text-foreground">
            Back to top ↑
          </a>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="mt-16 select-none whitespace-nowrap bg-gradient-to-b from-white/25 to-transparent bg-clip-text text-center text-[19vw] font-bold uppercase leading-[0.8] tracking-[-0.06em] text-transparent"
      >
        {profile.firstName} {profile.lastName}
      </p>
      <p className="sr-only">
        © {new Date().getFullYear()} {profile.fullName}
      </p>
    </footer>
  )
}
