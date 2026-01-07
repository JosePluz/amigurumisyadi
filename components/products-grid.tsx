"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { useDb } from "@/lib/db-context"

export function ProductsGrid() {
  const { data, isLoading } = useDb()

  if (isLoading || !data) {
    return <section id="catalogo" className="py-20 bg-card" />
  }

  const { siteContent, products } = data

  return (
    <section id="catalogo" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">{siteContent.catalogTitle}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">{siteContent.catalogSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              data-product-id={product.id}
              className="group overflow-hidden border-border hover:shadow-lg transition-shadow duration-300 bg-background"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={300}
                  height={300}
                />
                <Badge
                  variant={product.stock === "low" ? "destructive" : "secondary"}
                  className="absolute top-3 right-3"
                >
                  {product.stock === "low" ? "Últimas piezas" : "Disponible"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-serif font-semibold text-lg text-foreground mb-1">{product.name}</h3>
                <p className="text-primary font-bold text-xl mb-3">${product.price} MXN</p>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                  <a href="#contacto">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
