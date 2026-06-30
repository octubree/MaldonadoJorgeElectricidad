"use client";

import * as React from "react";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { ArrowLeft, Zap } from "lucide-react";

/**
 * Admin layout — wraps /admin pages with the NextAuth SessionProvider and
 * keeps the same always-dark emerald aesthetic as the public site.
 *
 * The "← Volver al sitio" link in the top-left lets the admin escape back
 * to `/` without scrolling through the gallery.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              Volver al sitio
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                <Zap className="size-4" fill="currentColor" />
              </span>
              <span>
                Jorge <span className="text-primary">Electricidad</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  );
}
