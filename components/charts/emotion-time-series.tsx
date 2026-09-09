"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { useTimeRange } from "@/lib/time-range-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

interface EmotionDataPoint {
  date: string
  joy: number
  anger: number
  fear: number
  trust: number
  surprise: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 text-sm font-semibold">{payload[0].payload.date}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 text-sm">
            <span className="capitalize" style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="font-mono font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function EmotionTimeSeriesChart() {
  const { daysBack } = useTimeRange()
  const [data, setData] = useState<EmotionDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmotionData() {
      try {
        setLoading(true)
        // Fetch real time series data from the emotion-timeseries endpoint
        const response = await fetch(`${API_BASE_URL}/analytics/emotion-timeseries?days_back=${daysBack}`)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const result = await response.json()
        const timeseries = result.timeseries || []

        if (timeseries.length > 0) {
          // Use real historical data from the API
          const timeSeriesData: EmotionDataPoint[] = timeseries.map((point: any) => ({
            date: point.date,
            joy: Math.round(point.joy || 0),
            anger: Math.round(point.anger || 0),
            fear: Math.round(point.fear || 0),
            trust: Math.round(point.trust || 0),
            surprise: Math.round(point.surprise || 0)
          }))
          setData(timeSeriesData)
        } else {
          // Fallback to dashboard-summary if no time series data
          const summaryResponse = await fetch(`${API_BASE_URL}/analytics/dashboard-summary?days_back=${daysBack}`)
          if (summaryResponse.ok) {
            const summaryResult = await summaryResponse.json()
            const emotionDist = summaryResult.emotionDistribution || {}

            // Create a single data point from current distribution
            const today = new Date()
            const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

            setData([{
              date: dateStr,
              joy: Math.round(emotionDist.joy || 25),
              anger: Math.round(emotionDist.anger || 15),
              fear: Math.round(emotionDist.fear || 12),
              trust: Math.round(emotionDist.trust || 35),
              surprise: Math.round(emotionDist.surprise || 10)
            }])
          }
        }

        setError(null)
      } catch (err) {
        console.error("Failed to fetch emotion data:", err)
        setError("Failed to load emotion data")
      } finally {
        setLoading(false)
      }
    }

    fetchEmotionData()
  }, [daysBack])

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Emotion Time-Series</h3>
            <InfoTooltip metricKey="emotionTimeSeries" />
          </div>
          <p className="text-sm text-muted-foreground">Relative proportions of emotions over time</p>
        </div>
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Emotion Time-Series</h3>
            <InfoTooltip metricKey="emotionTimeSeries" />
          </div>
          <p className="text-sm text-muted-foreground">Relative proportions of emotions over time</p>
        </div>
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">{error || "No data available"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Emotion Time-Series</h3>
          <InfoTooltip metricKey="emotionTimeSeries" />
        </div>
        <p className="text-sm text-muted-foreground">Relative proportions of emotions over time</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="joy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(85, 70%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(85, 70%, 60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="anger" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(25, 80%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(25, 80%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(295, 60%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(295, 60%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="trust" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(230, 70%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(230, 70%, 60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="surprise" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(180, 60%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(180, 60%, 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="#ffffff"
            fontSize={14}
            tickLine={false}
            tick={{ fill: '#ffffff' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            stroke="#ffffff"
            fontSize={14}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#ffffff' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
            formatter={(value) => <span className="capitalize text-sm">{value}</span>}
          />
          <Area type="monotone" dataKey="joy" stackId="1" stroke="hsl(85, 70%, 60%)" fill="url(#joy)" strokeWidth={2} />
          <Area
            type="monotone"
            dataKey="trust"
            stackId="1"
            stroke="hsl(230, 70%, 60%)"
            fill="url(#trust)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="anger"
            stackId="1"
            stroke="hsl(25, 80%, 55%)"
            fill="url(#anger)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="fear"
            stackId="1"
            stroke="hsl(295, 60%, 55%)"
            fill="url(#fear)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="surprise"
            stackId="1"
            stroke="hsl(180, 60%, 60%)"
            fill="url(#surprise)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
