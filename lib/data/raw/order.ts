const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  quoted: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-green-600 text-white",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  quoted: "Devis reçu",
  accepted: "Acceptée",
  in_progress: "En cours",
  completed: "Complétée",
};

export const order = {
  status: {
    colors: statusColors,
    labels: statusLabels,
  },
};
