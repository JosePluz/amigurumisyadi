"use client"

import { Heart } from "lucide-react"
import { useDb } from "@/lib/db-context"

const quickLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#historia", label: "Nuestra Historia" },
  { href: "#contacto", label: "Contacto" },
]

const socialLinks = [
  { href: "https://tiktok.com", label: "TikTok", icon: "TikTok" },
  { href: "https://instagram.com", label: "Instagram", icon: "Instagram" },
  { href: "https://facebook.com", label: "Facebook", icon: "Facebook" },
]

export function Footer() {
  const { data, isLoading } = useDb()

  if (isLoading || !data) {
    return <footer className="bg-secondary/50 border-t border-border py-12" />
  }

  const { siteContent } = data

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">Amigurumis</span>
            </div>
            <p className="text-foreground/70 text-sm max-w-sm leading-relaxed">{siteContent.footerDescription}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-foreground/70 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-serif font-semibold text-foreground mb-4">Síguenos</h3>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-xs font-medium text-primary">{social.icon.substring(0, 2)}</span>
                </a>
              ))}
            </div>
            <div className="space-y-1 text-sm text-foreground/70">
              <p>{siteContent.footerPhone}</p>
              <p>{siteContent.footerEmail}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Amigurumis Artesanales. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
