import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  firestore,
  isFirebaseConfigured,
  portfolioCollection,
} from "@/lib/firebase-admin";
import {
  ADMIN_EMAIL,
  CATEGORY_SLUG_LIST,
  GALLERY_ITEMS,
  SLUG_TO_CATEGORY,
  type GalleryCategory,
} from "@/components/site/data";

/**
 * Firestore document shape (matches the original Firebase structure).
 */
type FirestorePortfolioItem = {
  imageUrl: string;
  category: string;
  altText: string;
  timestamp?: FirebaseFirestore.Timestamp | null;
};

/**
 * Public type returned by the API — `category` is converted from the
 * stored slug (`filter-luminarias`, …) into a human-readable label
 * (`Luminarias`, …) so the gallery filter logic stays simple.
 */
export type PortfolioPhoto = {
  id: string;
  imageUrl: string;
  category: GalleryCategory;
  altText: string;
};

/**
 * Sample items use local /images paths and human-readable categories
 * already. We just project them into the same shape.
 */
function samplePhotos(): PortfolioPhoto[] {
  return GALLERY_ITEMS.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    category: item.category,
    altText: item.altText,
  }));
}

/**
 * Convert a raw Firestore doc into a PortfolioPhoto.
 * Falls back to the "Todas"-unfiltered display label by reading the slug
 * map; unknown slugs become "Afines" (a safe default).
 */
function toPortfolioPhoto(
  id: string,
  data: FirestorePortfolioItem
): PortfolioPhoto {
  const label = SLUG_TO_CATEGORY[data.category] ?? "Afines";
  return {
    id,
    imageUrl: data.imageUrl ?? "",
    category: label as GalleryCategory,
    altText: data.altText ?? "",
  };
}

/**
 * GET /api/photos
 * Public. Returns the full portfolio ordered by `timestamp` desc.
 *
 * If Firebase isn't configured (no service account key in env), we
 * return the local sample photos so the public site always looks good.
 */
export async function GET() {
  if (!isFirebaseConfigured || !firestore) {
    return NextResponse.json({
      photos: samplePhotos(),
      demo: true,
    });
  }

  try {
    const col = portfolioCollection();
    if (!col) {
      return NextResponse.json({
        photos: samplePhotos(),
        demo: true,
      });
    }

    const snapshot = await col.orderBy("timestamp", "desc").get();

    if (snapshot.empty) {
      return NextResponse.json({ photos: [], demo: false });
    }

    const photos = snapshot.docs.map((doc) => {
      const data = doc.data() as FirestorePortfolioItem;
      return toPortfolioPhoto(doc.id, data);
    });

    return NextResponse.json({ photos, demo: false });
  } catch (e) {
    console.error("[photos] GET error:", e);
    // Degrade gracefully to sample data on any Firestore error.
    return NextResponse.json(
      { photos: samplePhotos(), demo: true },
      { status: 200 }
    );
  }
}

const createSchema = z.object({
  imageUrl: z.string().url("La URL de la imagen no es válida"),
  category: z.enum(CATEGORY_SLUG_LIST as [string, ...string[]]),
  altText: z
    .string()
    .min(2, "El texto alternativo debe tener al menos 2 caracteres"),
});

/**
 * POST /api/photos
 * Admin only. Creates a new portfolio item with serverTimestamp().
 */
export async function POST(req: Request) {
  // ── Auth gate ───────────────────────────────────────────────────────
  let session: Awaited<ReturnType<typeof getServerSession>>;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error("[photos] session error:", e);
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const email = session?.user?.email?.trim().toLowerCase();
  if (!email || email !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // ── Body validation ─────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos inválidos",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // ── Firebase configured? ────────────────────────────────────────────
  if (!isFirebaseConfigured || !firestore) {
    return NextResponse.json(
      {
        error:
          "Firebase no configurado. Configurá FIREBASE_SERVICE_ACCOUNT_KEY en .env para guardar fotos.",
      },
      { status: 503 }
    );
  }

  try {
    // Lazy import so we don't pull FieldValue at module load if Firebase
    // isn't configured.
    const { FieldValue } = await import("firebase-admin/firestore");

    const col = portfolioCollection();
    if (!col) {
      return NextResponse.json(
        { error: "Firebase no disponible" },
        { status: 503 }
      );
    }

    const docRef = await col.add({
      imageUrl: parsed.data.imageUrl,
      category: parsed.data.category,
      altText: parsed.data.altText,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, success: true });
  } catch (e) {
    console.error("[photos] POST error:", e);
    return NextResponse.json(
      { error: "No se pudo guardar la foto" },
      { status: 500 }
    );
  }
}
