import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProductsGrid } from "@/components/products-grid"
import { WhyChooseUs } from "@/components/why-choose-us"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductsGrid />
      <WhyChooseUs />
      <AboutSection />
      <GallerySection />
      <ContactForm />
      <Footer />
    </main>
  )
}
