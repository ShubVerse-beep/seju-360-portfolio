import { NextResponse } from "next/server"
import { Resend } from "resend"

// Simple in-memory rate limiting map (IP -> count + expiry)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>()

function checkRateLimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  // Prune expired records occasionally
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.expiresAt < now) rateLimitMap.delete(key)
    }
  }

  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    // 1. Client IP & Rate Limiting
    const forwarded = request.headers.get("x-forwarded-for")
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "unknown"

    if (clientIp !== "unknown" && !checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      )
    }

    // 2. Parse payload
    let body: {
      name?: string
      firstName?: string
      lastName?: string
      email?: string
      subject?: string
      message?: string
      honeypot?: string
      _gotcha?: string
    }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      )
    }

    const {
      name: directName,
      firstName = "",
      lastName = "",
      email = "",
      subject = "",
      message = "",
      honeypot = "",
      _gotcha = "",
    } = body

    // 3. Honeypot check (anti-spam)
    if (honeypot.trim() !== "" || _gotcha.trim() !== "") {
      // Silently accept without sending email
      return NextResponse.json({ success: true, message: "Message received." }, { status: 200 })
    }

    // 4. Validate fields
    const fullName = (directName || `${firstName} ${lastName}`).trim()
    const cleanEmail = email.trim()
    const cleanMessage = message.trim()
    const cleanSubject =
      subject.trim() || `Portfolio inquiry from ${fullName || "Visitor"}`

    if (!fullName) {
      return NextResponse.json(
        { success: false, error: "Please enter your name." },
        { status: 400 }
      )
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    if (!cleanMessage) {
      return NextResponse.json(
        { success: false, error: "Please enter your message." },
        { status: 400 }
      )
    }

    if (cleanMessage.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message is too long (maximum 5,000 characters)." },
        { status: 400 }
      )
    }

    // 5. Check Server Environment Configuration
    const resendApiKey = process.env.RESEND_API_KEY
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL

    if (!resendApiKey) {
      console.error("[Contact API Error] RESEND_API_KEY is not configured in server environment.")
      return NextResponse.json(
        { success: false, error: "Contact service is temporarily unconfigured. Please try again soon." },
        { status: 500 }
      )
    }

    if (!receiverEmail) {
      console.error("[Contact API Error] CONTACT_RECEIVER_EMAIL is not configured in server environment.")
      return NextResponse.json(
        { success: false, error: "Contact recipient is not configured. Please try again soon." },
        { status: 500 }
      )
    }

    // 6. Initialize Resend & Send Email
    const resend = new Resend(resendApiKey)

    const fromAddress =
      process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>"

    const safeName = escapeHtml(fullName)
    const safeEmail = escapeHtml(cleanEmail)
    const safeSubject = escapeHtml(cleanSubject)
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, "<br/>")

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0a14; color: #f2f0f7; margin: 0; padding: 24px;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #161322; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); padding: 24px 28px;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
        New Portfolio Contact Message
      </h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); font-family: monospace;">
        Received from your portfolio contact form
      </p>
    </div>

    <div style="padding: 28px;">
      <div style="margin-bottom: 20px;">
        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 600; margin-bottom: 4px;">From</span>
        <div style="font-size: 16px; font-weight: 600; color: #ffffff;">${safeName}</div>
        <div style="font-size: 14px; color: #a6a1b8; margin-top: 2px;">
          <a href="mailto:${safeEmail}" style="color: #a78bfa; text-decoration: none;">${safeEmail}</a>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 600; margin-bottom: 4px;">Subject</span>
        <div style="font-size: 15px; color: #ffffff;">${safeSubject}</div>
      </div>

      <div style="margin-bottom: 28px;">
        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a78bfa; font-weight: 600; margin-bottom: 6px;">Message</span>
        <div style="background-color: #0f0d1a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #eae7f2;">
          ${safeMessage}
        </div>
      </div>

      <div style="text-align: center; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <a href="mailto:${safeEmail}?subject=${encodeURIComponent("Re: " + cleanSubject)}"
           style="display: inline-block; background-color: #ffffff; color: #07060b; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.2);">
          Reply to ${safeName}
        </a>
      </div>
    </div>

    <div style="background-color: #110e1c; padding: 16px 28px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
      <p style="margin: 0; font-size: 11px; color: #7a7590; font-family: monospace;">
        Direct reply will go to ${safeEmail}
      </p>
    </div>
  </div>
</body>
</html>
`

    const textContent = `Name: ${fullName}
Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}
`

    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: receiverEmail,
      replyTo: cleanEmail,
      subject: `[Portfolio Contact] ${cleanSubject}`,
      text: textContent,
      html: htmlContent,
    })

    if (emailResponse.error) {
      console.error("[Contact API Error] Resend returned error:", emailResponse.error)
      return NextResponse.json(
        { success: false, error: "Failed to deliver message via email provider. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully! I will get back to you soon.",
    })
  } catch (error) {
    console.error("[Contact API Exception]:", error)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
