"use client"

import { useState, useEffect, useCallback } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getEmotionColor } from "@/lib/emotion-constants"
import { Loader2 } from "lucide-react"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { useTopics } from "@/lib/topics-context"
import { apiClient } from "@/lib/api/api-client"

const metaEmotions = ["breakthrough", "transcendent", "insight", "flow"]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-semibold">{payload[0].payload.date}</p>
        <p className="text-sm text-muted-foreground">Level: {payload[0].value.toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export function MetaEmotionalChart() {
  const { topics } = useTopics()
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState("breakthrough")
  const [timeRange, setTimeRange] = useState("1month")
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0].name)
    }
  }, [topics, selectedTopic])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const daysBack = timeRange === "1week" ? 7 : timeRange === "1month" ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const result = await apiClient.getEmotionSpectrum({
        startDate: startDate.toISOString(),
      })

      if (result?.spectrum) {
        // Map GoEmotions spectrum to meta-emotional categories
        const metaMap: Record<string, string[]> = {
          breakthrough: ["surprise", "excitement", "realization"],
          transcendent: ["admiration", "gratitude", "amusement"],
          insight: ["curiosity", "realization", "approval"],
          flow: ["joy", "optimism", "excitement"],
        }

        const relevantEmotions = metaMap[selectedEmotion] || []
        const matched = result.spectrum.filter((s: any) => relevantEmotions.includes(s.emotion))
        const avgScore = matched.length > 0
          ? matched.reduce((sum: number, s: any) => sum + s.avg_score, 0) / matched.length
          : 0

        // Use the spectrum timeseries for trend data
        const tsResult = await apiClient.getEmotionSpectrumTimeseries({
          startDate: startDate.toISOString(),
        })

        if (tsResult?.data_points?.length > 0) {
          setData(tsResult.data_points.map((p: any) => {
            const scores = relevantEmotions.map((e: string) => p.distribution?.[e] || 0)
            const avg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0
            return {
              date: new Date(p.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              value: avg * 100,
            }
          }))
        } else {
          setData([{ date: "Current", value: avgScore * 100 }])
        }
      }
    } catch (err) {
      console.error("Failed to fetch meta-emotional data:", err)
    } finally {
      setLoading(false)
    }
  }, [timeRange, selectedTopic, selectedEmotion])

  useEffect(() => {
    if (selectedTopic) fetchData()
  }, [selectedTopic, timeRange, selectedEmotion, fetchData])

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
  }

  const emotionColor = getEmotionColor(selectedEmotion)

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Meta-Emotional States Over Time</h3>
          <InfoTooltip metricKey="breakthrough" />
        </div>
        <p className="text-sm text-muted-foreground">Track breakthrough, transcendent, insight, and flow states</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Topic:</span>
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select topic" />
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

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">State:</span>
          <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metaEmotions.map((emotion) => (
                <SelectItem key={emotion} value={emotion}>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getEmotionColor(emotion) }} />
                    <span className="capitalize">{emotion}</span>
                  </div>
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

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={350}>
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
          <Line
            type="monotone"
            dataKey="value"
            stroke={emotionColor}
            strokeWidth={3}
            dot={{ fill: emotionColor, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-0.5 w-8" style={{ backgroundColor: emotionColor }} />
        <span>
          {selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)} state for {selectedTopic}
        </span>
      </div>
    </div>
  )
}
