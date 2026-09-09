"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { InfoTooltip } from "@/components/ui/info-tooltip"

const data = [
  {
    dimension: "Innovation",
    "Urban Prog.": 85,
    Traditional: 42,
    "Digital Native": 92,
    Achievers: 78,
  },
  {
    dimension: "Tradition",
    "Urban Prog.": 45,
    Traditional: 88,
    "Digital Native": 38,
    Achievers: 55,
  },
  {
    dimension: "Risk-Taking",
    "Urban Prog.": 72,
    Traditional: 35,
    "Digital Native": 85,
    Achievers: 82,
  },
  {
    dimension: "Community",
    "Urban Prog.": 68,
    Traditional: 92,
    "Digital Native": 58,
    Achievers: 62,
  },
  {
    dimension: "Achievement",
    "Urban Prog.": 75,
    Traditional: 62,
    "Digital Native": 70,
    Achievers: 95,
  },
  {
    dimension: "Sustainability",
    "Urban Prog.": 88,
    Traditional: 52,
    "Digital Native": 65,
    Achievers: 70,
  },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 text-sm font-semibold">{payload[0].payload.dimension}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 text-sm">
            <span style={{ color: entry.stroke }}>{entry.name}</span>
            <span className="font-mono font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function PsychographicRadar() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Psychographic Profile</h3>
          <InfoTooltip metricKey="psychographicProfile" />
        </div>
        <p className="text-sm text-muted-foreground">Value dimensions across segments</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#ffffff", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#ffffff", fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
          <Radar
            name="Urban Prog."
            dataKey="Urban Prog."
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Traditional"
            dataKey="Traditional"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Digital Native"
            dataKey="Digital Native"
            stroke="hsl(var(--chart-4))"
            fill="hsl(var(--chart-4))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Achievers"
            dataKey="Achievers"
            stroke="hsl(var(--chart-5))"
            fill="hsl(var(--chart-5))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
