import { isPossiblePhoneNumber } from "libphonenumber-js"

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (password.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères")
  if (!/[A-Z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une majuscule")
  if (!/[a-z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une minuscule")
  if (!/[0-9]/.test(password)) errors.push("Le mot de passe doit contenir au moins un chiffre")
  return { valid: errors.length === 0, errors }
}

export function validatePhone(phone: string): boolean {
  const isValid = isPossiblePhoneNumber(phone)
  return isValid
}

export function validateForm(formData: Record<string, any>, rules: Record<string, string[]>): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field]

    for (const rule of fieldRules) {
      if (rule === "required" && (!value || value.trim() === "")) {
        errors[field] = `${field} est requis`
        break
      }
      if (rule === "email" && !validateEmail(value)) {
        errors[field] = "Email invalide"
        break
      }
      if (rule === "phone" && !validatePhone(value)) {
        errors[field] = "Numéro de téléphone invalide"
        break
      }
      if (rule.startsWith("min:")) {
        const min = Number.parseInt(rule.split(":")[1])
        if (value.length < min) {
          errors[field] = `${field} doit contenir au moins ${min} caractères`
          break
        }
      }
    }
  }

  return errors
}
