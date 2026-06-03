"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Merci de votre abonnement!")
        setEmail("")
      } else {
        setError(data.error || "Erreur lors de l'abonnement")
      }
    } catch (err) {
      setError("Erreur lors de l'abonnement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-primary-dark px-6 py-3">
        {loading ? "..." : "S'abonner"}
      </Button>

      {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </form>
  )
}
