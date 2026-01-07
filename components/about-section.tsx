"use client"

import { useDb } from "@/lib/db-context"

export function AboutSection() {
  const { data, isLoading } = useDb()

  if (isLoading || !data) {
    return <section id="historia" className="py-20 bg-card" />
  }

  const { siteContent } = data

  return (
    <section id="historia" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">{siteContent.aboutTitle}</h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              {siteContent.aboutText.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/hands-knitting-crochet-yarn-pastel-colors-crafting.jpg"
                alt="Proceso de tejido a mano"
                className="w-full rounded-2xl shadow-md"
                loading="lazy"
                width={250}
                height={300}
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="/finished-amigurumi-collection-cute-stuffed-animals.jpg"
                alt="Colección de amigurumis terminados"
                className="w-full rounded-2xl shadow-md"
                loading="lazy"
                width={250}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
