"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, EyeOff, MapPin, DollarSign } from "lucide-react"
import { initialRegions, type Region } from "@/lib/admin-data"

export default function AdminRegioes() {
  const [regions, setRegions] = useState<Region[]>(initialRegions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    ceps: "",
    shippingCost: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cepsArray = formData.ceps
      .split(",")
      .map((cep) => cep.trim().replace(/\D/g, "").slice(0, 5))
      .filter((cep) => cep.length === 5)

    if (cepsArray.length === 0) {
      alert("Por favor, insira pelo menos um CEP válido")
      return
    }

    if (editingRegion) {
      // Editar região existente
      setRegions((prev) =>
        prev.map((r) =>
          r.id === editingRegion.id
            ? {
                ...r,
                name: formData.name,
                ceps: cepsArray,
                shippingCost: Number.parseFloat(formData.shippingCost),
              }
            : r,
        ),
      )
    } else {
      // Adicionar nova região
      const newRegion: Region = {
        id: Date.now().toString(),
        name: formData.name,
        ceps: cepsArray,
        shippingCost: Number.parseFloat(formData.shippingCost),
        active: true,
      }
      setRegions((prev) => [...prev, newRegion])
    }

    // Reset form
    setFormData({
      name: "",
      ceps: "",
      shippingCost: "",
    })
    setEditingRegion(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (region: Region) => {
    setEditingRegion(region)
    setFormData({
      name: region.name,
      ceps: region.ceps.join(", "),
      shippingCost: region.shippingCost.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (regionId: string) => {
    if (confirm("Tem certeza que deseja excluir esta região?")) {
      setRegions((prev) => prev.filter((r) => r.id !== regionId))
    }
  }

  const toggleRegionStatus = (regionId: string) => {
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, active: !r.active } : r)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Gerenciar Regiões</h1>
          <p className="text-gray-400">Configure regiões de entrega e valores de frete</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={() => {
                setEditingRegion(null)
                setFormData({
                  name: "",
                  ceps: "",
                  shippingCost: "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Região
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">
                {editingRegion ? "Editar Região" : "Adicionar Nova Região"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Configure a região de entrega e o valor do frete
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Região</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-700"
                  placeholder="ex: Tucuruvi"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ceps">CEPs (separados por vírgula)</Label>
                <Input
                  id="ceps"
                  value={formData.ceps}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ceps: e.target.value }))}
                  className="bg-gray-800 border-gray-700"
                  placeholder="ex: 02201, 02202, 02203"
                  required
                />
                <p className="text-xs text-gray-500">Digite apenas os primeiros 5 dígitos de cada CEP</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingCost">Valor do Frete (R$)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  step="0.01"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shippingCost: e.target.value }))}
                  className="bg-gray-800 border-gray-700"
                  placeholder="ex: 5.00"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-600"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">
                  {editingRegion ? "Salvar Alterações" : "Adicionar Região"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas das regiões */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Regiões</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{regions.length}</div>
            <p className="text-xs text-gray-400">{regions.filter((r) => r.active).length} ativas</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Frete Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R${" "}
              {regions.length > 0
                ? (regions.reduce((sum, r) => sum + r.shippingCost, 0) / regions.length).toFixed(2)
                : "0.00"}
            </div>
            <p className="text-xs text-gray-400">Valor médio por região</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">CEPs Cobertos</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{regions.reduce((sum, r) => sum + r.ceps.length, 0)}</div>
            <p className="text-xs text-gray-400">Total de CEPs cadastrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de regiões */}
      <div className="grid grid-cols-1 gap-4">
        {regions.map((region) => (
          <Card key={region.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{region.name}</h3>
                    <Badge
                      variant={region.active ? "default" : "secondary"}
                      className={region.active ? "bg-green-600" : "bg-gray-600"}
                    >
                      {region.active ? "Ativa" : "Inativa"}
                    </Badge>
                    <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                      R$ {region.shippingCost.toFixed(2)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      <strong>CEPs cobertos:</strong> {region.ceps.length} códigos
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {region.ceps.slice(0, 10).map((cep, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {cep}
                        </Badge>
                      ))}
                      {region.ceps.length > 10 && (
                        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          +{region.ceps.length - 10} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleRegionStatus(region.id)}
                    className={`border-gray-600 ${
                      region.active
                        ? "text-green-500 hover:bg-green-500 hover:text-white"
                        : "text-gray-500 hover:bg-gray-500 hover:text-white"
                    }`}
                  >
                    {region.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(region)}
                    className="border-gray-600 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(region.id)}
                    className="border-gray-600 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {regions.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nenhuma região cadastrada</p>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Região
          </Button>
        </div>
      )}
    </div>
  )
}
