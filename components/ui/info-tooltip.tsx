"use client"

import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { METRIC_DEFINITIONS } from "@/lib/metric-definitions"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  metricKey: string
  className?: string
}

/**
 * InfoTooltip - Displays metric information in a hover tooltip
 *
 * Shows the metric name, description, calculation formula, range, and interpretation
 * when hovering over the info icon.
 */
export function InfoTooltip({ metricKey, className }: InfoTooltipProps) {
  const metric = METRIC_DEFINITIONS[metricKey]

  if (!metric) {
    console.warn(`InfoTooltip: No metric definition found for key "${metricKey}"`)
    return null
  }

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-full p-0.5 hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
        >
          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={5}
        className="z-[100] max-w-xs bg-popover border border-border text-popover-foreground p-3 shadow-lg"
      >
        <div className="space-y-2">
          <p className="font-semibold text-sm">{metric.name}</p>
          <p className="text-xs text-muted-foreground">{metric.description}</p>
          <div className="pt-1 border-t border-border space-y-1">
            <p className="text-xs">
              <span className="font-medium text-muted-foreground">Formula: </span>
              <span className="font-mono">{metric.calculation}</span>
            </p>
            <p className="text-xs">
              <span className="font-medium text-muted-foreground">Range: </span>
              {metric.range}
            </p>
            <p className="text-xs text-muted-foreground italic">{metric.interpretation}</p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
