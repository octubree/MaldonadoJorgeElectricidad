"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CircuitBoard,
  Cctv,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SERVICES, type ServiceItem } from "@/components/site/data";
import { SectionHeading, Reveal } from "@/components/site/SectionHeading";

const ICONS: Record<ServiceItem["icon"], LucideIcon> = {
  zap: Zap,
  circuit: CircuitBoard,
  cctv: Cctv,
};

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = ICONS[service.icon];
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1,
      }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/5"
      )}
    >
      {/* top glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, oklch(0.72 0.19 162 / 12%) 0%, transparent 70%)",
        }}
      />

      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 transition-all group-hover:bg-primary/25 group-hover:ring-primary/45">
        <Icon className="size-6" />
      </div>

      <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {service.items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-xs text-muted-foreground"
          >
            <Check className="size-3 text-primary" />
            {item}
          </li>
        ))}
      </ul>

      <a
        href="#contacto"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        Consultar
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
    </motion.article>
  );
}

export function Services() {
  return (
    <section id="servicios" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Servicios"
          title="Lo que puedo hacer por ti"
          subtitle="Soluciones integrales en electricidad y afines"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        <Reveal className="mt-12" delay={0.1}>
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground sm:text-base">
              ¿No ves lo que necesitás?{" "}
              <span className="text-foreground">
                Consultame por tu proyecto y te oriento sin compromiso.
              </span>
            </p>
            <a
              href="#contacto"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Hablar con Jorge
              <ArrowRight className="size-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
