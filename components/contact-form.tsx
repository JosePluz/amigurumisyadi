"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle } from "lucide-react"
import { useDb } from "@/lib/db-context"

export function ContactForm() {
  const { data, isLoading } = useDb()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isLoading || !data) {
    return <section id="contacto" className="py-20 bg-card" />
  }

  const { siteContent } = data

  if (isSubmitted) {
    return (
      <section id="contacto" className="py-20 bg-card">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-accent/20 rounded-3xl p-12">
            <CheckCircle className="w-16 h-16 text-accent-foreground mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">¡Mensaje Enviado!</h3>
            <p className="text-foreground/70">Gracias por contactarnos. Te responderemos pronto.</p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Enviar otro mensaje
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" className="py-20 bg-card" aria-labelledby="contact-heading">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="contact-heading" className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {siteContent.contactTitle}
          </h2>
          <p className="text-foreground/70">{siteContent.contactSubtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-background rounded-3xl p-8 shadow-lg border border-border space-y-6"
          name="contact"
          data-netlify="true"
        >
          {/* Honeypot anti-spam field */}
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="bot-field">No llenar este campo</Label>
            <Input type="text" name="bot-field" id="bot-field" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Nombre
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Tu nombre"
              className="rounded-xl bg-input border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Correo electrónico
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="rounded-xl bg-input border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium">
              Mensaje
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Cuéntanos qué te gustaría..."
              className="rounded-xl bg-input border-border focus:ring-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 font-medium"
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
