"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface TopicOption {
  id: number
  name: string
}

interface TopicsContextType {
  topics: TopicOption[]
  loading: boolean
  error: string | null
}

const TopicsContext = createContext<TopicsContextType>({
  topics: [],
  loading: true,
  error: null,
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export function TopicsProvider({ children }: { children: ReactNode }) {
  const [topics, setTopics] = useState<TopicOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true)
        // Fetch from dashboard-summary to get the top 10 topics
        const response = await fetch(`${API_BASE_URL}/analytics/dashboard-summary?days_back=7`)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        const topTopics = (data.topTopics || []).slice(0, 10).map((topic: any) => ({
          id: topic.id,
          name: topic.name,
        }))

        setTopics(topTopics)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch topics for context:", err)
        // Fallback to default topics if API fails
        setTopics([
          { id: 1, name: "Economic Growth" },
          { id: 2, name: "Technology & AI" },
          { id: 3, name: "Political Discourse" },
          { id: 4, name: "Sports & Entertainment" },
          { id: 5, name: "Healthcare" },
          { id: 6, name: "Environment" },
          { id: 7, name: "Education" },
          { id: 8, name: "Social Issues" },
          { id: 9, name: "Cryptocurrency" },
          { id: 10, name: "Climate Action" },
        ])
        setError("Using cached topics")
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  return (
    <TopicsContext.Provider value={{ topics, loading, error }}>
      {children}
    </TopicsContext.Provider>
  )
}

export function useTopics() {
  const context = useContext(TopicsContext)
  if (!context) {
    throw new Error("useTopics must be used within a TopicsProvider")
  }
  return context
}
