import { type NextRequest, NextResponse } from "next/server"
import type { Order } from "@/lib/api"

// Simulação de banco de dados para pedidos
const orders: Order[] = []

export async function GET() {
  try {
    return NextResponse.json({ orders, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newOrder: Order = {
      id: Date.now().toString(),
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(newOrder)

    // Aqui você pode integrar com WhatsApp Business API
    // ou outros sistemas de notificação

    return NextResponse.json({ order: newOrder, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const orderIndex = orders.findIndex((o) => o.id === id)
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    orders[orderIndex] = { ...orders[orderIndex], ...updateData }

    return NextResponse.json({ order: orders[orderIndex], success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 })
  }
}
