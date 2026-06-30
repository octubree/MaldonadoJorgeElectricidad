"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Section eyebrow + title + subtitle block.
 * Animates in on scroll.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <div
        className={cn(
          "mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary",
          align === "center" && "justify-center"
        )}
      >
        <span className="h-px w-6 bg-primary/50" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/**
 * Wrapper that reveals its children with a fade-up on scroll.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
