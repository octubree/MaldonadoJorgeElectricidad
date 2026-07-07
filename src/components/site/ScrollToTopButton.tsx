"use client";

import * as React from "react";
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`fixed bottom-[5.5rem] right-6 z-50 flex flex-col items-center gap-1 sm:bottom-[6.5rem] sm:right-7.5 transition-all duration-200 ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-75 opacity-0"
          }`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-background/90 px-1.5 py-0.5 rounded-md border border-border/40 shadow-xs select-none pointer-events-none">
            Subir
          </span>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex size-11 items-center justify-center rounded-full border border-primary/20 bg-background/80 text-muted-foreground shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-200 hover:bg-background hover:text-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Subir al inicio"
          >
            <ArrowUp className="size-5" />
            <span className="sr-only">Subir al inicio</span>
          </button>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={8}
        className="border-border/70 bg-card/95 text-foreground backdrop-blur-md"
      >
        Volver arriba
      </TooltipContent>
    </Tooltip>
  );
}
