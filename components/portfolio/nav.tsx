"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { navLinks, profile } from "@/lib/content"

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav
        aria-label="Primary"
        className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-5 pr-2"
      >
        <a href="#home" className="font-mono text-sm font-semibold tracking-widest" aria-label="Back to top">
          {profile.initials}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
          >
            Hire Me
          </a>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
