import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    contact_preference: z
      .array(z.enum(["whatsapp", "email"]))
      .min(1, "Elegí al menos un método de contacto"),
    whatsapp_country: z.enum(["uy", "ar"]).optional(),
    whatsapp_number: z.string().optional(),
    email: z.string().optional(),
    subject: z.string().optional(),
    message: z
      .string()
      .min(15, "El mensaje debe tener al menos 15 caracteres"),
    attachment: z
      .object({
        filename: z.string(),
        content: z.string(), // base64 string
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contact_preference.includes("whatsapp")) {
      if (!data.whatsapp_number || data.whatsapp_number.trim().length < 6) {
        ctx.addIssue({
          path: ["whatsapp_number"],
          code: z.ZodIssueCode.custom,
          message: "Ingresá tu número de WhatsApp",
        });
      }
      if (!data.whatsapp_country) {
        ctx.addIssue({
          path: ["whatsapp_country"],
          code: z.ZodIssueCode.custom,
          message: "Elegí tu país",
        });
      }
    }
    if (data.contact_preference.includes("email")) {
      if (!data.email || data.email.trim().length === 0) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Ingresá tu email",
        });
      } else if (!z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "El email no es válido",
        });
      }
    }
  });

const COUNTRY_LABELS: Record<string, string> = {
  uy: "Uruguay",
  ar: "Argentina",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(
  data: z.infer<typeof contactSchema>
): string {
  const preferences = data.contact_preference
    .map((p) => (p === "whatsapp" ? "WhatsApp" : "Email"))
    .join(", ");

  const rows: Array<[string, string]> = [
    ["Nombre", escapeHtml(data.name)],
    ["Contacto preferido", escapeHtml(preferences)],
  ];

  if (data.contact_preference.includes("whatsapp")) {
    const country =
      data.whatsapp_country && COUNTRY_LABELS[data.whatsapp_country]
        ? COUNTRY_LABELS[data.whatsapp_country]
        : "(país no especificado)";
    rows.push([
      "WhatsApp",
      `+${data.whatsapp_country === "ar" ? "54" : "598"} ${escapeHtml(
        data.whatsapp_number ?? ""
      )} (${escapeHtml(country)})`,
    ]);
  }
  if (data.contact_preference.includes("email") && data.email) {
    rows.push(["Email", escapeHtml(data.email)]);
  }
  if (data.subject && data.subject.trim().length > 0) {
    rows.push(["Asunto", escapeHtml(data.subject)]);
  }
  rows.push(["Mensaje", escapeHtml(data.message)]);

  const rowHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;vertical-align:top;color:#6b7280;font-size:13px;width:160px;border-bottom:1px solid #f1f5f9;">${label}</td>
          <td style="padding:8px 12px;vertical-align:top;color:#0f172a;font-size:14px;border-bottom:1px solid #f1f5f9;">${value}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:#059669;color:#ffffff;padding:18px 24px;">
        <h1 style="margin:0;font-size:18px;font-weight:600;">Nuevo mensaje de la web — Jorge Electricidad</h1>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">Recibido el ${new Date().toLocaleString(
          "es-UY",
          { timeZone: "America/Montevideo" }
        )}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>
          ${rowHtml}
        </tbody>
      </table>
      <div style="padding:14px 24px;background:#f8fafc;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;">
        Este mensaje fue enviado desde el formulario de contacto de jorge-electricidad.net
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Datos inválidos",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Small artificial delay so the UX feels real.
  await new Promise((r) => setTimeout(r, 300));

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL;
  const fromEmail =
    process.env.FROM_EMAIL || "web@jorge-electricidad.net";

  // ── Demo mode (no Resend configured) ────────────────────────────────
  if (!apiKey || !toEmail) {
    console.warn(
      "[contacto] RESEND no configurado — mensaje en consola solo."
    );
    console.log("[contacto] Nuevo mensaje recibido:", {
      name: data.name,
      contact_preference: data.contact_preference,
      whatsapp_country: data.whatsapp_country ?? null,
      whatsapp_number: data.whatsapp_number ?? null,
      email: data.email ?? null,
      subject: data.subject ?? "(sin asunto)",
      message: data.message,
      attachment: data.attachment
        ? `${data.attachment.filename} (Base64 length: ${data.attachment.content.length} chars)`
        : null,
      recibido: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, demo: true });
  }

  // ── Real send via Resend ────────────────────────────────────────────
  try {
    const resend = new Resend(apiKey);
    const subject = `Nuevo mensaje de la web: ${
      data.subject && data.subject.trim().length > 0
        ? data.subject
        : data.name
    }`;

    const emailPayload: any = {
      from: fromEmail,
      to: toEmail,
      subject,
      html: buildEmailHtml(data),
      replyTo: data.email && data.contact_preference.includes("email")
        ? data.email
        : undefined,
    };

    if (data.attachment) {
      emailPayload.attachments = [
        {
          filename: data.attachment.filename,
          content: Buffer.from(data.attachment.content, "base64"),
        },
      ];
    }

    const { error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error("[contacto] Resend error:", error);
      return NextResponse.json(
        { success: false, error: "No se pudo enviar el email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[contacto] send error:", e);
    return NextResponse.json(
      { success: false, error: "No se pudo enviar el email" },
      { status: 500 }
    );
  }
}
