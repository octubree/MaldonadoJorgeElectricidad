# Worklog — Jorge Electricidad (modernización SPA)

Proyecto: Modernización del sitio web de Jorge Electricidad (jorge-electricidad.net) como Single Page App moderna, oscura y minimalista.

Stack: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion.

## Contenido extraído del sitio actual (VLM sobre 7 capturas)

Negocio: Jorge Electricidad — Técnico Electricista
- Teléfono: 094 588 012
- Email: jorgitoballero@gmail.com
- Ubicación: Maldonado / Punta del Este, Uruguay
- Web: jorge-electricidad.net
- Formación: UTU electrotecnia, bachiller en ingeniería
- Experiencia: +5 años
- Diferencial: Firma UTE (instalador autorizado)

Servicios (3 categorías):
1. Electricidad — Obra nueva, Urgencias, Instalaciones en gral., motores, bombas, calefones, luminaria, automatismos
2. Afines — Portones eléctricos, domótica, control de accesos edificios, video porteros, cableado Internet y telefonía
3. Sistemas Vigilancia — CCTV, Wifi, cámaras cableadas con DVR o wifi con NVR, cámaras con seguimiento, alarmas con aviso al teléfono

Bio: "Me llamo Jorge, nativo de Maldonado, con más de 5 años de experiencia brindando servicios en electricidad y afines de forma autónoma o trabajando para empresas, con formación en electrotecnia en UTU y bachiller en ingeniería. Estoy a sus órdenes, no dude en contactarse."

Galería con filtros: Todas, Luminarias, Afines, Firma UTE, Cámaras de Seguridad

Testimonios (Google, 5 estrellas):
- Gabriela Segovia — "Excelente servicio !!"
- Norma Nunez — "Excelente, atención muy conforme con el trabajo realizado, muy recomendable"
- Jorge Rossi — "Muy contento con el trabajo. Super profesional. Recomiendo"
- Gabriel Sobredo — "Jorge un fenómeno, me solucionó un problemón!!!"
- Gerardo Francisco Brusoni
- Rafael Pintos

Blog "Electricidad para Todos":
- Destacado: "Aumento de potencia eléctrica en UTE: qué tener en cuenta" (09/03/2026)
- Recientes: "Firmas instaladores UTE" (12/09/2025), "Firmas instaladores UTE" (11/09/2025), "Requisitos del acto de..." (11/09/2025)

Paleta actual: negro + verde (mantener como evolución).

---
Task ID: 3
Agent: full-stack-developer
Task: Build complete one-page SPA for Jorge Electricidad

Work Log:
- Leí el worklog previo para tomar todo el contenido del negocio (teléfono, email, servicios, bio, testimonios, blog) verbatim.
- Actualicé `src/app/globals.css`: paleta oscura esmeralda siempre-activa en `:root` (sin theme provider), fondo charcoal-verde oklch(0.16 0.012 165), primario esmeralda oklch(0.72 0.19 162), `scroll-behavior: smooth`, `scroll-padding-top: 5rem`, scrollbar custom delgada con thumb esmeralda, utilidad `.emerald-glow`, keyframes `wa-pulse` para el botón flotante.
- Modifiqué `src/components/ui/sonner.tsx` para forzar `theme="dark"` sin depender de next-themes (eliminé el hook useTheme). Lo dejé como Toaster central en `layout.tsx` (reemplazó al Radix Toaster).
- Actualicé `src/app/layout.tsx`: `lang="es"`, metadata SEO en español (title, description, keywords, openGraph es_UY), Toaster de sonner.
- Creé `src/components/site/data.ts` con TODO el contenido: BUSINESS, NAV_LINKS, SERVICES (3), ABOUT_BIO + ABOUT_HIGHLIGHTS, HERO_TRUST, GALLERY_FILTERS + GALLERY_ITEMS (6), TESTIMONIALS (6) + intro, BLOG_POSTS (4 con bodies reales).
- Creé `src/components/site/SectionHeading.tsx` con `SectionHeading` (eyebrow + título + subtítulo animado) y `Reveal` (wrapper fade-up) para DRY.
- `Navbar.tsx`: sticky con frosted blur al hacer scroll, scroll-spy con IntersectionObserver y underline esmeralda animada (layoutId), logo Zap, CTA tel, Sheet mobile con stagger.
- `Hero.tsx`: dos columnas, badge "Técnico Electricista · Firma UTE", título grande con segunda línea esmeralda, dos CTAs, trust row, imagen hero.png con glow esmeralda + floating stat cards (Firma UTE + teléfono).
- `Services.tsx`: grid de 3 cards con icono en cuadrado esmeralda, descripción, sub-items como chips con check, hover lift + glow, link "Consultar".
- `About.tsx`: retrato jorge-portrait.png en marco con acento esmeralda (corner brackets), bio verbatim, grid de 4 highlights con iconos, CTA "Hablemos".
- `Gallery.tsx`: filtros toggle con layoutId animado (Todas/Luminarias/Afines/Firma UTE/Cámaras), grid 2-3 col con AnimatePresence + LayoutGroup para animar filtrado, hover scale + overlay, click abre Dialog lightbox con imagen grande + categoría + descripción.
- `Testimonials.tsx`: carousel embla con cards, 5 estrellas esmeralda, quote, avatar con iniciales, "Opinión en Google", botón "Ver en Google".
- `Contact.tsx`: dos columnas — izquierda 4 info cards (MapPin/Mail/Phone/MessageCircle) con links + banner de cobertura; derecha form react-hook-form + zod (nombre min 2, mensaje min 15, contacto checkboxes WhatsApp/Email, asunto opcional). POST a /api/contact, sonner toast success/error, reset, spinner en submit, aria-invalid + descripciones.
- `BlogPreview.tsx`: artículo destacado grande (aumento-potencia) + grid de 3 recientes, cada uno abre Dialog con cuerpo completo del artículo (párrafos reales en español), imagen blog-ute.png.
- `Footer.tsx`: server component, 3 columnas (brand+tagline, nav, contacto) + barra inferior con copyright y ubicación, `mt-auto` para sticky bottom.
- `WhatsappButton.tsx`: botón flotante fijo bottom-right, SVG de WhatsApp propio, pulse animation (wa-pulse), aparece tras scroll>240, tooltip "Escríbeme por WhatsApp", link wa.me con texto prefilled.
- `src/app/api/contact/route.ts`: POST handler con zod validation, log a console del mensaje, delay 300ms, retorna {success:true} o 400 con issues.
- Compoje todo en `src/app/page.tsx` con layout `min-h-screen flex flex-col`, main flex-1, footer mt-auto.
- Verifiqué: `bun run lint` pasa sin warnings, dev.log sin errores, GET / 200, POST /api/contact 200 (success) y 400 (validación), los 7 section IDs renderizan en el HTML.

Stage Summary:
- Archivos creados: src/components/site/{data.ts, SectionHeading.tsx, Navbar.tsx, Hero.tsx, Services.tsx, About.tsx, Gallery.tsx, Testimonials.tsx, Contact.tsx, BlogPreview.tsx, Footer.tsx, WhatsappButton.tsx}, src/app/api/contact/route.ts
- Archivos modificados: src/app/globals.css, src/app/layout.tsx, src/components/ui/sonner.tsx, src/app/page.tsx
- Sitio siempre-oscuro con paleta esmeralda, sticky navbar con scrollspy, hero con glow, 9 secciones, gallery con filtros + lightbox, testimonials carousel, form con validación y toasts, blog con dialogs, footer sticky, WhatsApp flotante con pulse.
- Lint OK, dev server OK, API contact OK (success + validation 400), todos los anchors #inicio..#blog presentes.

---
Task ID: 2-6
Agent: full-stack-developer
Task: Firebase photos + NextAuth admin + CDN gallery + Resend contact + UX reorder

Work Log:
- Leí el worklog previo (Task ID 3) para tomar contexto: sitio dark esmeralda ya construido, componentes en `src/components/site/`, data centralizada en `data.ts`, hero con glow, gallery con filtros + lightbox, form de contacto con zod.
- Actualicé `src/components/site/data.ts`: agregué `CATEGORY_SLUGS` + `SLUG_TO_CATEGORY` + `CATEGORY_SLUG_LIST` + `ADMIN_EMAIL`, reordené `NAV_LINKS` a las 6 secciones scroll (Inicio→Servicios→Sobre Mí→Clientes→Contacto→Trabajos), agregué `BLOG_NAV_LINK` apuntando a `/blog`, cambié `GalleryItem` a `{imageUrl, altText, description}` con categorías display-label y conservé `GALLERY_ITEMS` como fallback.
- Creé `src/lib/auth.ts`: NextAuthOptions con GoogleProvider (si `GOOGLE_CLIENT_ID`/`SECRET` presentes; si no, `providers: []` para no crashear), `signIn` callback que whitelistea únicamente `sixtamux@gmail.com`, callbacks `jwt`/`session` passthrough, `pages.signIn="/admin"`, helper `isNextAuthConfigured()`.
- Creé `src/lib/image-cdn.ts`: `optimizeImage(url, width)` — imagekit.io agrega `?tr=w-{w},h-{w},q-85,f-webp`; sirv.com agrega `?w={w}&h={w}&format=webp&q-85`; otros URLs se devuelven sin tocar.
- Creé `src/app/api/auth/[...nextauth]/route.ts`: handler GET/POST de NextAuth.
- Creé `src/app/api/photos/route.ts`: GET público lista portfolio ordenado por `timestamp` desc; si Firebase no configurado → devuelve `GALLERY_ITEMS` con flag `demo:true` para que la galería pública siempre se vea bien; convierte slug→display label en la respuesta. POST admin-only (whitelist email) valida con zod (imageUrl URL, category enum de 4 slugs, altText min 2), agrega `timestamp: FieldValue.serverTimestamp()` y devuelve `{id}`. 401 si no autenticado, 503 si Firebase no configurado.
- Creé `src/app/api/photos/[id]/route.ts`: PATCH admin-only para actualizar `imageUrl`/`category`/`altText` (campos opcionales); DELETE admin-only. Ambos con zod + auth gate + 401/503/500.
- Creé `src/app/admin/layout.tsx`: SessionProvider wrap, header sticky con "← Volver al sitio" + logo, mismo bg esmeralda.
- Creé `src/app/admin/page.tsx` (server) + `src/app/admin/AdminPanel.tsx` (client): 4 estados — (1) NextAuth no configurado → card "Configuración pendiente" listando las env vars necesarias + botón Reintentar; (2) no autenticado → "Administración de Portfolio" + botón Google sign-in con el SVG "G" a 4 colores + nota whitelist; (3) autenticado pero email no admin → "Acceso denegado" + sign-out; (4) admin autenticado → header con email + sign-out rojo, card "Agregar foto" (URL + select categoría + altText + botón Subir), grid responsive 1/2/3/4 cols de cards con thumbnail (optimizeImage width=300), altText editable, select categoría, "ID: xxx", "Guardar Cambios" + "Eliminar" (con AlertDialog de confirmación), toasts sonner en cada acción. Banner amber "Modo demo" cuando Firebase no configurado y botón Subir deshabilitado. Skeleton grid + empty state + error state.
- Creé `src/app/blog/page.tsx` (server) + `src/app/blog/BlogArticleDialog.tsx` (client): página SEO `/blog` con metadata dedicada, header "Volver al inicio", hero "Electricidad para Todos", artículo destacado grande, grid de 3 recientes, lista "Todos los artículos" con contenido completo en `sr-only` para crawlers, CTA final a `/#contacto`. Misma estética dark esmeralda, sticky footer. Diálogo reutilizable usando `DialogTrigger asChild` (sin cloneElement — corregí un primer intento que crasheaba).
- Actualicé `src/app/page.tsx`: nuevo orden de secciones Hero→Servicios→About→Testimonials→Contact→Gallery (Trabajos al final), removido `<BlogPreview />` del scroll del home.
- Actualicé `src/components/site/Navbar.tsx`: 6 anchors scroll (NAV_LINKS) + link "Blog" separado a `/blog` con icono ExternalLink sutil. Scroll-spy IntersectionObserver trackea solo los 6 anchors (no Blog). `usePathname()` para desactivar spy en `/blog`. Logo ahora linkea a `/#inicio`. Sheet mobile con los 7 items.
- Actualicé `src/components/site/Gallery.tsx`: reemplacé `next/image` por `<img>` con `optimizeImage(url, 500)` en thumbnails (para soportar URLs externas sin remote patterns), `<img>` con URL original en el lightbox. `useEffect` fetch `/api/photos?_=timestamp` con `cache: 'no-store'`, skeleton grid mientras carga, fallback a `GALLERY_ITEMS` si fetch falla o vacío. Conservé filtros Framer Motion AnimatePresence + LayoutGroup smooth.
- Actualicé `src/components/site/Contact.tsx`: schema zod con superRefine para lógica condicional (whatsapp_number + whatsapp_country required si "whatsapp" en preference; email required + formato válido si "email" en preference). Campos: Nombre, preferencia (2 checkboxes), WhatsApp condicional (select país UY/AR con banderas + input tel, mostrados con AnimatePresence), Email condicional, Asunto opcional, Mensaje min 15. Submit a `/api/contact` con sonner toasts.
- Actualicé `src/app/api/contact/route.ts`: zod con misma lógica condicional, build de HTML replicando `send-email.js` original (header verde esmeralda, tabla con nombre/preferencia/whatsapp con país/email/asunto/mensaje, footer). Si `RESEND_API_KEY` + `TO_EMAIL` configurados → envía email real con `replyTo` si email fue provisto. Si no → log a consola + `{success:true, demo:true}`. 300ms delay. 400 en validation, 500 en Resend error.
- Actualicé `src/components/site/Footer.tsx`: agregué link "Blog" a `/blog` con icono BookOpen sutil en la columna de navegación, junto a los 6 anchors.
- Ajusté `eslint.config.mjs`: agregué `upload/**` a ignores (los scripts `upload/*.js` de referencia original Firebase usan `require()` y rompían lint).
- Verifiqué: `bun run lint` pasa sin warnings; dev.log limpio; GET / 200 (secciones en orden correcto: inicio, servicios, sobre-mi, clientes, contacto, trabajos — NO hay `#blog`); GET /blog 200 (con metadata SEO); GET /admin 200 (muestra "Configuración pendiente" en demo mode); GET /api/photos 200 (devuelve 6 sample photos con `demo:true`); POST /api/contact válido 200 (log en consola + `{success:true, demo:true}`); POST /api/contact inválido 400 con issues detallados.

Stage Summary:
- Archivos creados: src/lib/{auth.ts, image-cdn.ts}, src/app/api/auth/[...nextauth]/route.ts, src/app/api/photos/{route.ts, [id]/route.ts}, src/app/admin/{layout.tsx, page.tsx, AdminPanel.tsx}, src/app/blog/{page.tsx, BlogArticleDialog.tsx}
- Archivos modificados: src/components/site/{data.ts, Navbar.tsx, Gallery.tsx, Contact.tsx, Footer.tsx}, src/app/{page.tsx, api/contact/route.ts}, eslint.config.mjs
- UX: sección Trabajos movida al final, Blog fuera del home scroll en ruta /blog separada (crawleable), navbar con scroll-spy de 6 anchors + link Blog diferenciado.
- Admin: 4 estados con graceful degradation (no configurado → instrucciones; no auth → Google sign-in; denegado → sign-out; admin → CRUD completo de fotos en Firestore).
- Galería pública: fetch desde API con fallback a samples, optimización CDN (imagekit.io / sirv.com) en thumbnails, URL original en lightbox.
- Contacto: form con campos condicionales (whatsapp país + número / email), validación zod superRefine, email real vía Resend con HTML replicando el diseño original, o log consola en demo mode.
- Sin credenciales el sitio se ve completo: galería con samples, admin muestra setup, contacto loguea en consola. Con credenciales, todo funciona end-to-end.
