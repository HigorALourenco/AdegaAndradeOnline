"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { X, Clock } from "lucide-react"
import { horariosIniciais, type ConfigHorarios, verificarHorarioFuncionamento } from "@/lib/horarios-data"

export default function HorarioFuncionamentoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ConfigHorarios>(horariosIniciais)
  const [initialCheck, setInitialCheck] = useState(false)

  useEffect(() => {
    // Carregar configuração salva
    const savedConfig = localStorage.getItem("configHorarios")
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }

    // Verificar horário apenas uma vez ao carregar a página
    if (!initialCheck) {
      const status = verificarHorarioFuncionamento(
        savedConfig ? JSON.parse(savedConfig).horarios : horariosIniciais.horarios,
      )
      if (!status.aberto) {
        setIsOpen(true)
      }
      setInitialCheck(true)
    }
  }, [initialCheck])

  const handleWhatsAppAgendamento = () => {
    const phoneNumber = "5511948174784"
    const statusAtual = verificarHorarioFuncionamento(config.horarios)

    let message = statusAtual.isMadrugada ? config.whatsappMadrugada : config.whatsappAgendamento

    if (statusAtual.proximaData && statusAtual.proximoHorario) {
      if (statusAtual.isMadrugada && statusAtual.proximaData.includes("Hoje")) {
        message += `\n\nGostaria de agendar para hoje às ${statusAtual.proximoHorario}.`
      } else {
        message += `\n\nGostaria de agendar para ${statusAtual.proximaData} às ${statusAtual.proximoHorario}.`
      }
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  const statusAtual = verificarHorarioFuncionamento(config.horarios)

  // Não renderizar nada se estiver aberto
  if (statusAtual.aberto) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-yellow-400 flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2" />
              Estamos Fechados
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white h-8 w-8"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400 text-sm">
            {statusAtual.isMadrugada ? config.mensagemMadrugada : config.mensagemFechado}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status simples */}
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <Badge variant="secondary" className="bg-red-600 mb-2">
              🔴 Fechado
            </Badge>
            {statusAtual.proximaData && (
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Próxima abertura:</p>
                <p className="text-white font-medium">{statusAtual.proximaData}</p>
                <p className="text-yellow-400 text-sm">às {statusAtual.proximoHorario}</p>
              </div>
            )}
          </div>

          {/* Dias de funcionamento - discreto */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Funcionamos:</p>
            <div className="flex justify-center space-x-1 text-xs">
              {config.horarios
                .filter((h) => h.ativo)
                .sort((a, b) => a.ordem - b.ordem)
                .map((horario, index) => (
                  <span key={horario.dia} className="text-gray-400">
                    {horario.dia}
                    {index < config.horarios.filter((h) => h.ativo).length - 1 && " • "}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleWhatsAppAgendamento}
            className="w-full bg-green-600 text-white hover:bg-green-700 font-medium flex items-center justify-center space-x-2 h-10"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="text-sm">Agendar Pedido</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 h-10"
          >
            <span className="text-sm">Ver Cardápio</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
