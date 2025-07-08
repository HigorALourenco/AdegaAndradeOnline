"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react"
import { initialProducts, type Product } from "@/lib/admin-data"
import Image from "next/image"
import ImageUpload from "@/components/image-upload"

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState("energetico")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "energetico",
    volume: "",
    alcohol: "",
    brand: "",
    flavor: "",
    image: "",
  })

  const categories = [
    { id: "energetico", name: "Energéticos", icon: "⚡" },
    { id: "whisky", name: "Whisky", icon: "🥃" },
    { id: "vodka", name: "Vodka", icon: "🍸" },
    { id: "gin", name: "Gin", icon: "🍹" },
    { id: "cerveja", name: "Cerveja", icon: "🍺" },
    { id: "essencias", name: "Essências", icon: "🌿" },
    { id: "carvao", name: "Carvão", icon: "🔥" },
    { id: "diversos", name: "Diversos", icon: "🛍️" },
  ]

  const itemsPerPage = 5
  const maxItemsPerCategory = 30

  const filteredProducts = products.filter((p) => p.category === selectedCategory)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingProduct) {
      // Editar produto existente
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                price: Number.parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                volume: formData.volume,
                alcohol: formData.alcohol,
                brand: formData.brand,
                flavor: formData.flavor,
                image: formData.image || "/placeholder.svg?height=200&width=200",
              }
            : p,
        ),
      )
    } else {
      // Adicionar novo produto
      const categoryProducts = products.filter((p) => p.category === formData.category)
      if (categoryProducts.length >= maxItemsPerCategory) {
        alert(`Máximo de ${maxItemsPerCategory} produtos por categoria atingido!`)
        return
      }

      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: Number.parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        volume: formData.volume,
        alcohol: formData.alcohol,
        brand: formData.brand,
        flavor: formData.flavor,
        image: formData.image || "/placeholder.svg?height=200&width=200",
        active: true,
      }
      setProducts((prev) => [...prev, newProduct])
    }

    // Reset form
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "energetico",
      volume: "",
      alcohol: "",
      brand: "",
      flavor: "",
      image: "",
    })
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      volume: product.volume || "",
      alcohol: product.alcohol || "",
      brand: product.brand || "",
      flavor: product.flavor || "",
      image: product.image,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  const toggleProductStatus = (productId: string) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p)))
  }

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-yellow-400">Gerenciar Produtos</h1>
          <p className="text-gray-400 text-sm lg:text-base">Adicione, edite ou remova produtos do cardápio</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-500 w-full sm:w-auto"
              onClick={() => {
                setEditingProduct(null)
                setFormData({
                  name: "",
                  price: "",
                  description: "",
                  category: selectedCategory,
                  volume: "",
                  alcohol: "",
                  brand: "",
                  flavor: "",
                  image: "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white w-[95vw] max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-yellow-400">
                {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">Preencha as informações do produto</DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 pr-4">
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-800 border-gray-700 min-h-[80px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                      className="bg-gray-800 border-gray-700"
                      placeholder="ex: Adalya, Al Fakher"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume/Tamanho</Label>
                    <Input
                      id="volume"
                      value={formData.volume}
                      onChange={(e) => setFormData((prev) => ({ ...prev, volume: e.target.value }))}
                      className="bg-gray-800 border-gray-700"
                      placeholder="ex: 250ml, 50g, 1kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alcohol">Teor Alcoólico</Label>
                    <Input
                      id="alcohol"
                      value={formData.alcohol}
                      onChange={(e) => setFormData((prev) => ({ ...prev, alcohol: e.target.value }))}
                      className="bg-gray-800 border-gray-700"
                      placeholder="ex: 40%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flavor">Sabor/Tipo</Label>
                    <Input
                      id="flavor"
                      value={formData.flavor}
                      onChange={(e) => setFormData((prev) => ({ ...prev, flavor: e.target.value }))}
                      className="bg-gray-800 border-gray-700"
                      placeholder="ex: Love 66, Uva, Menta"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <ImageUpload
                    value={formData.image}
                    onChange={(value) => setFormData((prev) => ({ ...prev, image: value }))}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500 w-full sm:w-auto">
                    {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs por categoria */}
      <Tabs
        value={selectedCategory}
        onValueChange={(value) => {
          setSelectedCategory(value)
          setCurrentPage(1)
        }}
        className="h-full flex flex-col"
      >
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-8 bg-gray-900 border border-gray-800 flex-shrink-0 min-w-[640px]">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-white text-xs lg:text-sm p-2 lg:p-3"
              >
                <span className="mr-1 lg:mr-2">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6 flex-1 flex flex-col min-h-0">
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <h3 className="text-lg lg:text-xl font-semibold text-white">
                    {category.icon} {category.name}
                  </h3>
                  <Badge variant="outline" className="border-gray-600 text-gray-300 w-fit">
                    {filteredProducts.length}/{maxItemsPerCategory} produtos
                  </Badge>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-600 h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-400 px-2">
                      {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-600 h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Lista de produtos com scroll */}
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-1 gap-4 pr-4">
                    {paginatedProducts.map((product) => (
                      <Card key={product.id} className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                <h4 className="font-semibold text-white text-sm lg:text-base">{product.name}</h4>
                                <Badge
                                  variant={product.active ? "default" : "secondary"}
                                  className={`${product.active ? "bg-green-600" : "bg-gray-600"} w-fit`}
                                >
                                  {product.active ? "Ativo" : "Inativo"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-lg font-bold text-yellow-400">R$ {product.price.toFixed(2)}</span>
                                {product.volume && (
                                  <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                    {product.volume}
                                  </Badge>
                                )}
                                {product.alcohol && (
                                  <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                    {product.alcohol}
                                  </Badge>
                                )}
                                {product.brand && (
                                  <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                    {product.brand}
                                  </Badge>
                                )}
                                {product.flavor && (
                                  <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                    {product.flavor}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-row sm:flex-col lg:flex-row items-center space-x-2 sm:space-x-0 sm:space-y-2 lg:space-y-0 lg:space-x-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => toggleProductStatus(product.id)}
                                className={`border-gray-600 h-8 w-8 ${
                                  product.active
                                    ? "text-green-500 hover:bg-green-500 hover:text-white"
                                    : "text-gray-500 hover:bg-gray-500 hover:text-white"
                                }`}
                              >
                                {product.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(product)}
                                className="border-gray-600 text-blue-500 hover:bg-blue-500 hover:text-white h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(product.id)}
                                className="border-gray-600 text-red-500 hover:bg-red-500 hover:text-white h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 flex-shrink-0">
                  <p className="text-gray-400 mb-4">Nenhum produto encontrado nesta categoria</p>
                  <Button
                    className="bg-yellow-400 text-black hover:bg-yellow-500"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Produto
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
