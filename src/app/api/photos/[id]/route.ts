import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  firestore,
  isFirebaseConfigured,
  portfolioCollection,
} from "@/lib/firebase-admin";
import { ADMIN_EMAIL, CATEGORY_SLUG_LIST } from "@/components/site/data";

const updateSchema = z.object({
  imageUrl: z.string().url().optional(),
  category: z.enum(CATEGORY_SLUG_LIST as [string, ...string[]]).optional(),
  altText: z.string().min(2).optional(),
});

async function requireAdmin() {
  let session: Awaited<ReturnType<typeof getServerSession>>;
  try {
    session = await getServerSession(authOptions);
  } catch {
    return null;
  }
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email || email !== ADMIN_EMAIL.toLowerCase()) return null;
  return email;
}

/**
 * PATCH /api/photos/[id]
 * Admin only. Updates any of {imageUrl, category, altText} on the doc.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos inválidos",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Build the patch object (only provided fields).
  const patch: Record<string, string> = {};
  if (parsed.data.imageUrl !== undefined) patch.imageUrl = parsed.data.imageUrl;
  if (parsed.data.category !== undefined) patch.category = parsed.data.category;
  if (parsed.data.altText !== undefined) patch.altText = parsed.data.altText;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { error: "Nada para actualizar" },
      { status: 400 }
    );
  }

  if (!isFirebaseConfigured || !firestore) {
    return NextResponse.json(
      { error: "Firebase no configurado" },
      { status: 503 }
    );
  }

  try {
    const col = portfolioCollection();
    if (!col) {
      return NextResponse.json(
        { error: "Firebase no disponible" },
        { status: 503 }
      );
    }
    await col.doc(id).update(patch);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[photos] PATCH error:", e);
    return NextResponse.json(
      { error: "No se pudo actualizar la foto" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/photos/[id]
 * Admin only.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  if (!isFirebaseConfigured || !firestore) {
    return NextResponse.json(
      { error: "Firebase no configurado" },
      { status: 503 }
    );
  }

  try {
    const col = portfolioCollection();
    if (!col) {
      return NextResponse.json(
        { error: "Firebase no disponible" },
        { status: 503 }
      );
    }
    await col.doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[photos] DELETE error:", e);
    return NextResponse.json(
      { error: "No se pudo eliminar la foto" },
      { status: 500 }
    );
  }
}
