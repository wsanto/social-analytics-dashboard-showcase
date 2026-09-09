"use client"

export function GeoHeatmap() {
  const regions = [
    { name: "Delhi NCR", emotion: "anger", intensity: 85, color: "hsl(25, 80%, 55%)" },
    { name: "Maharashtra", emotion: "trust", intensity: 72, color: "hsl(230, 70%, 60%)" },
    { name: "Karnataka", emotion: "joy", intensity: 68, color: "hsl(85, 70%, 60%)" },
    { name: "Tamil Nadu", emotion: "trust", intensity: 70, color: "hsl(230, 70%, 60%)" },
    { name: "West Bengal", emotion: "anger", intensity: 78, color: "hsl(25, 80%, 55%)" },
    { name: "Gujarat", emotion: "trust", intensity: 65, color: "hsl(230, 70%, 60%)" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Geographic Emotion Map</h3>
        <p className="text-sm text-muted-foreground">Dominant emotions by region</p>
      </div>
      <div className="space-y-3">
        {regions.map((region) => (
          <div
            key={region.name}
            className="group cursor-pointer rounded-lg border border-border bg-secondary/50 p-4 transition-all hover:bg-secondary"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">{region.name}</span>
              <span className="text-sm capitalize" style={{ color: region.color }}>
                {region.emotion}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${region.intensity}%`,
                  backgroundColor: region.color,
                }}
              />
            </div>
            <div className="mt-1 text-right text-xs text-muted-foreground">{region.intensity}% intensity</div>
          </div>
        ))}
      </div>
    </div>
  )
}
