"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  MapPin,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ABOUT_BIO, ABOUT_HIGHLIGHTS } from "@/components/site/data";
import { SectionHeading } from "@/components/site/SectionHeading";
import { optimizeImage } from "@/lib/image-cdn";

// Retrato de Jorge hosteado en ImageKit (CDN). Se sirve optimizado a
// WebP al vuelo preservando la relación de aspecto 3:4 (sin recorte
// cuadrado) para no cortar la imagen.
const PORTRAIT_URL = "https://ik.imagekit.io/tnzquipyu/sobre%20mi.png";

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  graduation: GraduationCap,
  badge: BadgeCheck,
  map: MapPin,
};

export function About() {
  return (
    <section
      id="sobre-mi"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28"
    >
      {/* subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — portrait */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm lg:max-w-md"
          >
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/15 blur-2xl"
            />
            <div className="relative">
              {/* emerald accent frame */}
              <div
                aria-hidden
                className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-2xl border-l-2 border-t-2 border-primary/60"
              />
              <div
                aria-hidden
                className="absolute -bottom-3 -right-3 h-24 w-24 rounded-br-2xl border-b-2 border-r-2 border-primary/60"
              />
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-black/40">
                <img
                  src={optimizeImage(PORTRAIT_URL, 800, false)}
                  alt="Retrato de Jorge, técnico electricista"
                  loading="lazy"
                  decoding="async"
                  width={864}
                  height={1152}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right — text */}
          <div>
            <SectionHeading
              eyebrow="Acerca"
              title="Sobre Mí"
              align="left"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
            >
              {ABOUT_BIO}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 grid grid-cols-2 gap-3"
            >
              {ABOUT_HIGHLIGHTS.map((h) => {
                const Icon = HIGHLIGHT_ICONS[h.icon];
                return (
                  <div
                    key={h.label}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 transition-colors hover:border-primary/30"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/25">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-medium leading-tight text-foreground">
                      {h.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8"
            >
              <Button asChild size="lg" className="group">
                <a href="#contacto">
                  Hablemos
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
