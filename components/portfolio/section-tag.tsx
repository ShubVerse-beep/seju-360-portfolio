export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
      {"// "}
      {children}
    </p>
  )
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  )
}
