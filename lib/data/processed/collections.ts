
const featuredCollections = [
  {
    id: 1,
    name: "Collection Été 2025",
    description: "Découvrez nos pièces essentielles pour l'été",
    image: "/summer-collection-display.png",
    color: "bg-blue-50",
  },
  {
    id: 2,
    name: "Parfums Luxe",
    description: "Sélection exclusive de parfums premium",
    image: "/luxury-perfume.png",
    color: "bg-purple-50",
  },
  {
    id: 3,
    name: "Sneakers Tendance",
    description: "Les meilleures marques de sneakers du moment",
    image: "/sneakers-trend.jpg",
    color: "bg-green-50",
  },
  
]

const collectionProducts : Record<
  number,
  Array<{
    id: number
    name: string
    category: string
    price: number
    image: string
    rating: number
    collectionId: number
  }>
> = {
  1: [
    {
      id: 1,
      name: "Chemise Premium Coton",
      category: "Vêtements",
      price: 89.99,
      image: "/premium-shirt.jpg",
      rating: 4.5,
      collectionId: 1,
    },
    {
      id: 4,
      name: "Pantalon Élégant Gris",
      category: "Vêtements",
      price: 99.99,
      image: "/elegant-gray-pants.jpg",
      rating: 4.4,
      collectionId: 1,
    },
    {
      id: 7,
      name: "T-Shirt Blanc Logo",
      category: "Vêtements",
      price: 49.99,
      image: "/white-logo-tshirt.jpg",
      rating: 4.3,
      collectionId: 1,
    },
  ],
  2: [
    {
      id: 3,
      name: "Parfum Essence Luxury",
      category: "Parfums",
      price: 79.99,
      image: "/luxury-perfume-bottle.png",
      rating: 4.6,
      collectionId: 2,
    },
    {
      id: 6,
      name: "Eau de Toilette Citron",
      category: "Parfums",
      price: 69.99,
      image: "/eau-de-toilette-lemon.jpg",
      rating: 4.5,
      collectionId: 2,
    },
  ],
  3: [
    {
      id: 2,
      name: "Sneakers Urbaines Noires",
      category: "Chaussures",
      price: 129.99,
      image: "/urban-sneakers-black.jpg",
      rating: 4.8,
      collectionId: 3,
    },
    {
      id: 5,
      name: "Boots Cuir Marron",
      category: "Chaussures",
      price: 159.99,
      image: "/leather-brown-boots.jpg",
      rating: 4.7,
      collectionId: 3,
    },
    {
      id: 8,
      name: "Sandales Beige Été",
      category: "Chaussures",
      price: 59.99,
      image: "/summer-sandals-beige.jpg",
      rating: 4.4,
      collectionId: 3,
    },
  ],
}

const collections  = {
  featuredCollections ,
  collectionProducts
}

export default collections