/**
 * CDN-aware image optimization.
 *
 * Replicates the original `index.html` behavior:
 *  - imagekit.io URLs append `?tr=w-{w},h-{w},q-85,f-webp`
 *  - sirv.com   URLs append `?w={w}&h={w}&format=webp&q=85`
 *  - everything else (local /images, etc.) is returned untouched.
 *
 * Use it on thumbnails. For the lightbox / full view, prefer the
 * original `imageUrl` so the user gets the highest resolution.
 *
 * Pass `forceSquare: false` to preserve the original aspect ratio
 * (useful for portraits / banners where square cropping would cut
 * important content).
 */
export function optimizeImage(
  url: string,
  width = 400,
  forceSquare = true
): string {
  if (!url) return url;

  if (url.includes("imagekit.io")) {
    // ImageKit: combine tr= params with a `?` (or `&` if the URL already
    // has a query string).
    const sep = url.includes("?") ? "&" : "?";
    const h = forceSquare ? `,h-${width}` : "";
    return `${url}${sep}tr=w-${width}${h},q-85,f-webp`;
  }

  if (url.includes("sirv.com")) {
    const sep = url.includes("?") ? "&" : "?";
    const h = forceSquare ? `&h=${width}` : "";
    return `${url}${sep}w=${width}${h}&format=webp&q=85`;
  }

  return url;
}
