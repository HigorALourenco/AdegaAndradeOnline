export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  volume?: string
  alcohol?: string
  brand?: string
  flavor?: string
  active: boolean
}

export interface Region {
  id: string
  name: string
  ceps: string[]
  shippingCost: number
  active: boolean
}

export interface SaleData {
  date: string
  amount: number
  orders: number
}

// Dados simulados de vendas
export const salesData: SaleData[] = [
  { date: "2024-01-01", amount: 1250.5, orders: 15 },
  { date: "2024-01-02", amount: 980.3, orders: 12 },
  { date: "2024-01-03", amount: 1450.8, orders: 18 },
  { date: "2024-01-04", amount: 2100.25, orders: 25 },
  { date: "2024-01-05", amount: 1800.6, orders: 22 },
  { date: "2024-01-06", amount: 2250.9, orders: 28 },
  { date: "2024-01-07", amount: 1950.4, orders: 24 },
]

// Produtos iniciais
export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Red Bull Energy Drink",
    price: 8.5,
    image: "/placeholder.svg?height=200&width=200",
    description: "Bebida energética original",
    category: "energetico",
    volume: "250ml",
    active: true,
  },
  {
    id: "2",
    name: "Monster Energy",
    price: 9.9,
    image: "/placeholder.svg?height=200&width=200",
    description: "Energia extrema para momentos intensos",
    category: "energetico",
    volume: "473ml",
    active: true,
  },
  {
    id: "4",
    name: "Johnnie Walker Red Label",
    price: 89.9,
    image: "/placeholder.svg?height=200&width=200",
    description: "Whisky escocês blended",
    category: "whisky",
    volume: "1L",
    alcohol: "40%",
    active: true,
  },
  {
    id: "16",
    name: "Essência Adalya Love 66",
    price: 25.0,
    image: "/placeholder.svg?height=200&width=200",
    description: "Essência premium com aroma frutado",
    category: "essencias",
    volume: "50g",
    brand: "Adalya",
    flavor: "Love 66",
    active: true,
  },
  {
    id: "20",
    name: "Carvão Coconara",
    price: 18.0,
    image: "/placeholder.svg?height=200&width=200",
    description: "Carvão natural de coco premium",
    category: "carvao",
    volume: "1kg",
    brand: "Coconara",
    active: true,
  },
  {
    id: "23",
    name: "Piteira de Vidro",
    price: 12.0,
    image: "/placeholder.svg?height=200&width=200",
    description: "Piteira de vidro borosilicato",
    category: "diversos",
    brand: "Premium Glass",
    active: true,
  },
]

// Regiões iniciais
export const initialRegions: Region[] = [
  {
    id: "1",
    name: "Tucuruvi",
    ceps: ["02201", "02202", "02203", "02204", "02205"],
    shippingCost: 5.0,
    active: true,
  },
  {
    id: "2",
    name: "Vila Medeiros",
    ceps: ["02216", "02217", "02218", "02219", "02220"],
    shippingCost: 7.0,
    active: true,
  },
  {
    id: "3",
    name: "Santana",
    ceps: ["02401", "02402", "02403", "02404", "02405"],
    shippingCost: 15.0,
    active: true,
  },
]

// Função para converter File para base64
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Função para validar tamanho de arquivo
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF." }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Arquivo muito grande. Máximo 5MB." }
  }

  return { valid: true }
}
