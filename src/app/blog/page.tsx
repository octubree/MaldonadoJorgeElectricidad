import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BLOG_POSTS,
  BUSINESS,
} from "@/components/site/data";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";

export const metadata: Metadata = {
  title: "Blog — Electricidad para Todos",
  description:
    "Electricidad para Todos — artículos y consejos sobre instalaciones eléctricas, normativa UTE, aumentos de potencia y seguridad en Maldonado y Punta del Este.",
  keywords: [
    "blog electricidad",
    "aumento de potencia UTE",
    "firma instalador UTE",
    "inspección eléctrica",
    "electricista Maldonado",
    "electricista Punta del Este",
    "Jorge Electricidad",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Electricidad para Todos | Jorge Electricidad",
    description:
      "Artículos y consejos sobre electricidad, instalaciones y normativas UTE.",
    url: "https://jorge-electricidad.net/blog",
    siteName: "Jorge Electricidad",
    type: "article",
    locale: "es_UY",
    images: [
      {
        url: "https://ellwinan.sirv.com/electricidad.png?profile=Example&w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "Blog — Electricidad para Todos | Jorge Electricidad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Electricidad para Todos | Jorge Electricidad",
    description:
      "Artículos y consejos sobre electricidad, instalaciones y normativas UTE.",
    images: [
      "https://ellwinan.sirv.com/electricidad.png?profile=Example&w=1200&h=630",
    ],
  },
};

// ── JSON-LD: Blog + Article schema para SEO ─────────────────────────────
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Electricidad para Todos",
  description:
    "Artículos y consejos sobre electricidad, instalaciones y normativas UTE.",
  url: "https://jorge-electricidad.net/blog",
  inLanguage: "es-UY",
  publisher: {
    "@type": "Electrician",
    name: "Jorge Electricidad",
    telephone: "+59894588012",
    url: "https://jorge-electricidad.net",
  },
};

export default function BlogPage() {
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const allPosts = BLOG_POSTS;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* JSON-LD: Blog schema para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {/* Compact top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/50 bg-background/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground shadow-[0_0_12px_oklch(0.72_0.19_162_/_0.15)] transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_oklch(0.72_0.19_162_/_0.4)]"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Volver al inicio
          </Link>
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            {BUSINESS.phoneDisplay}
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-10 sm:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, oklch(0.72 0.19 162 / 16%) 0%, oklch(0.72 0.19 162 / 4%) 35%, transparent 70%)",
            }}
          />
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="h-px w-6 bg-primary/50" />
              Blog
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              Electricidad para Todos
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              Artículos y consejos sobre electricidad, instalaciones y
              normativas UTE. Comparto lo que aprendí en el oficio para que
              tus decisiones sean más seguras.
            </p>
          </div>
        </section>

        {/* Featured */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/blog/post/${featured.id}`}
            scroll={false}
            className="group block w-full overflow-hidden rounded-2xl border border-border/70 bg-card/60 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 p-6 sm:p-8 md:p-10 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary ring-1 ring-primary/30">
                Artículo destacado
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {featured.date}
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl text-primary group-hover:underline">
              {featured.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base md:text-lg max-w-4xl">
              {featured.excerpt}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Leer más
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </section>



        {/* Full archive — visible to crawlers */}
        <section
          aria-label="Archivo completo de artículos"
          className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
        >
          <h2 className="text-lg font-semibold tracking-tight text-muted-foreground">
            Todos los artículos
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {allPosts.map((post) => (
              <li key={post.id} className="flex flex-col">
                <Link
                  href={`/blog/post/${post.id}`}
                  scroll={false}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 p-6"
                >
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="size-3.5 text-primary" />
                      <CalendarDays className="size-3.5" />
                      {post.date}
                    </div>
                    <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-primary group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                      Leer artículo
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
                {/* Hidden full content for crawlers */}
                <div className="sr-only">
                  {post.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              ¿Necesitás ayuda con tu instalación?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Estoy en Maldonado y Punta del Este. Escribime y te respondo a la
              brevedad.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/#contacto">Contactarme</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  );
}
