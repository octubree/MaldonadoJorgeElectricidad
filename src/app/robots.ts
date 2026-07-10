import type { MetadataRoute } from "next";

/**
 * robots.txt generado dinámicamente.
 *
 * - Permite indexar el home y el blog (contenido público).
 * - Bloquea /admin (panel privado) y /api (endpoints internos).
 * - Apunta al sitemap para que los crawlers lo descubran.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: "https://jorge-electricidad.net/sitemap.xml",
    host: "https://jorge-electricidad.net",
  };
}
