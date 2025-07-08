"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, MessageCircle, Calendar, Timer, Moon } from "lucide-react"
import {
  horariosIniciais,
  type ConfigHorarios,
  type HorarioFuncionamento,
  verificarHorarioFuncionamento,
  obterStatusSemana,
  verificarSeMadrugada,
} from "@/lib/horarios-data"

export default function AdminHorarios() {
  const [config, setConfig] = useState<ConfigHorarios>(horariosIniciais)
  const [isSaving, setIsSaving] = useState(false)

  const statusAtual = verificarHorarioFuncionamento(config.horarios)
  const statusSemana = obterStatusSemana(config.horarios)
  const isMadrugada = verificarSeMadrugada(new Date())

  const handleHorarioChange = (index: number, field: keyof HorarioFuncionamento, value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      horarios: prev.horarios.map((horario, i) => (i === index ? { ...horario, [field]: value } : horario)),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Aqui você salvaria no localStorage ou banco de dados
    localStorage.setItem("configHorarios", JSON.stringify(config))

    setIsSaving(false)
    alert("Horários salvos com sucesso!")
  }

  const resetToDefault = () => {
    if (confirm("Tem certeza que deseja restaurar os horários padrão?")) {
      setConfig(horariosIniciais)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Horários de Funcionamento</h1>
          <p className="text-gray-400">Funcionamento: Quinta, Sexta, Sábado e Domingo</p>
        </div>
        <div className="flex items-center space-x-2">
          {isMadrugada && (
            <Badge variant="outline" className="border-purple-400 text-purple-400 mr-2">
              🌙 Madrugada
            </Badge>
          )}
          <Badge
            variant={statusAtual.aberto ? "default" : "secondary"}
            className={statusAtual.aberto ? "bg-green-600" : "bg-red-600"}
          >
            {statusAtual.aberto ? "🟢 Aberto Agora" : "🔴 Fechado Agora"}
          </Badge>
        </div>
      </div>

      {/* Status em tempo real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center">
              <Timer className="h-5 w-5 mr-2" />
              Status Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Agora</p>
                <p className={`text-lg font-semibold ${statusAtual.aberto ? "text-green-400" : "text-red-400"}`}>
                  {statusAtual.aberto ? "🟢 Aberto" : "🔴 Fechado"}
                </p>
                {statusAtual.aberto && statusAtual.tempoRestante && (
                  <p className="text-sm text-yellow-400">Fecha em {statusAtual.tempoRestante}</p>
                )}
                {isMadrugada && <p className="text-sm text-purple-400">🌙 Horário da madrugada</p>}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Horário Atual</p>
                <p className="text-lg font-semibold text-white">
                  {new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>

            {!statusAtual.aberto && (
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-sm text-blue-400 mb-1">Próxima Abertura</p>
                <p className="text-lg font-semibold text-white">{statusAtual.proximaData}</p>
                <p className="text-yellow-400">às {statusAtual.proximoHorario}</p>
                {statusAtual.tempoParaAbertura && (
                  <p className="text-sm text-green-400 mt-1">
                    {isMadrugada ? "Abre em" : "Faltam"} {statusAtual.tempoParaAbertura}
                  </p>
                )}
              </div>
            )}

            {/* Informação sobre madrugada */}
            {isMadrugada && (
              <div className="p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <Moon className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-sm text-purple-400 font-medium">Horário da Madrugada</span>
                </div>
                <p className="text-sm text-purple-300">Período identificado: 00:01 às 05:59</p>
                <p className="text-xs text-gray-400 mt-1">Pop-up especial será exibido para visitantes neste horário</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Sequência da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusSemana.map((dia) => (
                <div
                  key={dia.dia}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    dia.isHoje
                      ? dia.isAberto
                        ? "bg-green-900/20 border-green-800"
                        : "bg-blue-900/20 border-blue-800"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className={`font-medium ${dia.isHoje ? "text-yellow-400" : "text-white"}`}>
                        {dia.dia}
                        {dia.isHoje && " (Hoje)"}
                      </span>
                      <span className="text-sm text-gray-400">
                        {dia.abertura} - {dia.fechamento}
                        {dia.fechamento <= dia.abertura && <span className="text-xs ml-1">*</span>}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {dia.isHoje && dia.isAberto && (
                      <Badge className="bg-green-600">
                        🟢 Aberto
                        {dia.tempoRestante && <span className="ml-1">({dia.tempoRestante})</span>}
                      </Badge>
                    )}
                    {dia.isHoje && !dia.isAberto && (
                      <Badge variant="secondary">{isMadrugada ? "🌙 Madrugada" : "🔴 Fechado"}</Badge>
                    )}
                    {!dia.isHoje && <Badge variant="outline">Programado</Badge>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">* Funcionamento até o dia seguinte</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuração de horários */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-400">Configurar Horários de Funcionamento</CardTitle>
          <p className="text-gray-400">Dias de funcionamento: Quinta, Sexta, Sábado e Domingo</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.horarios
            .sort((a, b) => a.ordem - b.ordem)
            .map((horario, index) => (
              <div key={horario.dia} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-20">
                  <Label className="text-white font-medium">{horario.dia}</Label>
                  <p className="text-xs text-gray-400">Dia {horario.ordem}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={horario.ativo}
                    onCheckedChange={(checked) => handleHorarioChange(index, "ativo", checked)}
                  />
                  <Label className="text-sm text-gray-400">{horario.ativo ? "Ativo" : "Inativo"}</Label>
                </div>

                {horario.ativo && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm text-gray-400">Abertura:</Label>
                      <Input
                        type="time"
                        value={horario.abertura}
                        onChange={(e) => handleHorarioChange(index, "abertura", e.target.value)}
                        className="w-24 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label className="text-sm text-gray-400">Fechamento:</Label>
                      <Input
                        type="time"
                        value={horario.fechamento}
                        onChange={(e) => handleHorarioChange(index, "fechamento", e.target.value)}
                        className="w-24 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    {horario.fechamento <= horario.abertura && (
                      <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                        Até o dia seguinte
                      </Badge>
                    )}
                  </>
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Mensagens personalizadas */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Mensagens Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mensagemFechado" className="text-white">
              Mensagem quando fechado (horário normal)
            </Label>
            <Textarea
              id="mensagemFechado"
              value={config.mensagemFechado}
              onChange={(e) => setConfig((prev) => ({ ...prev, mensagemFechado: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagemMadrugada" className="text-white flex items-center">
              <Moon className="h-4 w-4 mr-2" />
              Mensagem para horário da madrugada (00:01 - 05:59)
            </Label>
            <Textarea
              id="mensagemMadrugada"
              value={config.mensagemMadrugada}
              onChange={(e) => setConfig((prev) => ({ ...prev, mensagemMadrugada: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappAgendamento" className="text-white">
              Mensagem para agendamento via WhatsApp (horário normal)
            </Label>
            <Textarea
              id="whatsappAgendamento"
              value={config.whatsappAgendamento}
              onChange={(e) => setConfig((prev) => ({ ...prev, whatsappAgendamento: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappMadrugada" className="text-white flex items-center">
              <Moon className="h-4 w-4 mr-2" />
              Mensagem para agendamento na madrugada
            </Label>
            <Textarea
              id="whatsappMadrugada"
              value={config.whatsappMadrugada}
              onChange={(e) => setConfig((prev) => ({ ...prev, whatsappMadrugada: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetToDefault} className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Restaurar Padrão
        </Button>

        <Button onClick={handleSave} disabled={isSaving} className="bg-yellow-400 text-black hover:bg-yellow-500">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
