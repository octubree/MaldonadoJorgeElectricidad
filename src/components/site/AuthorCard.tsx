import { ABOUT_BIO } from "@/components/site/data";
import { optimizeImage } from "@/lib/image-cdn";
import { BadgeCheck, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const PORTRAIT_URL = "https://ik.imagekit.io/tnzquipyu/sobre%20mi.png";

export function AuthorCard() {
  const avatarUrl = optimizeImage(PORTRAIT_URL, 160, true);

  return (
    <div className="mt-12 border-t border-border/40 pt-10">
      <div className="rounded-2xl border border-border/60 bg-muted/20 dark:bg-card/20 p-6 md:p-8 backdrop-blur-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left transition-all hover:border-primary/20 hover:bg-muted/30 dark:hover:bg-card/30">
        {/* Rounded avatar with gradient ring */}
        <div className="relative size-20 sm:size-24 shrink-0 rounded-full overflow-hidden border-2 border-primary/30 p-0.5 shadow-lg bg-background">
          <img
            src={avatarUrl}
            alt="Jorge Electricidad"
            loading="lazy"
            decoding="async"
            width={96}
            height={96}
            className="rounded-full w-full h-full object-cover aspect-square"
          />
        </div>

        {/* Content details */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-foreground tracking-tight">
                Escrito por Jorge
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-primary/90 tracking-wide uppercase">
                Técnico Electricista | Maldonado, Punta Del Este , Uruguay
              </p>
            </div>
            <Link
              href="/#sobre-mi"
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium mt-1 sm:mt-0 underline underline-offset-4"
            >
              Saber más sobre mí
            </Link>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty">
            {ABOUT_BIO}
          </p>

          {/* Quick tags */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/15">
              <BadgeCheck className="size-3.5" />
              Firma Autorizada UTE
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-muted border border-border text-muted-foreground">
              <MapPin className="size-3.5" />
              Maldonado & Punta del Este
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-muted border border-border text-muted-foreground">
              <Calendar className="size-3.5" />
              +5 años de experiencia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
