import { type NextRequest, NextResponse } from "next/server"
import type { Region } from "@/lib/api"

// Simulação de banco de dados em memória
let regions: Region[] = [
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

export async function GET() {
  try {
    return NextResponse.json({ regions, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar regiões" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newRegion: Region = {
      id: Date.now().toString(),
      ...body,
      active: true,
    }

    regions.push(newRegion)

    return NextResponse.json({ region: newRegion, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar região" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const regionIndex = regions.findIndex((r) => r.id === id)
    if (regionIndex === -1) {
      return NextResponse.json({ error: "Região não encontrada" }, { status: 404 })
    }

    regions[regionIndex] = { ...regions[regionIndex], ...updateData }

    return NextResponse.json({ region: regions[regionIndex], success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar região" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID da região é obrigatório" }, { status: 400 })
    }

    regions = regions.filter((r) => r.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar região" }, { status: 500 })
  }
}
