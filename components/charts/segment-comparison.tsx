"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { InfoTooltip } from "@/components/ui/info-tooltip"

const data = [
  {
    segment: "Urban Prog.",
    engagement: 82,
    sentiment: 68,
    growth: 75,
  },
  {
    segment: "Traditional",
    engagement: 65,
    sentiment: 52,
    growth: 45,
  },
  {
    segment: "Digital Native",
    engagement: 88,
    sentiment: 72,
    growth: 92,
  },
  {
    segment: "Achievers",
    engagement: 74,
    sentiment: 58,
    growth: 62,
  },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 text-sm font-semibold">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 text-sm">
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className="font-mono font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function SegmentComparison() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Segment Comparison</h3>
          <InfoTooltip metricKey="segmentComparison" />
        </div>
        <p className="text-sm text-muted-foreground">Key metrics across population segments</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="segment" stroke="#ffffff" fontSize={12} tickLine={false} tick={{ fill: '#ffffff' }} />
          <YAxis stroke="#ffffff" fontSize={12} tickLine={false} tick={{ fill: '#ffffff' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
            formatter={(value) => <span className="text-sm capitalize">{value}</span>}
          />
          <Bar dataKey="engagement" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sentiment" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="growth" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
