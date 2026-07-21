import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Analytics } from "@/components/site/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// ── Constantes del sitio ────────────────────────────────────────────────
const SITE_URL = "https://jorge-electricidad.net";
const OG_IMAGE =
  "https://ellwinan.sirv.com/electricidad.png?profile=Example&w=1200&h=630";
const FAVICON = "/images/icon.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Electricista en Maldonado y Punta del Este | Jorge Electricidad",
    template: "%s | Jorge Electricidad",
  },
  description:
    "Electricista en Maldonado y Punta del Este, Uruguay. Instalaciones eléctricas, cámaras de seguridad, domótica, motores, portones eléctricos y control de acceso. Atiendo urgencias eléctricas. Trabajos con firma de UTE.",
  keywords: [
    "Electricista",
    "Técnico Electricista",
    "Maldonado",
    "Punta del Este",
    "Uruguay",
    "Instalaciones Eléctricas",
    "Cámaras de Seguridad",
    "Domótica",
    "Urgencias Eléctricas",
    "Trabajos con firma de UTE",
    "Jorge Electricidad",
  ],
  authors: [{ name: "Jorge Electricidad" }],
  creator: "Jorge Electricidad",
  publisher: "Jorge Electricidad",
  applicationName: "Jorge Electricidad",
  category: "electrician",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Jorge Electricidad | Técnico Electricista en Maldonado y Punta del Este",
    description:
      "Técnico electricista con más de 5 años de experiencia en Maldonado y Punta del Este. Instalaciones, reformas, cámaras de seguridad, domótica y más. Trabajos con firma de UTE.",
    url: SITE_URL,
    siteName: "Jorge Electricidad",
    type: "website",
    locale: "es_UY",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Jorge Electricidad — Técnico Electricista en Maldonado y Punta del Este",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Jorge Electricidad | Técnico Electricista en Maldonado y Punta del Este",
    description:
      "Técnico electricista en Maldonado y Punta del Este. Trabajos con firma de UTE.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: [{ url: FAVICON, type: "image/png" }],
    apple: [{ url: FAVICON }],
    shortcut: [FAVICON],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

// ── JSON-LD Structured Data (schema.org/Electrician) ────────────────────
// Esto es lo que hace que Google muestre el "rich snippet" con teléfono,
// horarios, dirección y cobertura geográfica en los resultados de búsqueda.
const electricianJsonLd = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  name: "Jorge Electricidad",
  description:
    "Trabajo con firma de UTE en Maldonado y Punta del Este. Servicios de instalaciones, reparaciones, urgencias, domótica y más.",
  telephone: "+59894588012",
  url: SITE_URL,
  image:
    "https://ellwinan.sirv.com/electricidad.png?profile=Example&w=192&h=192",
  email: "jorgitoballero@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Maldonado",
    addressRegion: "Maldonado",
    postalCode: "20000",
    addressCountry: "UY",
  },
  areaServed: [
    { "@type": "City", name: "Maldonado" },
    { "@type": "City", name: "Punta del Este" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "08:00",
      closes: "20:00",
      validFrom: "12-01",
      validThrough: "02-28",
    },
  ],
  sameAs: ["https://g.co/kgs/S6hMGZq"],
};

// ── WebSite schema (ayuda a Google a entender la estructura del sitio) ───
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Jorge Electricidad",
  url: SITE_URL,
  inLanguage: "es-UY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://ellwinan.sirv.com" />
        {/* JSON-LD: datos estructurados para SEO local (rich snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(electricianJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Sonner />
        <Analytics />
      </body>
    </html>
  );
}
