import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * NextAuth configuration for the /admin panel.
 *
 * Provider: Google OAuth (same project as Firebase Auth — reuses the
 * `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` env vars).
 *
 * Authorization is a single-email whitelist: only `ADMIN_EMAIL`
 * (sixtamux@gmail.com) may sign in. Anyone else is rejected in the
 * `signIn` callback.
 *
 * Graceful degradation: if `GOOGLE_CLIENT_ID` is missing we still export
 * `authOptions` (with an empty providers list) so the NextAuth route
 * handler doesn't crash. The admin page detects this and shows a
 * "Configuration pending" panel with setup instructions.
 */

// Lista de correos autorizados para administrar el sitio (pueden definirse en el archivo .env o en Vercel)
const ALLOWED_EMAILS = (process.env.ADMIN_EMAILS || "sixtamux@gmail.com,jorgitobaliero@gmail.com,jorgitoballero@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase());

function buildProviders() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return [];
  }

  return [
    GoogleProvider({ clientId, clientSecret }),
  ];
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  session: { strategy: "jwt" },
  pages: { signIn: "/admin" },
  callbacks: {
    /**
     * Whitelist gate. Returning `false` rejects the sign-in attempt.
     */
    async signIn({ user }) {
      const email = user?.email?.trim().toLowerCase();
      return Boolean(email && ALLOWED_EMAILS.includes(email));
    },
    async jwt({ token, account }) {
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Pass through email + provider for the admin UI.
        (session.user as { provider?: string }).provider =
          typeof token.provider === "string" ? token.provider : undefined;
      }
      return session;
    },
  },
};

/**
 * Server-side helper: returns `true` when NextAuth is fully configured
 * (Google env vars present). Used by the admin page to render the
 * "Configuration pending" state without crashing.
 */
export function isNextAuthConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.NEXTAUTH_SECRET
  );
}
