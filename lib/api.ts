import Fetch from "@/modules/class/fetch/Fetch";

function api() {
  const newFetch = new Fetch("/api", { "Content-Type": "application/json" });

  return newFetch;
}

export default api()