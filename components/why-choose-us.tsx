"use client"

import { Shield, Palette, Truck } from "lucide-react"
import { useDb } from "@/lib/db-context"

const features = [
  {
    icon: Shield,
    title: "Materiales Seguros",
    description:
      "Lana 100% hipoalergénica y relleno certificado libre de tóxicos. Seguro para bebés y niños de todas las edades.",
  },
  {
    icon: Palette,
    title: "Diseños Únicos",
    description: "Cada amigurumi es tejido a mano con patrones exclusivos. No encontrarás dos iguales en ningún lugar.",
  },
  {
    icon: Truck,
    title: "Envío a Todo el País",
    description: "Llegamos a cualquier rincón de México. Empaque especial para que tu amigurumi llegue perfecto.",
  },
]

export function WhyChooseUs() {
  const { data, isLoading } = useDb()

  if (isLoading || !data) {
    return <section className="py-20 bg-secondary/30" />
  }

  const { siteContent } = data

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {siteContent.whyChooseUsTitle}
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">{siteContent.whyChooseUsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-2xl border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
