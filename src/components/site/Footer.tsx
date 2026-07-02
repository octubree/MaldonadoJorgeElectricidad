import Link from "next/link";
import { Zap, Phone, Mail, MapPin, BookOpen } from "lucide-react";

import { BUSINESS, NAV_LINKS, BLOG_NAV_LINK } from "@/components/site/data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/#inicio"
              className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <Zap className="size-5" fill="currentColor" />
              </span>
              <span className="text-base">
                Jorge <span className="text-primary">Electricidad</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Técnico electricista. Trabajos con firma de UTE. Obra nueva, urgencias,
              instalaciones, domótica y sistemas de seguridad en Maldonado y
              Punta del Este.
            </p>
          </div>

          {/* Quick links */}
          <nav
            aria-label="Enlaces del pie de página"
            className="md:justify-self-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navegación
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${link.href}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Discreet Blog link to /blog route */}
              <li>
                <Link
                  href={BLOG_NAV_LINK.href}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <BookOpen className="size-3 opacity-60" />
                  {BLOG_NAV_LINK.label}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contacto
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`tel:${BUSINESS.phoneTel}`}
                  className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-card/60 ring-1 ring-border/60 transition-colors group-hover:bg-primary/15 group-hover:text-primary group-hover:ring-primary/30">
                    <Phone className="size-4" />
                  </span>
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-card/60 ring-1 ring-border/60 transition-colors group-hover:bg-primary/15 group-hover:text-primary group-hover:ring-primary/30">
                    <Mail className="size-4" />
                  </span>
                  <span className="break-all">{BUSINESS.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex size-9 items-center justify-center rounded-lg bg-card/60 ring-1 ring-border/60">
                  <MapPin className="size-4" />
                </span>
                {BUSINESS.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© 2026 Jorge Electricidad. Todos los derechos reservados.</p>
          <p>Maldonado · Punta del Este, Uruguay</p>
        </div>
      </div>
    </footer>
  );
}
