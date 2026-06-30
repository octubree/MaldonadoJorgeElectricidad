"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Floating "Scroll to Top" button.
 * Appears after scrolling down 400px.
 * Positioned on the bottom-right, just above the WhatsApp button.
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed bottom-[5.5rem] right-6 z-50 flex size-11 items-center justify-center rounded-full border border-primary/20 bg-background/80 text-muted-foreground shadow-lg shadow-black/25 backdrop-blur-md transition-colors hover:bg-background hover:text-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:bottom-[6.5rem] sm:right-7.5"
              aria-label="Subir al inicio"
            >
              <ArrowUp className="size-5" />
              <span className="sr-only">Subir al inicio</span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            sideOffset={8}
            className="border-border/70 bg-card/95 text-foreground backdrop-blur-md"
          >
            Volver arriba
          </TooltipContent>
        </Tooltip>
      )}
    </AnimatePresence>
  );
}
