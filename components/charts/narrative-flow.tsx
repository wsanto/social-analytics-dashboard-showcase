"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getEmotionColor } from "@/lib/emotion-constants"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { useTopics } from "@/lib/topics-context"

const emotions = ["joy", "trust", "fear", "surprise", "sadness", "anger", "anticipation"]

// Generate mock time series data
const generateTimeSeriesData = (timeRange: string) => {
  const now = new Date()
  const points = timeRange === "1week" ? 7 : timeRange === "1month" ? 30 : 90

  return Array.from({ length: points }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (points - i - 1))

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.random() * 40 + 30 + Math.sin(i / 5) * 15,
    }
  })
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-semibold">{payload[0].payload.date}</p>
        <p className="text-sm text-muted-foreground">Sentiment: {payload[0].value.toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export function NarrativeFlow() {
  const { topics } = useTopics()
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState("joy")
  const [timeRange, setTimeRange] = useState("1month")
  const [data, setData] = useState(generateTimeSeriesData("1month"))

  // Set initial topic when topics load
  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0].name)
    }
  }, [topics, selectedTopic])

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    setData(generateTimeSeriesData(range))
  }

  const emotionColor = getEmotionColor(selectedEmotion)

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Topic Sentiment Over Time</h3>
          <InfoTooltip metricKey="topicSentiment" />
        </div>
        <p className="text-sm text-muted-foreground">Track emotional sentiment trends for specific topics</p>
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
          <span className="text-sm font-medium">Emotion:</span>
          <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {emotions.map((emotion) => (
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
          {selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)} sentiment for {selectedTopic}
        </span>
      </div>
    </div>
  )
}
