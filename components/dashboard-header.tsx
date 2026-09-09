"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTimeRange, type TimeRangeValue } from "@/lib/time-range-context"

export function DashboardHeader() {
  const { timeRange, setTimeRange } = useTimeRange()

  return (
    <div className="flex flex-col gap-4 border-b border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time emotion and sentiment trends across all monitored topics
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRangeValue)}>
          <SelectTrigger className="w-[140px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed blur-[1px]" disabled>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>Contact Kaiko Labs for data enrichment options.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
