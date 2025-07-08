"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ShoppingCart, DollarSign, Calendar, BarChart3 } from "lucide-react"
import { salesData } from "@/lib/admin-data"

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("semanal")

  // Cálculos de estatísticas
  const totalRevenue = salesData.reduce((sum, day) => sum + day.amount, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const averageOrderValue = totalRevenue / totalOrders
  const dailyAverage = totalRevenue / salesData.length

  const getFilteredData = (period: string) => {
    // Simulação de filtros por período
    switch (period) {
      case "semanal":
        return salesData.slice(-7)
      case "quinzenal":
        return salesData.slice(-14)
      case "mensal":
        return salesData.slice(-30)
      case "anual":
        return salesData
      default:
        return salesData
    }
  }

  const filteredData = getFilteredData(selectedPeriod)
  const periodRevenue = filteredData.reduce((sum, day) => sum + day.amount, 0)
  const periodOrders = filteredData.reduce((sum, day) => sum + day.orders, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Dashboard</h1>
          <p className="text-gray-400">Visão geral das vendas e faturamento</p>
        </div>
        <Badge variant="outline" className="border-green-500 text-green-500">
          Sistema Online
        </Badge>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-400">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalOrders}</div>
            <p className="text-xs text-gray-400">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-gray-400">+5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Média Diária</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ {dailyAverage.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e relatórios por período */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Fluxograma de Vendas e Faturamento
          </CardTitle>
          <CardDescription className="text-gray-400">Análise detalhada por período</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="semanal" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                Semanal
              </TabsTrigger>
              <TabsTrigger
                value="quinzenal"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
              >
                Quinzenal
              </TabsTrigger>
              <TabsTrigger value="mensal" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                Mensal
              </TabsTrigger>
              <TabsTrigger value="anual" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                Anual
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedPeriod} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Receita do Período</p>
                      <p className="text-2xl font-bold text-green-400">R$ {periodRevenue.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Pedidos do Período</p>
                      <p className="text-2xl font-bold text-blue-400">{periodOrders}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Ticket Médio</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        R$ {(periodRevenue / periodOrders).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de vendas diárias */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Vendas Detalhadas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-400">Data</th>
                        <th className="text-left py-2 text-gray-400">Pedidos</th>
                        <th className="text-left py-2 text-gray-400">Faturamento</th>
                        <th className="text-left py-2 text-gray-400">Ticket Médio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((day, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-2 text-white">{new Date(day.date).toLocaleDateString("pt-BR")}</td>
                          <td className="py-2 text-blue-400">{day.orders}</td>
                          <td className="py-2 text-green-400">R$ {day.amount.toFixed(2)}</td>
                          <td className="py-2 text-yellow-400">R$ {(day.amount / day.orders).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Produtos mais vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-400">Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Red Bull Energy Drink", sales: 45, revenue: 382.5 },
                { name: "Johnnie Walker Red Label", sales: 12, revenue: 1078.8 },
                { name: "Heineken Long Neck", sales: 38, revenue: 171.0 },
                { name: "Monster Energy", sales: 28, revenue: 277.2 },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.sales} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">R$ {product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-yellow-400">Regiões de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: "Tucuruvi", orders: 45, percentage: 35 },
                { region: "Vila Medeiros", orders: 32, percentage: 25 },
                { region: "Santana", orders: 28, percentage: 22 },
                { region: "Outras Regiões", orders: 23, percentage: 18 },
              ].map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{region.region}</span>
                    <span className="text-gray-400">{region.orders} pedidos</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${region.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
