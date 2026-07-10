import { BLOG_POSTS, type BlogPost } from "@/components/site/data";

export function findPostBySlug(slug: string): BlogPost | undefined {
  if (!slug) return undefined;
  
  const decoded = decodeURIComponent(slug);

  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]+/g, "-")     // replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, "");        // trim leading/trailing hyphens
  };

  const normalizedSlug = normalize(decoded);

  // 1. Direct match
  let found = BLOG_POSTS.find((p) => p.id === decoded);
  if (found) return found;

  // 2. Normalized match
  found = BLOG_POSTS.find((p) => normalize(p.id) === normalizedSlug);
  if (found) return found;

  // 3. Hardcoded old URL redirects/mappings
  const normalizedOldSlugsMap: Record<string, string> = {
    "requisitos-para-nicho-o-punto-para-medidor-de-ute": "punto-de-medida-ute",
    "requisitos-para-nicho-o--punto-para-medidor-de-ute": "punto-de-medida-ute",
    "firmas-de-ute": "firma-de-ute-1",
    "como-arreglar-un-enchufe": "como-arreglar-un-enchufe",
    "reparar-un-enchufe-en-casa": "como-arreglar-un-enchufe",
    "guia-rapida-para-cortes-de-luz": "guia-rapida-cortes-de-luz",
    "guia-rapida-cortes-de-luz-": "guia-rapida-cortes-de-luz",
    "que-potencia-contratar-en-ute-para-mi-casa": "que-potencia-contratar-en-ute-para-tu-casa",
    "domotica-en-maldonado-vale-la-pena-invertir": "dom-tica-en-maldonado-vale-la-pena-invertir",
    "domotica-en-maldonado-vale-la-pena-invertir-": "dom-tica-en-maldonado-vale-la-pena-invertir",
    "necesitas-un-electricista": "necesitas-un-electricista",
  };

  const mappedId = normalizedOldSlugsMap[normalizedSlug];
  if (mappedId) {
    found = BLOG_POSTS.find((p) => p.id === mappedId);
    if (found) return found;
  }

  return undefined;
}
