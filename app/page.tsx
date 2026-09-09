import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmotionTimeSeriesChart } from "@/components/charts/emotion-time-series"
import { SentimentGauge } from "@/components/charts/sentiment-gauge"
import { TopTopics } from "@/components/charts/top-topics"
import { EmotionLeaderboard } from "@/components/charts/emotion-leaderboard"
import { Card } from "@/components/ui/card"
import { TimeRangeProvider } from "@/lib/time-range-context"

export default function OverviewPage() {
  return (
    <TimeRangeProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="grid gap-6">
              {/* Top Row - Time Series and Sentiment */}
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="col-span-2 p-6">
                  <EmotionTimeSeriesChart />
                </Card>
                <Card className="p-6">
                  <SentimentGauge />
                </Card>
              </div>

              {/* Second Row - Top Topics and Leaderboard */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                  <TopTopics />
                </Card>
                <Card className="p-6">
                  <EmotionLeaderboard />
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TimeRangeProvider>
  )
}
