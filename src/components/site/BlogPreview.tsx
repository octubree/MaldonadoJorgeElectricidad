"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { BLOG_POSTS, type BlogPost } from "@/components/site/data";
import { SectionHeading } from "@/components/site/SectionHeading";

function ArticleBody({ post }: { post: BlogPost }) {
  return (
    <div className="space-y-4">
      {post.body.map((para, i) => (
        <p key={i} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {para}
        </p>
      ))}
    </div>
  );
}

export function BlogPreview() {
  const [selected, setSelected] = React.useState<BlogPost | null>(null);
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const recent = BLOG_POSTS.filter((p) => p.id !== featured.id).slice(0, 3);

  return (
    <section id="blog" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blog"
          title="Electricidad para Todos"
          subtitle="Artículos y consejos sobre electricidad, instalaciones y normativas UTE."
        />

        {/* Featured article */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          onClick={() => setSelected(featured)}
          className="group mt-12 grid w-full gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card/60 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
            <Image
              src="/images/blog-ute.png"
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r"
            />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary ring-1 ring-primary/30">
                Artículo destacado
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {featured.date}
              </span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {featured.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
              {featured.excerpt}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Leer más
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.button>

        {/* Recent articles grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {recent.map((post, i) => (
            <motion.button
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              onClick={() => setSelected(post)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/images/blog-ute.png"
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="size-3.5 text-primary" />
                  <CalendarDays className="size-3.5" />
                  {post.date}
                </div>
                <h4 className="line-clamp-2 text-base font-semibold tracking-tight">
                  {post.title}
                </h4>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                  Leer artículo
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Article dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto border-border/70 bg-background/95 p-0 backdrop-blur-xl sm:max-w-2xl">
          {selected && (
            <>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                <Image
                  src="/images/blog-ute.png"
                  alt={selected.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent"
                />
              </div>
              <DialogHeader className="px-6 pb-6 pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {selected.date}
                </div>
                <DialogTitle className="text-xl sm:text-2xl">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Artículo del blog Electricidad para Todos
                </DialogDescription>
                <div className="mt-3">
                  <ArticleBody post={selected} />
                </div>
                <div className="mt-6">
                  <DialogClose asChild>
                    <Button asChild>
                      <a href="#contacto">Consultar por este tema</a>
                    </Button>
                  </DialogClose>
                </div>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
