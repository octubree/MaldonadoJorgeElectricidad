"use client";

import * as React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  GALLERY_FILTERS,
  GALLERY_ITEMS,
  type GalleryCategory,
  type GalleryItem,
} from "@/components/site/data";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SafeImage } from "@/components/ui/safe-image";
import { optimizeImage } from "@/lib/image-cdn";

type ApiPhoto = {
  id: string;
  imageUrl: string;
  category: GalleryCategory;
  altText: string;
};

/**
 * Convert API response (uses `imageUrl` + `altText`) into the gallery
 * item shape used by the local filter logic (`src`, `title`,
 * `description`). The category is already a display label (the API does
 * the slug→label conversion), so we keep it as-is.
 */
function toGalleryItem(p: ApiPhoto): GalleryItem {
  return {
    id: p.id,
    imageUrl: p.imageUrl,
    altText: p.altText,
    category: p.category as Exclude<GalleryCategory, "Todas">,
    description: p.altText,
  };
}

export function Gallery() {
  const [filter, setFilter] = React.useState<GalleryCategory>("Todas");
  const [selected, setSelected] = React.useState<GalleryItem | null>(null);
  const [items, setItems] = React.useState<GalleryItem[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/photos?_=${Date.now()}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { photos?: ApiPhoto[] };
        if (cancelled) return;
        const photos = data.photos ?? [];
        // Always have something to show: fall back to local samples if empty.
        const mapped = photos.length > 0 ? photos.map(toGalleryItem) : GALLERY_ITEMS;
        setItems(mapped);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setItems(GALLERY_ITEMS);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = React.useMemo(() => {
    if (!items) return [];
    return filter === "Todas"
      ? items
      : items.filter((i) => i.category === filter);
  }, [filter, items]);

  const handlePrev = React.useCallback(() => {
    if (!selected || filtered.length <= 1) return;
    const currentIndex = filtered.findIndex((i) => i.id === selected.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    setSelected(filtered[prevIndex]);
  }, [selected, filtered]);

  const handleNext = React.useCallback(() => {
    if (!selected || filtered.length <= 1) return;
    const currentIndex = filtered.findIndex((i) => i.id === selected.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filtered.length;
    setSelected(filtered[nextIndex]);
  }, [selected, filtered]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, handlePrev, handleNext]);

  return (
    <section id="trabajos" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title="Trabajos Realizados"
          subtitle="Una selección de instalaciones y proyectos: tableros, iluminación, domótica, cámaras y más."
        />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filtrar trabajos por categoría"
        >
          {GALLERY_FILTERS.map((f) => {
            const isActive = f === filter;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary/50 text-primary-foreground"
                    : "border-border/70 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="gallery-filter"
                    className="absolute inset-0 -z-10 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {f}
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3"
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.button
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSelected(item)}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-card text-left transition-all duration-300",
                      "hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    )}
                    aria-label={`Ver ${item.altText}`}
                  >
                    <SafeImage
                      src={item.imageUrl}
                      optimizeWidth={500}
                      alt={item.altText}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* category badge */}
                    <div className="absolute left-3 top-3">
                      <Badge
                        variant="outline"
                        className="border-white/20 bg-black/40 text-[11px] text-white backdrop-blur-sm"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </LayoutGroup>
      </div>

      {/* Lightbox */}
      <Dialog
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="max-w-3xl border-border/70 bg-background/95 p-0 backdrop-blur-xl sm:max-w-3xl">
          {selected && (
            <>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg bg-zinc-950/60 flex items-center justify-center sm:aspect-[16/9]">
                {/* Lightbox uses the ORIGINAL (full-resolution) URL and displays it fully without cropping */}
                <img
                  src={selected.imageUrl}
                  alt={selected.altText}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute left-4 top-4">
                  <Badge className="bg-primary/90 text-primary-foreground">
                    {selected.category}
                  </Badge>
                </div>

                {/* Navigation arrows */}
                {filtered.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/75 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/75 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  </>
                )}
              </div>
              <DialogHeader className="px-6 pb-6 pt-4">
                <DialogTitle className="text-xl">{selected.altText}</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  {selected.description ?? selected.altText}
                </DialogDescription>
                <div className="mt-4">
                  <DialogClose asChild>
                    <a
                      href="#contacto"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Consultar por este servicio
                    </a>
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
