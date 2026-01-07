"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Heart } from "lucide-react"
import { useDb } from "@/lib/db-context"
import { useRouter } from "next/navigation"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { setIsAdmin } = useDb()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "Jose_Pl00") {
      sessionStorage.setItem("amigurumi_admin", "true")
      setIsAdmin(true)
      router.push("/admin")
    } else {
      setError("Contraseña incorrecta")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-foreground/60 text-sm mt-2">Ingresa tu contraseña para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-lg space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                placeholder="••••••••"
                className="pl-10 rounded-xl"
                autoFocus
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
            Ingresar
          </Button>
        </form>

        <p className="text-center text-sm text-foreground/50 mt-6">
          <a href="/" className="hover:text-primary transition-colors">
            ← Volver al sitio
          </a>
        </p>
      </div>
    </div>
  )
}
