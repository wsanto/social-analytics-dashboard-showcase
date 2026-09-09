"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { useTimeRange } from "@/lib/time-range-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

interface SentimentData {
  score: number
  change: number
}

export function SentimentGauge() {
  const { daysBack } = useTimeRange()
  const [data, setData] = useState<SentimentData>({ score: 0, change: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSentiment() {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/analytics/dashboard-summary?days_back=${daysBack}`)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const result = await response.json()

        setData({
          score: result.sentimentIndex?.score || 50,
          change: result.sentimentIndex?.changePercent || 0
        })
        setError(null)
      } catch (err) {
        console.error("Failed to fetch sentiment:", err)
        setError("Failed to load sentiment data")
      } finally {
        setLoading(false)
      }
    }

    fetchSentiment()
  }, [daysBack])

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Net Sentiment Index</h3>
            <InfoTooltip metricKey="sentimentScore" />
          </div>
          <p className="text-sm text-muted-foreground">Overall population mood</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Net Sentiment Index</h3>
            <InfoTooltip metricKey="sentimentScore" />
          </div>
          <p className="text-sm text-muted-foreground">Overall population mood</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Net Sentiment Index</h3>
          <InfoTooltip metricKey="sentimentScore" />
        </div>
        <p className="text-sm text-muted-foreground">Overall population mood</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(230, 70%, 60%)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(data.score / 100) * 251.2} 251.2`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{data.score}</span>
            <span className="text-xs text-muted-foreground">score</span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
          {data.change > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm font-medium">
            {data.change > 0 ? "+" : ""}
            {data.change}% vs last week
          </span>
        </div>
      </div>
    </div>
  )
}
