import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Footer } from "@/components/site/Footer";
import dynamic from "next/dynamic";

const Testimonials = dynamic(() => import("@/components/site/Testimonials").then((mod) => mod.Testimonials), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted/10" />,
});

const Contact = dynamic(() => import("@/components/site/Contact").then((mod) => mod.Contact), {
  loading: () => <div className="min-h-[600px] animate-pulse bg-muted/10" />,
});

const Gallery = dynamic(() => import("@/components/site/Gallery").then((mod) => mod.Gallery), {
  loading: () => <div className="min-h-[500px] animate-pulse bg-muted/10" />,
});

const WhatsappButton = dynamic(() => import("@/components/site/WhatsappButton").then((mod) => mod.WhatsappButton));

const ScrollToTopButton = dynamic(() => import("@/components/site/ScrollToTopButton").then((mod) => mod.ScrollToTopButton));


/**
 * Home — single-page SPA. Section order is intentional:
 *
 *   Hero → Servicios → Sobre Mí → Clientes → Contacto → Trabajos
 *
 * The gallery lives LAST so visitors who don't care about the photo
 * portfolio can reach the contact info without scrolling through it.
 *
 * The blog lives on a separate `/blog` route (SEO) and is NOT in the
 * home scroll — it's linked from the navbar and footer.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <Contact />
        <Gallery />
      </main>
      <Footer />
      <WhatsappButton />
      <ScrollToTopButton />
    </div>
  );
}
