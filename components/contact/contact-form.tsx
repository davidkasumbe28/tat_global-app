import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export default function ContactForm({ emuted = true }: { emuted?: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <Skeleton emuted={emuted}>
        <h2 className="text-3xl font-bold mb-8">Envoyez-Nous un Message</h2>
      </Skeleton>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Skeleton emuted={emuted}>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nom Complet
            </label>
          </Skeleton>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={emuted}
            required
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "Votre nom"}
          />
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
          </Skeleton>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={emuted}
            required
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "Votre@email.com"}
          />
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Sujet
            </label>
          </Skeleton>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={emuted}
            required
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "Sujet de votre message"}
          />
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
          </Skeleton>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={emuted}
            required
            rows={5}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "Votre message..."}
          />
        </div>
        <Button
          type="submit"
          disabled={emuted}
          variant={emuted ? "emuted" : "default"}
          className={cn(
            "w-full",
            !emuted && "bg-foreground text-background hover:bg-primary-dark"
          )}
        >
          <Send className="w-4 h-4 mr-2" />
          Envoyer le Message
        </Button>
        {submitted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Merci! Votre message a été envoyé avec succès.
          </div>
        )}
      </form>
    </div>
  );
}
