import type { Metadata } from "next";
import { isNextAuthConfigured } from "@/lib/auth";
import { AdminPanel } from "@/app/admin/AdminPanel";

/**
 * Admin page — server component.
 *
 * NO debe ser indexado por buscadores (es un panel privado).
 * El `robots: noindex, nofollow` se aplica vía metadata.
 */
export const metadata: Metadata = {
  title: "Administración",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * We do the env-var check on the server (so `GOOGLE_CLIENT_ID` is never
 * exposed to the client) and pass the boolean down to the client
 * `AdminPanel`, which handles the four UI states:
 *   1. NextAuth not configured   → setup instructions
 *   2. Not authenticated          → Google sign-in button
 *   3. Authenticated but not admin → "access denied"
 *   4. Authenticated as admin     → full portfolio manager
 */
export default function AdminPage() {
  return <AdminPanel authConfigured={isNextAuthConfigured()} />;
}
