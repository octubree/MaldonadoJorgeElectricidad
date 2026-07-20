"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS } from "@/components/site/data";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * Validation schema with conditional logic:
 *  - whatsapp_number + whatsapp_country required if "whatsapp" is in preference
 *  - email required if "email" is in preference
 */
const contactSchema = z
  .object({
    name: z
      .string()
      .min(1, "Ingresá tu nombre")
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
      .min(1, "Ingresá tu mensaje")
      .min(15, "Contame un poco más, al menos 15 caracteres"),
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

type ContactForm = z.infer<typeof contactSchema>;

type ContactInfo = {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
};

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: MapPin,
    label: "Ubicación",
    value: BUSINESS.location,
    href: "https://maps.google.com/?q=Maldonado+Punta+del+Este+Uruguay",
  },
  {
    icon: Mail,
    label: "Email",
    value: BUSINESS.email,
    href: `mailto:${BUSINESS.email}`,
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: BUSINESS.phoneDisplay,
    href: `tel:${BUSINESS.phoneTel}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: BUSINESS.phoneDisplay,
    href: BUSINESS.whatsappPrefilled,
  },
];

export function Contact() {
  const [submitting, setSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<{
    filename: string;
    content: string;
  } | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      contact_preference: ["whatsapp"],
      whatsapp_country: "uy",
      whatsapp_number: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const preference = watch("contact_preference") ?? [];
  const wantsWhatsapp = preference.includes("whatsapp");
  const wantsEmail = preference.includes("email");

  const togglePreference = (val: "whatsapp" | "email", checked: boolean) => {
    const current = new Set(preference);
    if (checked) current.add(val);
    else current.delete(val);
    setValue("contact_preference", Array.from(current), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Limit size to 3MB (safe for Vercel's 4.5MB request limit after base64 overhead)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("El archivo supera el límite de 3MB. Sube uno más liviano.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    // Prevent videos
    if (file.type.startsWith("video/")) {
      setFileError("No se permiten archivos de vídeo. Sube fotos, PDFs, imágenes o planos de CAD.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      setSelectedFile({
        filename: file.name,
        content: base64Data,
      });
    };
    reader.onerror = () => {
      setFileError("Error al leer el archivo. Intenta de nuevo.");
      setSelectedFile(null);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        attachment: selectedFile || undefined,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(err?.error || "Error al enviar");
      }

      toast.success("¡Mensaje enviado! Te responderé a la brevedad.");
      setIsSubmitted(true);
      reset({
        name: "",
        contact_preference: ["whatsapp"],
        whatsapp_country: "uy",
        whatsapp_number: "",
        email: "",
        subject: "",
        message: "",
      });
      setSelectedFile(null);
      setFileError(null);
      
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch {
      toast.error(
        "Hubo un error, intenta de nuevo o escríbeme por WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative scroll-mt-20 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contacto"
          title="Hablemos"
          subtitle="Contame en qué puedo ayudarte y te respondo a la brevedad."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Left — info cards */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {CONTACT_INFO.map((info) => {
              const Icon = info.icon;
              const isExternal = info.href.startsWith("http");
              return (
                <a
                  key={info.label}
                  href={info.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={cn(
                    "group flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/60 p-5 transition-all duration-300",
                    "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/80"
                  )}
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 transition-all group-hover:bg-primary/25 group-hover:ring-primary/45">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {info.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-foreground">
                      {info.value}
                    </p>
                  </div>
                </a>
              );
            })}

            <div className="sm:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground">
                Atiendo en{" "}
                <span className="font-semibold text-foreground">
                  Maldonado y Punta del Este
                </span>
                . Para urgencias, escribanme por WhatsApp y te respondo lo antes
                posible.
              </p>
            </div>
          </motion.div>

          {/* Right — form or success panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 flex flex-col justify-center min-h-[480px]"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success-panel"
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center py-6 px-2"
                >
                  <div className="relative mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
                    >
                      <CheckCircle2 className="size-11 text-emerald-400" />
                    </motion.div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    ¡Mensaje Enviado con Éxito!
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                    Muchas gracias por contactarme. He recibido tu consulta correctamente y te responderé a la brevedad por el medio seleccionado.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto gap-2 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-foreground"
                    >
                      <RefreshCw className="size-4" />
                      Enviar otra consulta
                    </Button>
                    <a
                      href={BUSINESS.whatsappPrefilled}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="size-4" />
                      Ir a WhatsApp
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form
                  key="contact-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                  aria-label="Formulario de contacto"
                  noValidate
                >
                  {/* Nombre */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">
                      Nombre <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Tu nombre"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Preferencia de contacto */}
                  <div className="flex flex-col gap-2">
                    <Label>¿Cómo prefieres que te contacte? *</Label>
                    <div className="flex flex-wrap gap-5 pt-1">
                      <div className="flex items-center gap-3 py-1">
                        <Checkbox
                          id="pref-wa"
                          className="size-6 sm:size-5 border-primary/60 bg-background hover:border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:bg-background dark:border-primary/60 dark:hover:border-primary cursor-pointer transition-colors shadow-sm"
                          checked={wantsWhatsapp}
                          onCheckedChange={(c) =>
                            togglePreference("whatsapp", c === true)
                          }
                        />
                        <Label
                          htmlFor="pref-wa"
                          className="cursor-pointer text-sm font-semibold text-foreground/85 hover:text-foreground select-none pl-0.5 transition-colors"
                        >
                          WhatsApp
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 py-1">
                        <Checkbox
                          id="pref-email"
                          className="size-6 sm:size-5 border-primary/60 bg-background hover:border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:bg-background dark:border-primary/60 dark:hover:border-primary cursor-pointer transition-colors shadow-sm"
                          checked={wantsEmail}
                          onCheckedChange={(c) =>
                            togglePreference("email", c === true)
                          }
                        />
                        <Label
                          htmlFor="pref-email"
                          className="cursor-pointer text-sm font-semibold text-foreground/85 hover:text-foreground select-none pl-0.5 transition-colors"
                        >
                          Email
                        </Label>
                      </div>
                    </div>
                    {errors.contact_preference && (
                      <p className="text-xs text-destructive">
                        {typeof errors.contact_preference.message === "string"
                          ? errors.contact_preference.message
                          : "Elegí al menos un método de contacto"}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp conditional fields */}
                  <AnimatePresence initial={false}>
                    {wantsWhatsapp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="whatsapp_number">
                            WhatsApp <span className="text-primary">*</span>
                          </Label>
                          <div className="grid grid-cols-[5.5rem_1fr] gap-2">
                            <Select
                              value={watch("whatsapp_country")}
                              onValueChange={(v) =>
                                setValue("whatsapp_country", v as "uy" | "ar", {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                              }
                            >
                              <SelectTrigger
                                id="whatsapp_country"
                                aria-label="País"
                                aria-invalid={!!errors.whatsapp_country}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="uy">🇺🇾 UY</SelectItem>
                                <SelectItem value="ar">🇦🇷 AR</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              id="whatsapp_number"
                              type="tel"
                              inputMode="tel"
                              placeholder="Ej: 94588012"
                              autoComplete="tel-national"
                              aria-invalid={!!errors.whatsapp_number}
                              aria-describedby={
                                errors.whatsapp_number
                                  ? "whatsapp_number-error"
                                  : undefined
                              }
                              {...register("whatsapp_number")}
                            />
                          </div>
                          {errors.whatsapp_number && (
                            <p
                              id="whatsapp_number-error"
                              className="text-xs text-destructive"
                            >
                              {errors.whatsapp_number.message}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email conditional field */}
                  <AnimatePresence initial={false}>
                    {wantsEmail && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="email">
                            Email <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={
                              errors.email ? "email-error" : undefined
                            }
                            {...register("email")}
                          />
                          {errors.email && (
                            <p id="email-error" className="text-xs text-destructive">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Asunto */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="subject">Asunto del mensaje</Label>
                    <Input
                      id="subject"
                      placeholder="Ej: Presupuesto obra nueva"
                      {...register("subject")}
                    />
                  </div>

                  {/* Mensaje */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">
                      Tu mensaje <span className="text-primary">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Contame qué necesitás..."
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      {...register("message")}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-xs text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Adjuntar Archivo */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="file-upload" className="flex items-center gap-1.5">
                      Adjuntar archivo <span className="text-xs text-muted-foreground">(Opcional · Máx 3MB)</span>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.heic,.pdf,.dwg,.dxf,.txt,.doc,.docx,.xls,.xlsx,.zip"
                      onChange={handleFileChange}
                      className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:transition-colors file:cursor-pointer"
                    />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Formatos permitidos: Fotos (JPG, PNG, WebP), PDFs, planos de CAD (DWG, DXF), documentos de Office o archivos ZIP. No se permiten vídeos.
                    </p>
                    {fileError && (
                      <p className="text-xs text-destructive font-medium">
                        {fileError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="group w-full sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Al enviar aceptás que Jorge Electricidad te contacte para
                    responder tu consulta.
                  </p>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
