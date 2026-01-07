"use client"

import { useDb } from "@/lib/db-context"

export function GallerySection() {
  const { data, isLoading } = useDb()

  if (isLoading || !data) {
    return <section className="py-20 bg-accent/20" />
  }

  const { siteContent, galleryImages } = data
  const sortedImages = [...galleryImages].sort((a, b) => a.order - b.order)

  return (
    <section className="py-20 bg-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">{siteContent.galleryTitle}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">{siteContent.gallerySubtitle}</p>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {sortedImages.map((image, index) => (
            <div
              key={image.id}
              className="break-inside-avoid overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={400}
                height={index % 2 === 0 ? 400 : 300}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
