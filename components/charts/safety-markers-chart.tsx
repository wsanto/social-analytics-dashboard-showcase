"use client"

import { useState, useEffect, useCallback } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getEmotionColor } from "@/lib/emotion-constants"
import { AlertTriangle, Loader2 } from "lucide-react"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { useTopics } from "@/lib/topics-context"
import { apiClient } from "@/lib/api/api-client"

const safetyMarkers = ["hostility", "aggression", "toxicity"]

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

export function SafetyMarkersChart() {
  const { topics } = useTopics()
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedMarker, setSelectedMarker] = useState("hostility")
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

      const result = await apiClient.getSafetyDashboard({
        startDate: startDate.toISOString(),
      })

      // Also fetch timeseries if we have a topic with an ID
      const topicObj = topics.find(t => t.name === selectedTopic)
      if (topicObj?.id) {
        const ts = await apiClient.getSafetyTimeseries(Number(topicObj.id), {
          startDate: startDate.toISOString(),
        })
        if (ts?.data_points) {
          setData(ts.data_points.map((p: any) => ({
            date: new Date(p.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            value: selectedMarker === "hostility" ? (p.avg_hostility_score || 0) * 100
              : selectedMarker === "toxicity" ? (p.avg_safety_concern || 0) * 100
              : (p.high_hostility_count / Math.max(p.post_count, 1)) * 100,
          })))
          return
        }
      }

      // Fallback: use dashboard aggregate as single data point
      if (result) {
        setData([{
          date: "Current",
          value: (result.avg_safety_concern || 0) * 100,
        }])
      }
    } catch (err) {
      console.error("Failed to fetch safety data:", err)
    } finally {
      setLoading(false)
    }
  }, [timeRange, selectedTopic, selectedMarker, topics])

  useEffect(() => {
    if (selectedTopic) fetchData()
  }, [selectedTopic, timeRange, selectedMarker, fetchData])

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
  }

  const markerColor = getEmotionColor(selectedMarker)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Safety Markers Over Time</h3>
            <InfoTooltip metricKey="toxicity" />
          </div>
          <p className="text-sm text-muted-foreground">Monitor hostility, aggression, and toxicity levels</p>
        </div>
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

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Marker:</span>
          <Select value={selectedMarker} onValueChange={setSelectedMarker}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {safetyMarkers.map((marker) => (
                <SelectItem key={marker} value={marker}>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getEmotionColor(marker) }} />
                    <span className="capitalize">{marker}</span>
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
      {loading && (
        <div className="flex items-center justify-center h-[350px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {!loading && <ResponsiveContainer width="100%" height={350}>
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
            stroke={markerColor}
            strokeWidth={3}
            dot={{ fill: markerColor, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-0.5 w-8" style={{ backgroundColor: markerColor }} />
        <span>
          {selectedMarker.charAt(0).toUpperCase() + selectedMarker.slice(1)} levels for {selectedTopic}
        </span>
      </div>
    </div>
  )
}
