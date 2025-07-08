import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/api"

// Simulação de banco de dados em memória (será substituído por banco real)
let products: Product[] = [
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "6",
    name: "Piteira de Vidro",
    price: 12.0,
    image: "/placeholder.svg?height=200&width=200",
    description: "Piteira de vidro borosilicato",
    category: "diversos",
    brand: "Premium Glass",
    active: true,
  },
]

export async function GET() {
  try {
    return NextResponse.json({ products, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newProduct: Product = {
      id: Date.now().toString(),
      ...body,
      active: true,
    }

    products.push(newProduct)

    return NextResponse.json({ product: newProduct, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const productIndex = products.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    products[productIndex] = { ...products[productIndex], ...updateData }

    return NextResponse.json({ product: products[productIndex], success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    products = products.filter((p) => p.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 })
  }
}
