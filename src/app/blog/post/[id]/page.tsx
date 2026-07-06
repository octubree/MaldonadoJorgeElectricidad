import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { CalendarDays, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { BLOG_POSTS, BUSINESS } from "@/components/site/data";
import { findPostBySlug } from "../../utils";
import { AuthorCard } from "@/components/site/AuthorCard";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { id } = await props.params;
  const post = findPostBySlug(id);

  if (!post) {
    return {
      title: "Artículo no encontrado — Jorge Electricidad",
      description: "El artículo solicitado no existe.",
    };
  }

  const title = `${post.title} — Blog | Jorge Electricidad`;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/post/${post.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://jorge-electricidad.net/blog/post/${post.id}`,
      siteName: "Jorge Electricidad",
      type: "article",
      locale: "es_UY",
      images: [
        {
          url: "https://ellwinan.sirv.com/electricidad.png?profile=Example&w=1200&h=630",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        "https://ellwinan.sirv.com/electricidad.png?profile=Example&w=1200&h=630",
      ],
    },
  };
}

export default async function PostPage(props: { params: Params }) {
  const { id } = await props.params;
  const post = findPostBySlug(id);

  if (!post) {
    notFound();
  }

  const dateParts = post.date.split("/");
  const isoDate = dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: isoDate,
    author: {
      "@type": "Person",
      name: "Jorge Electricidad",
    },
    publisher: {
      "@type": "Organization",
      name: "Jorge Electricidad",
      logo: {
        "@type": "ImageObject",
        url: "https://ellwinan.sirv.com/electricidad.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://jorge-electricidad.net/blog/post/${post.id}`,
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Compact top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Volver al blog
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
        <article className="mx-auto max-w-4xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-6 border-b border-border/40 text-left">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {post.date}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-3 text-primary text-pretty leading-[1.15]">
              {post.title}
            </h1>
          </div>

          {/* Body */}
          <div className="mt-8">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ ...props }) => (
                  <h1 className="mt-8 mb-4 text-3xl font-bold text-foreground tracking-tight" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="mt-7 mb-3 text-2xl font-semibold text-foreground tracking-tight" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="mt-6 mb-2 text-xl font-semibold text-foreground" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground sm:text-lg" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="mb-5 list-disc pl-6 space-y-2 text-muted-foreground text-base sm:text-lg" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="mb-5 list-decimal pl-6 space-y-2 text-muted-foreground text-base sm:text-lg" {...props} />
                ),
                li: ({ ...props }) => <li className="mb-1 text-base sm:text-lg" {...props} />,
                strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                em: ({ ...props }) => <em className="italic" {...props} />,
                a: ({ ...props }) => (
                  <a className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                img: ({ alt, ...props }) => (
                  <img className="my-6 mx-auto max-h-[450px] rounded-2xl object-cover shadow-md" alt={alt || ""} {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground text-lg" {...props} />
                ),
              }}
            >
              {post.body.join("\n\n")}
            </ReactMarkdown>
          </div>

          <AuthorCard />
        </article>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
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
