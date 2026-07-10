import Image from "next/image";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUSINESS, HERO_TRUST } from "@/components/site/data";

const TRUST_ICONS = {
  calendar: CalendarDays,
  badge: BadgeCheck,
  map: MapPin,
} as const;

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24"
    >
      {/* Background emerald radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 0%, oklch(0.72 0.19 162 / 20%) 0%, oklch(0.72 0.19 162 / 6%) 35%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 75%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Left â€” copy */}
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="gap-1.5 rounded-full border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <Zap className="size-3.5" fill="currentColor" />
            TÃ©cnico Electricista Â· Trabajos con firma de UTE
          </Badge>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Jorge Electricidad
            <span className="mt-2 block text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
              TÃ©cnico Electricista
            </span>
            <span className="mt-1 block text-base font-normal text-muted-foreground sm:text-lg lg:text-xl">
              Maldonado & Punta del Este
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Soluciones elÃ©ctricas de obra nueva, urgencias, instalaciones,
            domÃ³tica y sistemas de seguridad.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group text-base">
              <a href="#contacto">
                Solicitar Presupuesto
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border/70 bg-transparent text-base hover:bg-secondary/60 hover:text-foreground"
            >
              <a href="#servicios">Ver Servicios</a>
            </Button>
          </div>

          {/* Trust row */}
          <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {HERO_TRUST.map((t) => {
              const Icon = TRUST_ICONS[t.icon];
              return (
                <li key={t.label} className="flex items-center gap-1.5">
                  <Icon className="size-4 text-primary" />
                  {t.label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right â€” hero image with glow */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none hidden lg:block">
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-black/40">
            <Image
              src="/images/hero.webp"
              alt="TÃ©cnico electricista trabajando en un tablero elÃ©ctrico"
              width={1344}
              height={768}
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="aspect-[7/4] w-full object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
            />
          </div>

          {/* Floating stat card */}
          <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-xl border border-border/70 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <BadgeCheck className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Trabajos con firma de UTE</p>
              <p className="text-xs text-muted-foreground">
                TÃ©cnico electricista
              </p>
            </div>
          </div>

          {/* Floating phone card */}
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className="absolute -top-4 -right-3 hidden items-center gap-3 rounded-xl border border-border/70 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-md transition-colors hover:border-primary/40 sm:flex"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-5" fill="currentColor" />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">TelÃ©fono</p>
              <p className="text-sm font-semibold text-foreground">
                {BUSINESS.phoneDisplay}
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
