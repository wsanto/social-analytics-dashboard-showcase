"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useTopics } from "@/lib/topics-context"

const dimensions = [
  { key: "valence", name: "Valence", color: "oklch(0.75 0.18 350)" },
  { key: "arousal", name: "Arousal", color: "oklch(0.6 0.22 25)" },
  { key: "intensity", name: "Intensity", color: "oklch(0.85 0.15 85)" },
  { key: "complexity", name: "Complexity", color: "oklch(0.68 0.14 160)" },
  { key: "wonderIndex", name: "Wonder Index", color: "oklch(0.72 0.16 200)" },
  { key: "discoveryLevel", name: "Discovery Level", color: "oklch(0.82 0.2 100)" },
]

const generateTimeSeriesData = (timeRange: string) => {
  const now = new Date()
  const points = timeRange === "1week" ? 7 : timeRange === "1month" ? 30 : 90

  return Array.from({ length: points }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (points - i - 1))

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      valence: Math.random() * 40 + 30 + Math.sin(i / 5) * 15,
      arousal: Math.random() * 35 + 25 + Math.cos(i / 6) * 12,
      intensity: Math.random() * 45 + 20 + Math.sin(i / 4) * 18,
      complexity: Math.random() * 30 + 15 + Math.cos(i / 7) * 10,
      wonderIndex: Math.random() * 25 + 10 + Math.sin(i / 8) * 8,
      discoveryLevel: Math.random() * 30 + 12 + Math.cos(i / 9) * 12,
    }
  })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function MultiDimensionalChart() {
  const { topics } = useTopics()
  const [selectedTopic, setSelectedTopic] = useState("")
  const [timeRange, setTimeRange] = useState("1month")
  const [data, setData] = useState(generateTimeSeriesData("1month"))

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0].name)
    }
  }, [topics, selectedTopic])

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    setData(generateTimeSeriesData(range))
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Multi-Dimensional Emotional Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Track valence, arousal, intensity, complexity, wonder index, and discovery level
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Topic:</span>
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.name}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex gap-2">
          <Button
            variant={timeRange === "1week" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeRangeChange("1week")}
          >
            1 Week
          </Button>
          <Button
            variant={timeRange === "1month" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeRangeChange("1month")}
          >
            1 Month
          </Button>
          <Button
            variant={timeRange === "3month" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeRangeChange("3month")}
          >
            3 Months
          </Button>
        </div>
      </div>

      {/* Line Chart with Multiple Lines */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="#ffffff" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#ffffff' }} />
          <YAxis
            stroke="#ffffff"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#ffffff' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {dimensions.map((dimension) => (
            <Line
              key={dimension.key}
              type="monotone"
              dataKey={dimension.key}
              name={dimension.name}
              stroke={dimension.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
