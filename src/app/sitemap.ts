import type { MetadataRoute } from "next";

/**
 * sitemap.xml generado dinámicamente.
 *
 * Lista las URLs públicas que querés que Google indexe:
 * - Home (/)
 * - Blog (/blog)
 *
 * Si en el futuro agregás páginas individuales de artículos del blog,
 * podés mapearlas acá para que se indexen automáticamente.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jorge-electricidad.net";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
