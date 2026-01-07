"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  price: number
  stock: "available" | "low"
  image: string
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
  order: number
}

export interface SiteContent {
  heroTagline: string
  heroTitle: string
  heroSubtitle: string
  catalogTitle: string
  catalogSubtitle: string
  whyChooseUsTitle: string
  whyChooseUsSubtitle: string
  aboutTitle: string
  aboutText: string
  galleryTitle: string
  gallerySubtitle: string
  contactTitle: string
  contactSubtitle: string
  footerDescription: string
  footerPhone: string
  footerEmail: string
}

export interface DbData {
  siteContent: SiteContent
  products: Product[]
  galleryImages: GalleryImage[]
}

interface DbContextType {
  data: DbData | null
  isLoading: boolean
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  updateData: (newData: DbData) => void
}

const DbContext = createContext<DbContextType | undefined>(undefined)

export function DbProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DbData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch("/data/db.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load db.json:", err)
        setIsLoading(false)
      })

    // Check if admin session exists
    const adminSession = sessionStorage.getItem("amigurumi_admin")
    if (adminSession === "true") {
      setIsAdmin(true)
    }
  }, [])

  const updateData = (newData: DbData) => {
    setData(newData)
  }

  return (
    <DbContext.Provider value={{ data, isLoading, isAdmin, setIsAdmin, updateData }}>{children}</DbContext.Provider>
  )
}

export function useDb() {
  const context = useContext(DbContext)
  if (context === undefined) {
    throw new Error("useDb must be used within a DbProvider")
  }
  return context
}
