"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  FileText,
  ImageIcon,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Upload,
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Heart,
} from "lucide-react"
import { useDb, type DbData, type Product, type GalleryImage } from "@/lib/db-context"
import { useRouter } from "next/navigation"

const CLOUDINARY_CLOUD_NAME = "demo" // User should replace with their cloud name
const CLOUDINARY_UPLOAD_PRESET = "amigurumi_shop"

export function AdminDashboard() {
  const { data, isLoading, setIsAdmin, updateData } = useDb()
  const router = useRouter()

  const [localData, setLocalData] = useState<DbData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [saveMessage, setSaveMessage] = useState("")
  const [uploadingProduct, setUploadingProduct] = useState<string | null>(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  useEffect(() => {
    if (data) {
      setLocalData(JSON.parse(JSON.stringify(data)))
    }
  }, [data])

  const handleLogout = () => {
    sessionStorage.removeItem("amigurumi_admin")
    setIsAdmin(false)
    router.push("/")
  }

  // Product handlers
  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    if (!localData) return
    setLocalData({
      ...localData,
      products: localData.products.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  const addProduct = () => {
    if (!localData) return
    const newId = String(Date.now())
    const newProduct: Product = {
      id: newId,
      name: "Nuevo Producto",
      price: 0,
      stock: "available",
      image: "/cute-knitted-amigurumi-toy-pastel.jpg",
    }
    setLocalData({
      ...localData,
      products: [...localData.products, newProduct],
    })
  }

  const deleteProduct = (id: string) => {
    if (!localData) return
    setLocalData({
      ...localData,
      products: localData.products.filter((p) => p.id !== id),
    })
  }

  // Gallery handlers
  const moveGalleryImage = (id: string, direction: "up" | "down") => {
    if (!localData) return
    const sortedImages = [...localData.galleryImages].sort((a, b) => a.order - b.order)
    const index = sortedImages.findIndex((img) => img.id === id)

    if (direction === "up" && index > 0) {
      const temp = sortedImages[index].order
      sortedImages[index].order = sortedImages[index - 1].order
      sortedImages[index - 1].order = temp
    } else if (direction === "down" && index < sortedImages.length - 1) {
      const temp = sortedImages[index].order
      sortedImages[index].order = sortedImages[index + 1].order
      sortedImages[index + 1].order = temp
    }

    setLocalData({
      ...localData,
      galleryImages: sortedImages,
    })
  }

  const addGalleryImage = () => {
    if (!localData) return
    const newId = String(Date.now())
    const maxOrder = Math.max(...localData.galleryImages.map((g) => g.order), -1)
    const newImage: GalleryImage = {
      id: newId,
      url: "/cute-amigurumi-moment-pastel.jpg",
      alt: "Nueva imagen",
      order: maxOrder + 1,
    }
    setLocalData({
      ...localData,
      galleryImages: [...localData.galleryImages, newImage],
    })
  }

  const updateGalleryImage = (id: string, field: keyof GalleryImage, value: string | number) => {
    if (!localData) return
    setLocalData({
      ...localData,
      galleryImages: localData.galleryImages.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    })
  }

  const deleteGalleryImage = (id: string) => {
    if (!localData) return
    setLocalData({
      ...localData,
      galleryImages: localData.galleryImages.filter((g) => g.id !== id),
    })
  }

  // Content handlers
  const updateContent = (field: string, value: string) => {
    if (!localData) return
    setLocalData({
      ...localData,
      siteContent: {
        ...localData.siteContent,
        [field]: value,
      },
    })
  }

  // Cloudinary upload
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      return data.secure_url
    } catch (err) {
      console.error("Cloudinary upload error:", err)
      return null
    }
  }

  const handleProductImageUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingProduct(productId)
    const url = await uploadToCloudinary(file)
    if (url) {
      updateProduct(productId, "image", url)
    }
    setUploadingProduct(null)
  }

  const handleGalleryImageUpload = async (galleryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingGallery(true)
    const url = await uploadToCloudinary(file)
    if (url) {
      updateGalleryImage(galleryId, "url", url)
    }
    setUploadingGallery(false)
  }

  // Save & Publish via GitHub API
  const handleSaveAndPublish = async () => {
    if (!localData) return

    setIsSaving(true)
    setSaveStatus("idle")
    setSaveMessage("")

    // Get GitHub PAT from session storage or prompt
    let token = sessionStorage.getItem("github_pat")
    if (!token) {
      token = window.prompt(
        "Ingresa tu GitHub Personal Access Token (con permisos 'repo'):\n\nVe a: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token",
      )
      if (token) {
        sessionStorage.setItem("github_pat", token)
      } else {
        setIsSaving(false)
        setSaveStatus("error")
        setSaveMessage("Se requiere un GitHub PAT para publicar cambios")
        return
      }
    }

    // Get repo info from prompt or session
    let repoOwner = sessionStorage.getItem("github_repo_owner")
    let repoName = sessionStorage.getItem("github_repo_name")

    if (!repoOwner || !repoName) {
      const repoInfo = window.prompt(
        "Ingresa el repositorio de GitHub (formato: usuario/nombre-repo):",
        "tu-usuario/amigurumi-shop",
      )
      if (repoInfo && repoInfo.includes("/")) {
        const [owner, name] = repoInfo.split("/")
        repoOwner = owner
        repoName = name
        sessionStorage.setItem("github_repo_owner", owner)
        sessionStorage.setItem("github_repo_name", name)
      } else {
        setIsSaving(false)
        setSaveStatus("error")
        setSaveMessage("Se requiere el nombre del repositorio para publicar")
        return
      }
    }

    try {
      // Get current file SHA
      const getFileRes = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/public/data/db.json`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      )

      let sha: string | undefined
      if (getFileRes.ok) {
        const fileData = await getFileRes.json()
        sha = fileData.sha
      }

      // Update file via GitHub API
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(localData, null, 2))))

      const updateRes = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/public/data/db.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Update site content via admin panel",
            content,
            sha,
          }),
        },
      )

      if (!updateRes.ok) {
        const errorData = await updateRes.json()
        throw new Error(errorData.message || "GitHub API error")
      }

      // Update local state
      updateData(localData)

      setSaveStatus("success")
      setSaveMessage("¡Cambios publicados! Render redesplegará el sitio automáticamente (30-60 segundos).")
    } catch (err) {
      console.error("Save error:", err)
      setSaveStatus("error")
      setSaveMessage(err instanceof Error ? err.message : "Error al guardar cambios")

      // Clear PAT if authentication failed
      if (err instanceof Error && err.message.includes("Bad credentials")) {
        sessionStorage.removeItem("github_pat")
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !localData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-foreground">Panel de Administración</h1>
                <p className="text-xs text-foreground/60">Amigurumis Artesanales</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveAndPublish}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar y Publicar
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="rounded-full bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Save Status Message */}
      {saveStatus !== "idle" && (
        <div
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 ${
            saveStatus === "success" ? "bg-accent/20" : "bg-destructive/10"
          }`}
        >
          <div className="flex items-center gap-2">
            {saveStatus === "success" ? (
              <CheckCircle className="w-5 h-5 text-accent-foreground" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
            <p className={saveStatus === "success" ? "text-accent-foreground" : "text-destructive"}>{saveMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-secondary/30 rounded-full p-1">
            <TabsTrigger value="products" className="rounded-full data-[state=active]:bg-card">
              <Package className="w-4 h-4 mr-2" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="content" className="rounded-full data-[state=active]:bg-card">
              <FileText className="w-4 h-4 mr-2" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-full data-[state=active]:bg-card">
              <ImageIcon className="w-4 h-4 mr-2" />
              Galería
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-foreground">Gestionar Productos</h2>
              <Button
                onClick={addProduct}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Producto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localData.products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Label className="cursor-pointer bg-card text-foreground px-4 py-2 rounded-full text-sm font-medium">
                        {uploadingProduct === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4 inline mr-2" />
                            Cambiar imagen
                          </>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleProductImageUpload(product.id, e)}
                          disabled={uploadingProduct === product.id}
                        />
                      </Label>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${product.id}`}>Nombre</Label>
                      <Input
                        id={`name-${product.id}`}
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`price-${product.id}`}>Precio (MXN)</Label>
                        <Input
                          id={`price-${product.id}`}
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, "price", Number(e.target.value))}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`stock-${product.id}`}>Stock</Label>
                        <select
                          id={`stock-${product.id}`}
                          value={product.stock}
                          onChange={(e) => updateProduct(product.id, "stock", e.target.value)}
                          className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm"
                        >
                          <option value="available">Disponible</option>
                          <option value="low">Últimas piezas</option>
                        </select>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => deleteProduct(product.id)}
                      className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Editar Contenido del Sitio</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Sección Hero</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroTagline">Etiqueta</Label>
                    <Input
                      id="heroTagline"
                      value={localData.siteContent.heroTagline}
                      onChange={(e) => updateContent("heroTagline", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Título</Label>
                    <Input
                      id="heroTitle"
                      value={localData.siteContent.heroTitle}
                      onChange={(e) => updateContent("heroTitle", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Subtítulo</Label>
                    <Textarea
                      id="heroSubtitle"
                      value={localData.siteContent.heroSubtitle}
                      onChange={(e) => updateContent("heroSubtitle", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Catalog Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Sección Catálogo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="catalogTitle">Título</Label>
                    <Input
                      id="catalogTitle"
                      value={localData.siteContent.catalogTitle}
                      onChange={(e) => updateContent("catalogTitle", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catalogSubtitle">Subtítulo</Label>
                    <Textarea
                      id="catalogSubtitle"
                      value={localData.siteContent.catalogSubtitle}
                      onChange={(e) => updateContent("catalogSubtitle", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">¿Por qué elegirnos?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whyChooseUsTitle">Título</Label>
                    <Input
                      id="whyChooseUsTitle"
                      value={localData.siteContent.whyChooseUsTitle}
                      onChange={(e) => updateContent("whyChooseUsTitle", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whyChooseUsSubtitle">Subtítulo</Label>
                    <Textarea
                      id="whyChooseUsSubtitle"
                      value={localData.siteContent.whyChooseUsSubtitle}
                      onChange={(e) => updateContent("whyChooseUsSubtitle", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Nuestra Historia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aboutTitle">Título</Label>
                    <Input
                      id="aboutTitle"
                      value={localData.siteContent.aboutTitle}
                      onChange={(e) => updateContent("aboutTitle", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutText">Texto (usa líneas vacías para separar párrafos)</Label>
                    <Textarea
                      id="aboutText"
                      value={localData.siteContent.aboutText}
                      onChange={(e) => updateContent("aboutText", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={8}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Gallery Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Sección Galería</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="galleryTitle">Título</Label>
                    <Input
                      id="galleryTitle"
                      value={localData.siteContent.galleryTitle}
                      onChange={(e) => updateContent("galleryTitle", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallerySubtitle">Subtítulo</Label>
                    <Textarea
                      id="gallerySubtitle"
                      value={localData.siteContent.gallerySubtitle}
                      onChange={(e) => updateContent("gallerySubtitle", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Sección Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactTitle">Título</Label>
                    <Input
                      id="contactTitle"
                      value={localData.siteContent.contactTitle}
                      onChange={(e) => updateContent("contactTitle", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactSubtitle">Subtítulo</Label>
                    <Textarea
                      id="contactSubtitle"
                      value={localData.siteContent.contactSubtitle}
                      onChange={(e) => updateContent("contactSubtitle", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Footer Section */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-serif">Footer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerDescription">Descripción</Label>
                    <Textarea
                      id="footerDescription"
                      value={localData.siteContent.footerDescription}
                      onChange={(e) => updateContent("footerDescription", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="footerPhone">Teléfono</Label>
                      <Input
                        id="footerPhone"
                        value={localData.siteContent.footerPhone}
                        onChange={(e) => updateContent("footerPhone", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footerEmail">Email</Label>
                      <Input
                        id="footerEmail"
                        type="email"
                        value={localData.siteContent.footerEmail}
                        onChange={(e) => updateContent("footerEmail", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-foreground">Gestionar Galería</h2>
              <Button
                onClick={addGalleryImage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Imagen
              </Button>
            </div>

            <div className="space-y-4">
              {[...localData.galleryImages]
                .sort((a, b) => a.order - b.order)
                .map((image, index) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveGalleryImage(image.id, "up")}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <GripVertical className="w-5 h-5 text-foreground/30 mx-auto" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveGalleryImage(image.id, "down")}
                          disabled={index === localData.galleryImages.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        <Label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          {uploadingGallery ? (
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                          ) : (
                            <Upload className="w-5 h-5 text-white" />
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleGalleryImageUpload(image.id, e)}
                            disabled={uploadingGallery}
                          />
                        </Label>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`alt-${image.id}`}>Texto alternativo</Label>
                        <Input
                          id={`alt-${image.id}`}
                          value={image.alt}
                          onChange={(e) => updateGalleryImage(image.id, "alt", e.target.value)}
                          placeholder="Descripción de la imagen"
                          className="rounded-lg"
                        />
                      </div>

                      <Badge variant="secondary" className="flex-shrink-0">
                        #{index + 1}
                      </Badge>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteGalleryImage(image.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
