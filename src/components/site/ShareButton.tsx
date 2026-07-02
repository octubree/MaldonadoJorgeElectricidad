"use client";

import * as React from "react";
import { Share2, X, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BUSINESS } from "@/components/site/data";

/**
 * WhatsApp glyph (same SVG used by the floating WhatsApp button).
 */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.04 20.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.25-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42-.14 0-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

type ShareButtonProps = {
  /** Visual variant for the trigger button. */
  variant?: "solid" | "outline" | "ghost";
  /** Button size. */
  size?: "sm" | "default" | "lg";
  /** Render the trigger as a full-width block (useful in mobile menus). */
  block?: boolean;
  /** Optional className for the trigger. */
  className?: string;
  /** Hide the text label (icon only) — not recommended but available. */
  iconOnly?: boolean;
};

/**
 * Botón "Compartir" explícito con texto.
 *
 * Abre un modal con las opciones para compartir la web por WhatsApp,
 * copiar el link, o usar el Web Share API del navegador (en móviles).
 *
 * El texto del botón dice "Compartir" (no solo un ícono) porque muchos
 * usuarios no reconocen el ícono de share aislado.
 */
export function ShareButton({
  variant = "outline",
  size = "sm",
  block = false,
  className,
  iconOnly = false,
}: ShareButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Resolve the current URL on the client (avoids SSR/edge mismatches).
  const [shareUrl, setShareUrl] = React.useState("");
  const [shareText, setShareText] = React.useState("");

  React.useEffect(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    setShareUrl(url);
    setShareText(
      `Mirá la web de Jorge Electricidad — técnico electricista en Maldonado y Punta del Este. ${url}`
    );
  }, []);

  // ── WhatsApp share ────────────────────────────────────────────────────
  const whatsappHref = React.useMemo(() => {
    const text = encodeURIComponent(shareText);
    return `https://wa.me/?text=${text}`;
  }, [shareText]);

  // ── Native Web Share API (mobile) ─────────────────────────────────────
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleNativeShare = React.useCallback(async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: BUSINESS.name,
        text: "Técnico electricista en Maldonado y Punta del Este.",
        url: shareUrl,
      });
      setOpen(false);
    } catch {
      // user cancelled — keep modal open
    }
  }, [canNativeShare, shareUrl]);

  // ── Copy link ─────────────────────────────────────────────────────────
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the URL via a temporary input
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    }
  }, [shareUrl]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          className={className ?? (block ? "w-full" : undefined)}
          aria-label="Compartir esta página"
        >
          <Share2 className="size-4" />
          {!iconOnly && <span>Compartir</span>}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-border/70 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5 text-primary" />
            Compartir esta página
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Si conocés a alguien que necesite un electricista en Maldonado o
            Punta del Este, compartile mi web.
          </p>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          {/* WhatsApp — primary action */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/40 transition-colors hover:bg-primary/90"
          >
            <WhatsAppGlyph className="size-5" />
            Compartir por WhatsApp
          </a>

          {/* Native share (mobile only) */}
          {canNativeShare && (
            <div>
              <Button
                type="button"
                variant="outline"
                block
                onClick={handleNativeShare}
                className="w-full justify-center gap-2"
              >
                <Share2 className="size-4" />
                Más opciones (mensaje, email…)
              </Button>
            </div>
          )}

          {/* Copy link */}
          <Button
            type="button"
            variant="outline"
            block
            onClick={handleCopy}
            className="w-full justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="size-4 text-primary" />
                ¡Link copiado!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copiar link
              </>
            )}
          </Button>

          {/* URL preview */}
          <div className="mt-1 flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2">
            <span className="truncate text-xs text-muted-foreground">
              {shareUrl || "https://jorge-electricidad.net"}
            </span>
          </div>
        </div>

        {/* Close affordance */}
        <div className="mt-1 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
