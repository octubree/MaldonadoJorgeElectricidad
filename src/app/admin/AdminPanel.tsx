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
  Search,
  Zap,
  Lightbulb,
  Wrench,
  FileCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  Edit3,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/ui/safe-image";

import {
  CATEGORY_SLUGS,
  type GalleryCategory,
} from "@/components/site/data";

/** Google "G" SVG logo for sign-in. */
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

const CATEGORIES: Array<{
  label: Exclude<GalleryCategory, "Todas">;
  slug: string;
  icon: LucideIcon;
  color: string;
}> = [
  { label: "Electricidad", slug: "filter-electricidad", icon: Zap, color: "text-amber-400 border-amber-400/40 bg-amber-500/10" },
  { label: "Luminarias", slug: "filter-luminarias", icon: Lightbulb, color: "text-yellow-400 border-yellow-400/40 bg-yellow-500/10" },
  { label: "Afines", slug: "filter-afines", icon: Wrench, color: "text-emerald-400 border-emerald-400/40 bg-emerald-500/10" },
  { label: "Firma UTE", slug: "filter-firma-ute", icon: FileCheck, color: "text-cyan-400 border-cyan-400/40 bg-cyan-500/10" },
  { label: "Cámaras", slug: "filter-camaras-seguridad", icon: Camera, color: "text-purple-400 border-purple-400/40 bg-purple-500/10" },
];

export function AdminPanel({ authConfigured }: { authConfigured: boolean }) {
  const { data: session, status } = useSession();
  const [state, setState] = React.useState<FetchState>({
    photos: [],
    loading: true,
    error: null,
    demo: false,
  });
  const [reload, setReload] = React.useState(0);

  const fetchPhotos = React.useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(`/api/photos?_=${Date.now()}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo cargar el portfolio");
        const data = (await res.json()) as {
          photos?: Photo[];
          demo?: boolean;
        };
        setState({
          photos: data.photos ?? [],
          loading: false,
          error: null,
          demo: Boolean(data.demo),
        });
      })
      .catch((err) => {
        setState({
          photos: [],
          loading: false,
          error: err?.message ?? "Error al cargar",
          demo: false,
        });
      });
  }, []);

  React.useEffect(() => {
    fetchPhotos();
  }, [reload, fetchPhotos]);

  if (!authConfigured) {
    return <NotConfiguredPanel />;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return <SignInPanel />;
  }

  const email = session.user.email?.trim().toLowerCase();
  if (email !== "sixtamux@gmail.com") {
    return <DeniedPanel email={session.user.email ?? "?"} />;
  }

  return (
    <AdminContent
      state={state}
      email={session.user.email ?? "sixtamux@gmail.com"}
      onReload={() => setReload((n) => n + 1)}
    />
  );
}

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
            Falta configurar las credenciales de Google OAuth para activar el acceso al panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="size-4" /> Reintentar
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
          Acceso exclusivo para el administrador. Iniciá sesión con tu cuenta de Google.
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
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Acceso denegado</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        La cuenta <span className="font-medium text-foreground">{email}</span> no está autorizada.
      </p>
      <Button onClick={() => signOut({ callbackUrl: "/admin" })} variant="outline" className="mt-8">
        <LogOut className="size-4" /> Cerrar sesión
      </Button>
    </div>
  );
}

function AdminContent({
  state,
  email,
  onReload,
}: {
  state: FetchState;
  email: string;
  onReload: () => void;
}) {
  const [search, setSearch] = React.useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<string>("all");
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [photoToDelete, setPhotoToDelete] = React.useState<Photo | null>(null);

  // New photo fields
  const [newUrl, setNewUrl] = React.useState("");
  const [newAlt, setNewAlt] = React.useState("");
  const [newCategorySlug, setNewCategorySlug] = React.useState<string>("filter-electricidad");
  const [savingAdd, setSavingAdd] = React.useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newAlt.trim()) {
      toast.error("Completá la URL y la descripción Alt.");
      return;
    }
    setSavingAdd(true);
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: newUrl.trim(),
          category: newCategorySlug,
          altText: newAlt.trim(),
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err?.error ?? "No se pudo agregar la foto");
      }
      toast.success("¡Foto agregada al portfolio!");
      setNewUrl("");
      setNewAlt("");
      setNewCategorySlug("filter-electricidad");
      setIsAddOpen(false);
      onReload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir la foto");
    } finally {
      setSavingAdd(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!photoToDelete) return;
    try {
      const res = await fetch(`/api/photos/${photoToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err?.error ?? "No se pudo eliminar");
      }
      toast.success("Foto eliminada correctamente.");
      setPhotoToDelete(null);
      onReload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const counts = React.useMemo(() => {
    const acc: Record<string, number> = {
      "filter-electricidad": 0,
      "filter-luminarias": 0,
      "filter-afines": 0,
      "filter-firma-ute": 0,
      "filter-camaras-seguridad": 0,
    };
    state.photos.forEach((p) => {
      const slug = CATEGORY_SLUGS[p.category];
      if (slug && acc[slug] !== undefined) {
        acc[slug]++;
      }
    });
    return acc;
  }, [state.photos]);

  const filteredPhotos = React.useMemo(() => {
    return state.photos.filter((p) => {
      const matchesSearch =
        p.imageUrl.toLowerCase().includes(search.toLowerCase()) ||
        p.altText.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const slug = CATEGORY_SLUGS[p.category];
      const matchesCategory =
        activeCategoryFilter === "all" || slug === activeCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [state.photos, search, activeCategoryFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-40 mb-8 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary flex items-center gap-2">
              <Zap className="size-5" /> Administración de Portfolio
            </h1>
            <p className="text-xs text-muted-foreground">
              Sesión: <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsAddOpen(true)}
              disabled={state.demo}
              className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <Plus className="size-4" />
              Agregar Foto Nueva
            </Button>
            <Button variant="outline" size="sm" onClick={onReload} disabled={state.loading}>
              <RefreshCw className={`size-4 ${state.loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button onClick={() => signOut({ callbackUrl: "/admin" })} variant="destructive" size="sm">
              <LogOut className="size-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Demo Warning */}
        {state.demo && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
            <strong>Modo demo:</strong> Firebase no está configurado en <code className="text-xs">.env</code>. Las fotos no se guardarán.
          </div>
        )}

        {/* Category Filters & Search */}
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-muted-foreground mr-2">Filtros:</span>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter("all")}
            className={`px-3 py-1 rounded-full border transition-all ${
              activeCategoryFilter === "all"
                ? "border-primary bg-primary/20 text-primary font-medium"
                : "border-border/70 bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas ({state.photos.length})
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategoryFilter === cat.slug;
            const count = counts[cat.slug] || 0;
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategoryFilter(cat.slug)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  isActive
                    ? "border-primary bg-primary/20 text-primary font-medium"
                    : "border-border/70 bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3" />
                {cat.label} ({count})
              </button>
            );
          })}
          <div className="ml-auto w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, URL o alt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      {state.loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 text-muted-foreground">
          <p className="text-sm">No hay fotos que coincidan con el filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo) => (
              <PhotoCardItem
                key={photo.id}
                photo={photo}
                onReload={onReload}
                onDeleteRequest={() => setPhotoToDelete(photo)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dialog Add Photo */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border-border/70 bg-card text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <ImagePlus className="size-5" /> Agregar Foto al Portfolio (Firebase)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pegá la URL de la imagen y elegí la categoría para publicarla inmediatamente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">URL de la imagen:</label>
              <Input
                placeholder="https://ik.imagekit.io/tnzquipyu/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
              />
            </div>

            {newUrl.trim() && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/70 bg-background">
                <SafeImage
                  src={newUrl.trim()}
                  alt="Vista previa"
                  className="size-full object-contain"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Texto Alternativo (SEO / Alt):</label>
              <Input
                placeholder="Ej: Instalación de tablero monofásico en Punta del Este"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Categoría:</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = newCategorySlug === cat.slug;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => setNewCategorySlug(cat.slug)}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-all ${
                        isSelected
                          ? cat.color + " ring-1 ring-primary/50"
                          : "border-border/70 bg-background/50 text-muted-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={savingAdd} className="bg-primary text-primary-foreground font-semibold">
                {savingAdd ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Guardar en Firebase
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <DialogContent className="border-border/70 bg-card text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="size-5" /> ¿Eliminar esta foto?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Esta acción eliminará la foto permanentemente de la base de datos de Firebase.
            </DialogDescription>
          </DialogHeader>

          {photoToDelete && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/70 bg-background">
              <SafeImage
                src={photoToDelete.imageUrl}
                alt={photoToDelete.altText}
                className="size-full object-contain"
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPhotoToDelete(null)}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} variant="destructive">
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PhotoCardItem({
  photo,
  onReload,
  onDeleteRequest,
}: {
  photo: Photo;
  onReload: () => void;
  onDeleteRequest: () => void;
}) {
  const [altText, setAltText] = React.useState(photo.altText);
  const [categorySlug, setCategorySlug] = React.useState<string>(
    CATEGORY_SLUGS[photo.category] ?? "filter-afines"
  );
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setAltText(photo.altText);
    setCategorySlug(CATEGORY_SLUGS[photo.category] ?? "filter-afines");
  }, [photo.altText, photo.category]);

  const dirty =
    altText !== photo.altText ||
    categorySlug !== (CATEGORY_SLUGS[photo.category] ?? "filter-afines");

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
          category: categorySlug,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err?.error ?? "No se pudo guardar");
      }
      toast.success("Foto actualizada.");
      onReload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-background">
        <SafeImage
          src={photo.imageUrl}
          optimizeWidth={300}
          alt={photo.altText}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2">
          <Badge className="bg-background/90 text-[10px] text-foreground border border-border/60 backdrop-blur-md">
            ID: {photo.id.slice(0, 8)}...
          </Badge>
        </div>

        <button
          type="button"
          onClick={onDeleteRequest}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg bg-destructive/90 text-destructive-foreground opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 shadow-md backdrop-blur-md"
          title="Eliminar foto"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Editable Alt */}
        <div className="mb-3 space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Edit3 className="size-3" /> Texto Alt (SEO):
          </label>
          <Input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="h-8 text-xs bg-background/60"
          />
        </div>

        {/* Quick Category Buttons */}
        <div className="mt-auto space-y-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Categoría / Filtro:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = categorySlug === cat.slug;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategorySlug(cat.slug)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? cat.color + " ring-1 ring-primary/50"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button if dirty */}
        {dirty && (
          <Button
            onClick={onSave}
            size="sm"
            disabled={saving}
            className="mt-3 w-full bg-primary font-semibold text-primary-foreground animate-pulse"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Guardar Cambios
          </Button>
        )}
      </div>
    </motion.div>
  );
}
