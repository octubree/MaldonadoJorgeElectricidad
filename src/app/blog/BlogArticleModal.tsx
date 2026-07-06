"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/components/site/data";

export function BlogArticleModal({ post }: { post: BlogPost }) {
  const router = useRouter();

  return (
    <Dialog defaultOpen={true} onOpenChange={(open) => {
      if (!open) {
        router.back();
      }
    }}>
      <DialogContent className="max-h-[90vh] max-w-[95vw] md:max-w-5xl overflow-y-auto border-border/70 bg-background/95 p-6 md:p-8 backdrop-blur-xl">
        <DialogHeader className="pb-4 border-b border-border/40 text-left">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {post.date}
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-primary">
            {post.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Artículo del blog Electricidad para Todos
          </DialogDescription>
          <div className="mt-4 text-left">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ ...props }) => (
                  <h1 className="mt-6 mb-3 text-2xl font-bold text-foreground" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="mt-5 mb-2 text-xl font-semibold text-foreground" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="mt-4 mb-2 text-lg font-semibold text-foreground" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="mb-4 list-disc pl-6 space-y-1 text-muted-foreground" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="mb-4 list-decimal pl-6 space-y-1 text-muted-foreground" {...props} />
                ),
                li: ({ ...props }) => <li className="mb-1 text-sm sm:text-base" {...props} />,
                strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                em: ({ ...props }) => <em className="italic" {...props} />,
                a: ({ ...props }) => (
                  <a className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                img: ({ alt, ...props }) => (
                  <img className="my-4 mx-auto max-h-72 rounded-lg object-cover" alt={alt || ""} {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote className="my-4 border-l-4 border-primary/50 pl-4 italic text-muted-foreground" {...props} />
                ),
              }}
            >
              {post.body.join("\n\n")}
            </ReactMarkdown>
          </div>
          <div className="mt-6">
            <DialogClose asChild>
              <Button asChild>
                <Link href="/#contacto">Consultar por este tema</Link>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
