"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type TimeRangeValue = "24h" | "7d" | "30d" | "90d"

interface TimeRangeContextType {
  timeRange: TimeRangeValue
  setTimeRange: (value: TimeRangeValue) => void
  daysBack: number
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined)

// Map time range values to days_back for API calls
const timeRangeToDays: Record<TimeRangeValue, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

export function TimeRangeProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRange] = useState<TimeRangeValue>("7d")

  const daysBack = timeRangeToDays[timeRange]

  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange, daysBack }}>
      {children}
    </TimeRangeContext.Provider>
  )
}

export function useTimeRange() {
  const context = useContext(TimeRangeContext)
  if (context === undefined) {
    throw new Error("useTimeRange must be used within a TimeRangeProvider")
  }
  return context
}
