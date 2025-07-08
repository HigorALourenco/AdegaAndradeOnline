export interface HorarioFuncionamento {
  dia: string
  diaSemana: number // 0 = domingo, 1 = segunda, etc.
  ativo: boolean
  abertura: string
  fechamento: string
  ordem: number // Para ordenação personalizada
}

export interface ConfigHorarios {
  horarios: HorarioFuncionamento[]
  mensagemFechado: string
  mensagemMadrugada: string
  whatsappAgendamento: string
  whatsappMadrugada: string
}

export const horariosIniciais: ConfigHorarios = {
  horarios: [
    { dia: "Quinta", diaSemana: 4, ativo: true, abertura: "18:00", fechamento: "00:00", ordem: 1 },
    { dia: "Sexta", diaSemana: 5, ativo: true, abertura: "18:00", fechamento: "03:00", ordem: 2 },
    { dia: "Sábado", diaSemana: 6, ativo: true, abertura: "18:00", fechamento: "03:00", ordem: 3 },
    { dia: "Domingo", diaSemana: 0, ativo: true, abertura: "15:00", fechamento: "00:00", ordem: 4 },
  ],
  mensagemFechado: "Estamos fechados no momento. Funcionamos de quinta a domingo!",
  mensagemMadrugada: "Estamos fechados durante a madrugada. Que tal agendar seu pedido para hoje?",
  whatsappAgendamento: "Olá! Gostaria de agendar um pedido para quando vocês estiverem abertos.",
  whatsappMadrugada: "Olá! Estou acordado na madrugada e gostaria de agendar um pedido para hoje. Podem me ajudar? 🌙",
}

export interface StatusFuncionamento {
  aberto: boolean
  isMadrugada: boolean
  proximoHorario?: string
  proximaData?: string
  horarioAtual?: string
  tempoRestante?: string
  proximoDiaFuncionamento?: HorarioFuncionamento
  diaAtual?: HorarioFuncionamento
  tempoParaAbertura?: string
}

export const verificarSeMadrugada = (agora: Date): boolean => {
  const hora = agora.getHours()
  const minuto = agora.getMinutes()
  const horaMinutos = hora * 60 + minuto

  // Madrugada: 00:01 às 05:59
  const inicioMadrugada = 0 * 60 + 1 // 00:01
  const fimMadrugada = 5 * 60 + 59 // 05:59

  return horaMinutos >= inicioMadrugada && horaMinutos <= fimMadrugada
}

export const verificarHorarioFuncionamento = (horarios: HorarioFuncionamento[]): StatusFuncionamento => {
  const agora = new Date()
  const diaAtual = agora.getDay()
  const horaAtual = agora.getHours()
  const minutoAtual = agora.getMinutes()
  const horaAtualMinutos = horaAtual * 60 + minutoAtual
  const isMadrugada = verificarSeMadrugada(agora)

  // Encontrar horário do dia atual
  const horarioHoje = horarios.find((h) => h.diaSemana === diaAtual && h.ativo)

  // Verificar se estamos em horário de funcionamento
  if (horarioHoje) {
    const [horaAbertura, minutoAbertura] = horarioHoje.abertura.split(":").map(Number)
    const [horaFechamento, minutoFechamento] = horarioHoje.fechamento.split(":").map(Number)

    const aberturaMinutos = horaAbertura * 60 + minutoAbertura
    let fechamentoMinutos = horaFechamento * 60 + minutoFechamento

    // Se fechamento é menor que abertura, significa que vai até o dia seguinte
    if (fechamentoMinutos <= aberturaMinutos) {
      fechamentoMinutos += 24 * 60 // Adiciona 24 horas
    }

    const aberto = horaAtualMinutos >= aberturaMinutos && horaAtualMinutos < fechamentoMinutos

    if (aberto) {
      // Calcular tempo restante até fechar
      let minutosRestantes = fechamentoMinutos - horaAtualMinutos
      if (minutosRestantes > 24 * 60) {
        minutosRestantes -= 24 * 60
      }

      const horasRestantes = Math.floor(minutosRestantes / 60)
      const minutosRestantesFinal = minutosRestantes % 60

      let tempoRestante = ""
      if (horasRestantes > 0) {
        tempoRestante = `${horasRestantes}h ${minutosRestantesFinal}min`
      } else {
        tempoRestante = `${minutosRestantesFinal}min`
      }

      return {
        aberto: true,
        isMadrugada: false,
        horarioAtual: `${horarioHoje.abertura} - ${horarioHoje.fechamento}`,
        tempoRestante,
        diaAtual: horarioHoje,
      }
    }
  }

  // Se não está aberto, encontrar próximo horário
  const proximoFuncionamento = encontrarProximoFuncionamento(horarios, agora, isMadrugada)

  return {
    aberto: false,
    isMadrugada,
    proximoHorario: proximoFuncionamento.horario,
    proximaData: proximoFuncionamento.data,
    proximoDiaFuncionamento: proximoFuncionamento.diaCompleto,
    diaAtual: horarioHoje,
    tempoParaAbertura: proximoFuncionamento.tempoParaAbertura,
  }
}

const encontrarProximoFuncionamento = (
  horarios: HorarioFuncionamento[],
  dataAtual: Date,
  isMadrugada: boolean,
): { horario: string; data: string; diaCompleto: HorarioFuncionamento; tempoParaAbertura?: string } => {
  const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const diaAtual = dataAtual.getDay()
  const horaAtual = dataAtual.getHours()
  const minutoAtual = dataAtual.getMinutes()

  // Se é madrugada, verificar se há funcionamento hoje
  if (isMadrugada) {
    const horarioHoje = horarios.find((h) => h.diaSemana === diaAtual && h.ativo)
    if (horarioHoje) {
      const [horaAbertura, minutoAbertura] = horarioHoje.abertura.split(":").map(Number)
      const aberturaMinutos = horaAbertura * 60 + minutoAbertura
      const horaAtualMinutos = horaAtual * 60 + minutoAtual

      // Calcular tempo até a abertura
      const minutosAteAbertura = aberturaMinutos - horaAtualMinutos
      const horasAteAbertura = Math.floor(minutosAteAbertura / 60)
      const minutosRestantes = minutosAteAbertura % 60

      let tempoParaAbertura = ""
      if (horasAteAbertura > 0) {
        tempoParaAbertura = `${horasAteAbertura}h ${minutosRestantes}min`
      } else {
        tempoParaAbertura = `${minutosRestantes}min`
      }

      const dataHoje = new Date(dataAtual)
      return {
        horario: horarioHoje.abertura,
        data: `Hoje, ${dataHoje.getDate()} de ${meses[dataHoje.getMonth()]}`,
        diaCompleto: horarioHoje,
        tempoParaAbertura,
      }
    }
  }

  // Verificar se ainda pode abrir hoje (para horários normais)
  const horarioHoje = horarios.find((h) => h.diaSemana === diaAtual && h.ativo)
  if (horarioHoje && !isMadrugada) {
    const [horaAbertura, minutoAbertura] = horarioHoje.abertura.split(":").map(Number)
    const aberturaMinutos = horaAbertura * 60 + minutoAbertura
    const horaAtualMinutos = horaAtual * 60 + minutoAtual

    if (horaAtualMinutos < aberturaMinutos) {
      // Ainda vai abrir hoje
      const minutosAteAbertura = aberturaMinutos - horaAtualMinutos
      const horasAteAbertura = Math.floor(minutosAteAbertura / 60)
      const minutosRestantes = minutosAteAbertura % 60

      let tempoParaAbertura = ""
      if (horasAteAbertura > 0) {
        tempoParaAbertura = `${horasAteAbertura}h ${minutosRestantes}min`
      } else {
        tempoParaAbertura = `${minutosRestantes}min`
      }

      const dataHoje = new Date(dataAtual)
      return {
        horario: horarioHoje.abertura,
        data: `Hoje, ${dataHoje.getDate()} de ${meses[dataHoje.getMonth()]}`,
        diaCompleto: horarioHoje,
        tempoParaAbertura,
      }
    }
  }

  // Procurar próximo dia de funcionamento
  for (let i = 1; i <= 7; i++) {
    const proximaData = new Date(dataAtual)
    proximaData.setDate(proximaData.getDate() + i)
    const proximoDia = proximaData.getDay()

    const horario = horarios.find((h) => h.diaSemana === proximoDia && h.ativo)

    if (horario) {
      let dataTexto = ""
      if (i === 1) {
        dataTexto = `Amanhã, ${proximaData.getDate()} de ${meses[proximaData.getMonth()]}`
      } else {
        dataTexto = `${diasSemana[proximoDia]}, ${proximaData.getDate()} de ${meses[proximaData.getMonth()]}`
      }

      return {
        horario: horario.abertura,
        data: dataTexto,
        diaCompleto: horario,
      }
    }
  }

  // Fallback (não deveria acontecer se houver pelo menos um dia ativo)
  const primeiroHorario = horarios.find((h) => h.ativo)!
  return {
    horario: primeiroHorario.abertura,
    data: "Em breve",
    diaCompleto: primeiroHorario,
  }
}

export const obterStatusSemana = (horarios: HorarioFuncionamento[]) => {
  const agora = new Date()
  const diaAtual = agora.getDay()

  return horarios
    .sort((a, b) => a.ordem - b.ordem)
    .map((horario) => {
      const isHoje = horario.diaSemana === diaAtual
      const status = isHoje ? verificarHorarioFuncionamento([horario]) : { aberto: false }

      return {
        ...horario,
        isHoje,
        isAberto: isHoje && status.aberto,
        tempoRestante: status.tempoRestante,
      }
    })
}
