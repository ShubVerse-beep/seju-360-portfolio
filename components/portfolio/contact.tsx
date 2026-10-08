"use client"

import { useState } from "react"
import { BriefcaseBusiness as Linkedin, Mail, Phone, Send, Loader2 } from "lucide-react"
import { profile } from "@/lib/content"
import { SectionTag } from "./section-tag"

type FormState = {
  firstName: string
  lastName: string
  email: string
  message: string
  consent: boolean
  honeypot: string
}

const initial: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  consent: false,
  honeypot: "",
}

function PayloadPreview({ form }: { form: FormState }) {
  const val = (v: string, placeholder: string) =>
    v ? <span className="text-emerald-300">{`"${v}"`}</span> : <span className="text-muted-foreground">{`"[${placeholder}]"`}</span>
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">payload_preview.json</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed md:text-sm">
        <code>
          <span className="text-muted-foreground">{"{"}</span>
          {"\n  "}
          <span className="text-accent">&quot;from&quot;</span>: {val(`${form.firstName} ${form.lastName}`.trim(), "Awaiting Name")},
          {"\n  "}
          <span className="text-accent">&quot;email&quot;</span>: {val(form.email, "Awaiting Email")},
          {"\n  "}
          <span className="text-accent">&quot;message&quot;</span>:{" "}
          {val(form.message.length > 48 ? `${form.message.slice(0, 48)}…` : form.message, "Awaiting Message")},
          {"\n  "}
          <span className="text-accent">&quot;consent&quot;</span>:{" "}
          <span className={form.consent ? "text-emerald-300" : "text-muted-foreground"}>{String(form.consent)}</span>
          {"\n"}
          <span className="text-muted-foreground">{"}"}</span>
        </code>
      </pre>
    </div>
  )
}

export function Contact() {
  const [form, setForm] = useState<FormState>(initial)
  const [status, setStatus] = useState<string>("")
  const [statusType, setStatusType] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.firstName.trim()) {
      setStatus("Please enter your first name.")
      setStatusType("error")
      return
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus("Please provide a valid email address.")
      setStatusType("error")
      return
    }

    if (!form.message.trim()) {
      setStatus("Please enter your message.")
      setStatusType("error")
      return
    }

    if (!form.consent) {
      setStatus("Please agree to be contacted back.")
      setStatusType("error")
      return
    }

    setIsSubmitting(true)
    setStatus("Sending message…")
    setStatusType("loading")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
          honeypot: form.honeypot,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("Message sent successfully! I'll get back to you soon.")
        setStatusType("success")
        setForm(initial)
      } else {
        setStatus(data.error || "Unable to send message. Please try again.")
        setStatusType("error")
      }
    } catch {
      setStatus("Network error while sending message. Please try again.")
      setStatusType("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTag>Live dispatch node</SectionTag>
          <h2 id="contact-title" data-reveal className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Let&apos;s build something exceptional.
          </h2>
          <p data-reveal className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Internships, freelance apps, VR experiments or a website that needs a glow-up — send a message and watch the
            payload assemble live.
          </p>
          <div data-reveal className="mt-8">
            <PayloadPreview form={form} />
          </div>
          <ul data-reveal className="mt-8 flex flex-wrap gap-3 text-sm">
            <li>
              <a href={`mailto:${profile.email}`} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 hover:bg-white/10">
                <Mail className="size-4" aria-hidden="true" /> {profile.email}
              </a>
            </li>
            <li>
              <a href={`tel:${profile.phone}`} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 hover:bg-white/10">
                <Phone className="size-4" aria-hidden="true" /> {profile.phone}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 hover:bg-white/10"
              >
                <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <form data-reveal onSubmit={onSubmit} className="glass flex flex-col gap-4 rounded-[2rem] p-6 md:p-8">
          {/* Honeypot field for anti-spam */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="hp_comment">Do not fill this field</label>
            <input
              id="hp_comment"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(e) => update("honeypot", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">First name</span>
              <input required autoComplete="given-name" className={inputCls} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Ada" />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Last name</span>
              <input autoComplete="family-name" className={inputCls} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Lovelace" />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Email</span>
            <input required type="email" autoComplete="email" className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea required rows={5} className={`${inputCls} resize-none`} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell me about your project…" />
          </label>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              required
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-0.5 size-4 accent-[#a78bfa]"
            />
            I agree to be contacted back about this message.
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                Sending... <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              </>
            ) : (
              <>
                Send Message <Send className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
          <p
            role="status"
            aria-live="polite"
            className={`min-h-5 text-center font-mono text-xs transition-colors ${
              statusType === "error"
                ? "text-red-400"
                : statusType === "loading"
                ? "text-accent"
                : "text-status"
            }`}
          >
            {status}
          </p>
        </form>
      </div>
    </section>
  )
}
