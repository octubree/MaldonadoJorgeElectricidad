import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Gallery } from "@/components/site/Gallery";
import { Footer } from "@/components/site/Footer";
import { WhatsappButton } from "@/components/site/WhatsappButton";
import { ScrollToTopButton } from "@/components/site/ScrollToTopButton";

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
