"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Phone, Menu, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { BUSINESS, NAV_LINKS, BLOG_NAV_LINK } from "@/components/site/data";
import { ShareButton } from "@/components/site/ShareButton";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState<string>("#inicio");
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Don't render the home scroll-spy navbar behaviour on /blog.
  const isHome = pathname === "/";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy — only the 6 home anchors (not Blog).
  React.useEffect(() => {
    if (!isHome) return;
    const sections = NAV_LINKS.map((l) =>
      document.querySelector(l.href)
    ).filter(Boolean) as Element[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/#inicio"
          className="group flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30 transition-all group-hover:bg-primary/25 group-hover:ring-primary/50">
            <Zap className="size-5" fill="currentColor" />
          </span>
          <span className="text-base sm:text-lg">
            Jorge <span className="text-primary">Electricidad</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isHome && active === link.href;
            return (
              <Link
                key={link.href}
                href={`/${link.href}`}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {/* Blog — separate route, slightly differentiated */}
          <Link
            href={BLOG_NAV_LINK.href}
            className={cn(
              "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === BLOG_NAV_LINK.href
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {BLOG_NAV_LINK.label}
            <ExternalLink className="size-3 opacity-60" />
            {pathname === BLOG_NAV_LINK.href && (
              <span className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ShareButton
            variant="outline"
            size="sm"
            className="hidden shadow-[0_0_0_1px_oklch(0.72_0.19_162/30%)] md:inline-flex"
          />

          <Button
            asChild
            size="sm"
            className="hidden shadow-[0_0_0_1px_oklch(0.72_0.19_162/40%)] sm:inline-flex"
          >
            <a href={`tel:${BUSINESS.phoneTel}`} aria-label="Llamar por teléfono">
              <Phone className="size-4" />
              {BUSINESS.phoneDisplay}
            </a>
          </Button>

          {/* Mobile sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-11 w-11"
                aria-label="Abrir menú"
              >
                <Menu className="size-7" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[78vw] border-l border-border/60 bg-background/95 backdrop-blur-xl sm:max-w-sm"
            >
              <SheetHeader className="pb-2">
                <SheetTitle className="flex items-center gap-2.5 text-left">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                    <Zap className="size-4" fill="currentColor" />
                  </span>
                  <span>
                    Jorge <span className="text-primary">Electricidad</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4 py-2">
                <>
                  {NAV_LINKS.map((link) => {
                    const isActive = isHome && active === link.href;
                    return (
                      <div
                        key={link.href}
                      >
                        <SheetClose asChild>
                          <Link
                            href={`/${link.href}`}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                            )}
                          >
                            {link.label}
                            {isActive && (
                              <span className="size-1.5 rounded-full bg-primary" />
                            )}
                          </Link>
                        </SheetClose>
                      </div>
                    );
                  })}

                  {/* Blog route link */}
                  <div>
                    <SheetClose asChild>
                      <Link
                        href={BLOG_NAV_LINK.href}
                        className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                      >
                        {BLOG_NAV_LINK.label}
                        <ExternalLink className="size-3.5 opacity-60" />
                      </Link>
                    </SheetClose>
                  </div>
                </>
              </div>

              <div className="mt-auto space-y-2 px-4 pb-6">
                <ShareButton variant="outline" block size="default" />

                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <a href={`tel:${BUSINESS.phoneTel}`}>
                      <Phone className="size-4" />
                      {BUSINESS.phoneDisplay}
                    </a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
