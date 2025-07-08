"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, LinkIcon, X, ImageIcon, Camera } from "lucide-react"
import Image from "next/image"
import { validateImageFile } from "@/lib/admin-data"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url")
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Erro ao processar arquivo:", error)
      alert("Erro ao processar arquivo")
      setIsLoading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const clearImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-white">Imagem do Produto</Label>

      {/* Seletor de modo */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setUploadMode("url")
            clearImage()
          }}
          className={uploadMode === "url" ? "bg-yellow-400 text-black" : "border-gray-600"}
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setUploadMode("file")
            if (value && !value.startsWith("data:")) {
              clearImage()
            }
          }}
          className={uploadMode === "file" ? "bg-yellow-400 text-black" : "border-gray-600"}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Campo URL */}
      {uploadMode === "url" && (
        <div className="space-y-2">
          <Input
            placeholder="https://exemplo.com/imagem.jpg"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
          <p className="text-xs text-gray-500">Cole a URL de uma imagem da internet</p>
        </div>
      )}

      {/* Campo Upload */}
      {uploadMode === "file" && (
        <div className="space-y-2">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

          {/* Área de drag and drop */}
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              dragActive ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600 hover:border-gray-500 bg-gray-800"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <CardContent className="p-4 lg:p-6 text-center">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-sm text-gray-400">Processando imagem...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-center space-x-2">
                    <Upload className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
                    <Camera className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm lg:text-base">
                      Clique para selecionar ou arraste uma imagem
                    </p>
                    <p className="text-xs lg:text-sm text-gray-400">JPG, PNG, WebP ou GIF até 5MB</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 mt-2"
                  >
                    Escolher Arquivo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-gray-500">
            Você pode arrastar e soltar uma imagem ou clicar para selecionar do seu dispositivo
          </p>
        </div>
      )}

      {/* Preview da imagem */}
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-400">Preview:</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearImage}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-7"
            >
              <X className="h-3 w-3 mr-1" />
              Remover
            </Button>
          </div>
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <Image
              src={value || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => {
                console.error("Erro ao carregar imagem")
                onChange("")
              }}
            />
          </div>
          {value.startsWith("data:") && (
            <div className="text-xs text-green-400 flex items-center">
              <ImageIcon className="h-3 w-3 mr-1" />
              Imagem carregada do dispositivo
            </div>
          )}
        </div>
      )}
    </div>
  )
}
