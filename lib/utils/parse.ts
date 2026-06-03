export function parseDevice(ua: string) {
  if (ua.includes("iPhone")) return "iPhone"
  if (ua.includes("Android")) return "Android"
  if (ua.includes("Mac")) return "Mac"
  return "Desktop"
}