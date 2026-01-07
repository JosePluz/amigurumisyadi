"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Heart } from "lucide-react"
import { useDb } from "@/lib/db-context"

export function HeroSection() {
  const { data, isLoading } = useDb()

  if (isLoading || !data) {
    return <section id="inicio" className="min-h-screen flex items-center justify-center pt-16" />
  }

  const { siteContent } = data

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-muted/40 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider">{siteContent.heroTagline}</span>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          {siteContent.heroTitle}
        </h1>

        <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-8 text-pretty">
          {siteContent.heroSubtitle}
        </p>

        <div className="flex items-center justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 font-medium"
          >
            <a href="#catalogo">
              <Heart className="w-4 h-4 mr-2" />
              Ver Catálogo
            </a>
          </Button>
        </div>

        {/* Hero Image */}
        <div className="mt-12 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <img
            src="/cute-colorful-hand-knitted-amigurumi-stuffed-anima.jpg"
            alt="Colección de amigurumis tejidos a mano"
            className="mx-auto rounded-3xl shadow-2xl max-w-full h-auto"
            width={800}
            height={500}
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}
