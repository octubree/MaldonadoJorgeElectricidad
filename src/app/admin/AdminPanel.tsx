"use client";

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  Lock,
  Plus,
  Save,
  Trash2,
  ShieldAlert,
  ImagePlus,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { optimizeImage } from "@/lib/image-cdn";
import {
  CATEGORY_SLUGS,
  type GalleryCategory,
} from "@/components/site/data";

/** Google "G" SVG logo for the sign-in button. */
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V6.958H.957C.347 8.173 0 9.548 0 11s.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 5.042L3.964 7.374C4.672 5.247 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

type Photo = {
  id: string;
  imageUrl: string;
  category: GalleryCategory;
  altText: string;
};

type FetchState = {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  demo: boolean;
};

const CATEGORY_OPTIONS = Object.entries(CATEGORY_SLUGS) as Array<
  [Exclude<GalleryCategory, "Todas">, string]
>;

/** Slug → display label map (reverse of CATEGORY_SLUGS). */
const SLUG_TO_LABEL: Record<string, GalleryCategory> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([label, slug]) => [slug, label])
);

export function AdminPanel({ authConfigured }: { authConfigured: boolean }) {
  const { data: session, status } = useSession();
  const [state, setState] = React.useState<FetchState>({
    photos: [],
    loading: true,
    error: null,
    demo: false,
  });
  const [reload, setReload] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(`/api/photos?_=${Date.now()}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo cargar el portfolio");
        const data = (await res.json()) as {
          photos?: Photo[];
          demo?: boolean;
        };
        if (cancelled) return;
        setState({
          photos: data.photos ?? [],
          loading: false,
          error: null,
          demo: Boolean(data.demo),
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          photos: [],
          loading: false,
          error: err?.message ?? "Error al cargar",
          demo: false,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  // ── Not configured ──────────────────────────────────────────────────
  if (!authConfigured) {
    return <NotConfiguredPanel />;
  }

  // ── Loading session ─────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Not authenticated ───────────────────────────────────────────────
  if (status === "unauthenticated" || !session?.user) {
    return <SignInPanel />;
  }

  const email = session.user.email?.trim().toLowerCase();
  if (email !== "sixtamux@gmail.com") {
    return <DeniedPanel email={session.user.email ?? "?"} />;
  }

  // ── Authenticated admin ─────────────────────────────────────────────
  return (
    <AdminContent
      state={state}
      email={session.user.email ?? "sixtamux@gmail.com"}
      onReload={() => setReload((n) => n + 1)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

function NotConfiguredPanel() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Card className="border-primary/40 bg-card/70">
        <CardHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <ShieldAlert className="size-6" />
          </div>
          <CardTitle className="text-2xl">Configuración pendiente</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Falta configurar las credenciales de Google OAuth para activar el
            acceso al panel. Agregá estas variables en el archivo{" "}
            <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">
              .env
            </code>{" "}
            y luego recargá la página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/70 bg-background/60 p-4 font-mono text-xs leading-relaxed">
            <p className="text-muted-foreground"># NextAuth + Google OAuth</p>
            <p>GOOGLE_CLIENT_ID=</p>
            <p>GOOGLE_CLIENT_SECRET=</p>
            <p>NEXTAUTH_SECRET=</p>
            <p>NEXTAUTH_URL=http://localhost:3000</p>
            <p className="mt-3 text-muted-foreground"># Firebase (para fotos)</p>
            <p>FIREBASE_SERVICE_ACCOUNT_KEY=</p>
            <p className="mt-3 text-muted-foreground"># Resend (contacto)</p>
            <p>RESEND_API_KEY=</p>
            <p>TO_EMAIL=sixtamux@gmail.com</p>
            <p>FROM_EMAIL=web@jorge-electricidad.net</p>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="size-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SignInPanel() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <Lock className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Administración de Portfolio
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Acceso exclusivo para el administrador. Iniciá sesión con tu cuenta
          de Google autorizada.
        </p>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          size="lg"
          variant="outline"
          className="mt-8 w-full border-border/70 bg-background hover:bg-secondary/60"
        >
          <GoogleG />
          Iniciar sesión con Google
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Solo autorizado para{" "}
          <span className="font-medium text-foreground">
            sixtamux@gmail.com
          </span>
        </p>
      </motion.div>
    </div>
  );
}

function DeniedPanel({ email }: { email: string }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive ring-1 ring-destructive/30">
        <ShieldAlert className="size-6" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Acceso denegado
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        La cuenta{" "}
        <span className="font-medium text-foreground">{email}</span> no está
        autorizada para acceder a este panel.
      </p>
      <Button
        onClick={() => signOut({ callbackUrl: "/admin" })}
        variant="outline"
        className="mt-8"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Authenticated admin content                                         */
/* ------------------------------------------------------------------ */

function AdminContent({
  state,
  email,
  onReload,
}: {
  state: FetchState;
  email: string;
  onReload: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Administración de Portfolio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sesión:{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          variant="destructive"
        >
          <LogOut className="size-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Demo banner */}
      <AnimatePresence>
        {state.demo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
              <strong className="font-semibold">Modo demo:</strong> Firebase no
              está configurado. Las fotos que subas{" "}
              <span className="font-semibold">no se guardarán</span>. Configurá{" "}
              <code className="rounded bg-amber-500/20 px-1 py-0.5 text-xs">
                FIREBASE_SERVICE_ACCOUNT_KEY
              </code>{" "}
              en <code className="text-xs">.env</code> para activar la
              persistencia.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add form */}
      <AddPhotoCard demo={state.demo} onCreated={onReload} />

      {/* Existing photos */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Fotos Existentes
          </h2>
          <Button variant="ghost" size="sm" onClick={onReload}>
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        </div>
        <PhotosGrid state={state} onReload={onReload} />
      </div>
    </div>
  );
}

function AddPhotoCard({
  demo,
  onCreated,
}: {
  demo: boolean;
  onCreated: () => void;
}) {
  const [imageUrl, setImageUrl] = React.useState("");
  const [category, setCategory] = React.useState<string>("filter-luminarias");
  const [altText, setAltText] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !altText.trim()) {
      toast.error("Completá la URL y el texto alternativo.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, category, altText: altText.trim() }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(err?.error ?? "No se pudo subir la foto");
      }
      toast.success("Foto agregada al portfolio.");
      setImageUrl("");
      setAltText("");
      setCategory("filter-luminarias");
      onCreated();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al subir la foto"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mt-6 border-primary/40 bg-card/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImagePlus className="size-5 text-primary" />
          Agregar foto al portfolio
        </CardTitle>
        <CardDescription>
          Pegá la URL de la imagen (idealmente subida a un CDN como ImageKit o
          Sirv) y elegí la categoría correspondiente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSubmit}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-url">URL de la imagen</Label>
            <Input
              id="add-url"
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(([label, slug]) => (
                  <SelectItem key={slug} value={slug}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-alt">Texto alternativo</Label>
            <Input
              id="add-alt"
              type="text"
              placeholder="Ej: Tablero eléctrico residencial"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <Button type="submit" disabled={saving || demo} className="w-full lg:w-auto">
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Subir
          </Button>
        </form>
        {demo && (
          <p className="mt-3 text-xs text-muted-foreground">
            Botón deshabilitado en modo demo (Firebase no configurado).
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PhotosGrid({
  state,
  onReload,
}: {
  state: FetchState;
  onReload: () => void;
}) {
  if (state.loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
        {state.error}
      </div>
    );
  }

  if (state.photos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No hay fotos. Subí la primera arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {state.photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onReload={onReload} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function PhotoCard({
  photo,
  onReload,
}: {
  photo: Photo;
  onReload: () => void;
}) {
  const [altText, setAltText] = React.useState(photo.altText);
  const [category, setCategory] = React.useState<string>(
    CATEGORY_SLUGS[photo.category] ?? "filter-afines"
  );
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    setAltText(photo.altText);
  }, [photo.altText]);

  React.useEffect(() => {
    setCategory(CATEGORY_SLUGS[photo.category] ?? "filter-afines");
  }, [photo.category]);

  const dirty =
    altText !== photo.altText ||
    category !== (CATEGORY_SLUGS[photo.category] ?? "filter-afines");

  const onSave = async () => {
    if (!altText.trim()) {
      toast.error("El texto alternativo no puede estar vacío.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: altText.trim(),
          category,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(err?.error ?? "No se pudo guardar");
      }
      toast.success("Cambios guardados.");
      onReload();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al guardar los cambios"
      );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(err?.error ?? "No se pudo eliminar");
      }
      toast.success("Foto eliminada.");
      onReload();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar la foto"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60"
    >
      <div className="relative h-48 w-full overflow-hidden bg-background">
        <img
          src={optimizeImage(photo.imageUrl, 300)}
          alt={photo.altText}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-[10px] font-mono text-muted-foreground">
          ID: <span className="text-foreground/80">{photo.id}</span>
        </p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`alt-${photo.id}`} className="text-xs text-muted-foreground">
            Texto alternativo
          </Label>
          <Input
            id={`alt-${photo.id}`}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`cat-${photo.id}`} className="text-xs text-muted-foreground">
            Categoría
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id={`cat-${photo.id}`} className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map(([label, slug]) => (
                <SelectItem key={slug} value={slug}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button
            onClick={onSave}
            size="sm"
            disabled={saving || !dirty}
            className="flex-1"
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            Guardar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                disabled={deleting}
                aria-label="Eliminar foto"
              >
                {deleting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar esta foto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La foto{" "}
                  <span className="font-medium text-foreground">
                    {photo.altText}
                  </span>{" "}
                  se eliminará permanentemente del portfolio.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className={cn("bg-destructive text-white hover:bg-destructive/90")}
                >
                  Sí, eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
