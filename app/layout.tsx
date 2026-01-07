import type React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito_Sans, Baloo_2 } from "next/font/google"
import { DbProvider } from "@/lib/db-context"
import "./globals.css"

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
})

const baloo2 = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo-2",
})

export const metadata: Metadata = {
  title: "Amigurumis Artesanales | Peluches Tejidos a Mano con Amor",
  description:
    "Descubre nuestra colección de amigurumis tejidos a mano con lana 100% hipoalergénica. Diseños únicos, materiales seguros y envío a todo México. ¡Crea tu pedido personalizado!",
  keywords: ["amigurumi", "peluches tejidos", "artesanías", "tejido a mano", "hipoalergénico", "México"],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#f5b8c4",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${nunitoSans.variable} ${baloo2.variable} font-sans antialiased`}>
        <DbProvider>{children}</DbProvider>
      </body>
    </html>
  )
}
