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
          subtitle={TESTIMONIALS_INTRO}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className={cn("mx-auto mt-12 max-w-5xl px-2")}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((t) => (
                <CarouselItem
                  key={t.id}
                  className="basis-full pl-4 sm:basis-1/2 lg:basis-1/2"
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
              href="https://www.google.com/search?q=Jorge+Electricidad+Maldonado"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="size-4 text-primary" fill="currentColor" />
              Ver en Google
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
