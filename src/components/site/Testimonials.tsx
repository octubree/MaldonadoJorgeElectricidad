"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TESTIMONIALS, TESTIMONIALS_INTRO } from "@/components/site/data";
import { SectionHeading } from "@/components/site/SectionHeading";

function Stars() {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label="5 de 5 estrellas"
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4 text-primary"
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  name,
  initials,
  quote,
}: {
  name: string;
  initials: string;
  quote: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/30">
      <div>
        <div className="flex items-center justify-between">
          <Stars />
          <Quote className="size-7 text-primary/30" />
        </div>
        <p className="mt-4 text-base leading-relaxed text-foreground text-pretty">
          “{quote}”
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
        <Avatar className="size-10 ring-1 ring-primary/30">
          <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Opinión en Google
            <ExternalLink className="size-3" />
          </p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const isHovered = React.useRef(false);
  const isTouched = React.useRef(false);

  React.useEffect(() => {
    if (!api) return;

    setScrollSnaps(api.scrollSnapList());
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    let intervalId: NodeJS.Timeout;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (!isHovered.current && !isTouched.current) {
          api.scrollNext();
        }
      }, 4000);
    };

    startAutoplay();

    const onPointerDown = () => {
      isTouched.current = true;
    };
    const onPointerUp = () => {
      isTouched.current = false;
    };

    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);

    return () => {
      clearInterval(intervalId);
      api.off("select", onSelect);
      api.off("reInit", onSelect);
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
    };
  }, [api]);

  return (
    <section id="clientes" className="relative scroll-mt-20 py-20 sm:py-28">
      {/* background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-72 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, oklch(0.72 0.19 162 / 8%) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Clientes"
          title="Opiniones"
          subtitle={
            <span className="font-mono text-sm sm:text-base leading-relaxed text-muted-foreground/90 max-w-xl mx-auto block italic">
              “{TESTIMONIALS_INTRO}”
            </span>
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className={cn("mx-auto mt-12 max-w-5xl px-2")}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
            onMouseEnter={() => {
              isHovered.current = true;
            }}
            onMouseLeave={() => {
              isHovered.current = false;
            }}
            onTouchStart={() => {
              isTouched.current = true;
            }}
            onTouchEnd={() => {
              isTouched.current = false;
            }}
          >
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((t) => (
                <CarouselItem
                  key={t.id}
                  className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/2"
                >
                  <div className="h-full">
                    <TestimonialCard
                      name={t.name}
                      initials={t.initials}
                      quote={t.quote}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 hidden size-9 border-border/70 bg-background/80 backdrop-blur-md sm:flex" />
            <CarouselNext className="right-1 hidden size-9 border-border/70 bg-background/80 backdrop-blur-md sm:flex" />
          </Carousel>

          {/* Indicadores de diapositivas (Dots) */}
          {scrollSnaps.length > 0 && (
            <div className="mt-8 flex justify-center gap-2">
              {scrollSnaps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
                    idx === selectedIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-primary/20 hover:bg-primary/45"
                  )}
                  aria-label={`Ir al comentario ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Button asChild variant="outline" className="border-border/70">
            <a
              href="https://share.google/yUZaIMDzv1xoNp3Zm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="size-4 text-primary" fill="currentColor" />
              Ver comentarios en Google
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
