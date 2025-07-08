// API client para comunicação com o backend
const API_BASE_URL = process.env.NODE_ENV === "production" ? "https://your-app.vercel.app" : "http://localhost:3000"

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

export interface Order {
  id: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
  shippingCost: number
  customerInfo: {
    name: string
    phone: string
    address: string
    cep: string
  }
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled"
  createdAt: string
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/api/products`)
    const data = await response.json()
    return data.products || []
  },

  create: async (product: Omit<Product, "id" | "active">): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    const data = await response.json()
    return data.product
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...product }),
    })
    const data = await response.json()
    return data.product
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/api/products?id=${id}`, {
      method: "DELETE",
    })
  },
}

// Regions API
export const regionsApi = {
  getAll: async (): Promise<Region[]> => {
    const response = await fetch(`${API_BASE_URL}/api/regions`)
    const data = await response.json()
    return data.regions || []
  },

  create: async (region: Omit<Region, "id" | "active">): Promise<Region> => {
    const response = await fetch(`${API_BASE_URL}/api/regions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(region),
    })
    const data = await response.json()
    return data.region
  },

  update: async (id: string, region: Partial<Region>): Promise<Region> => {
    const response = await fetch(`${API_BASE_URL}/api/regions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...region }),
    })
    const data = await response.json()
    return data.region
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/api/regions?id=${id}`, {
      method: "DELETE",
    })
  },
}

// Orders API
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/api/orders`)
    const data = await response.json()
    return data.orders || []
  },

  create: async (order: Omit<Order, "id" | "createdAt">): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
    const data = await response.json()
    return data.order
  },

  updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    const data = await response.json()
    return data.order
  },
}
