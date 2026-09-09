import type {
  ApiResponse,
  EmotionTimeSeriesPoint,
  SentimentGauge,
  TopTopicItem,
  EmotionLeaderboardItem,
  Topic,
  TopicSentimentPoint,
  ArchetypeSentimentAnalysis,
  CreatorProfile,
  ArchetypeDistribution,
  ArchetypeTopicAnalysis,
  ArchetypeShiftPoint,
  EmotionalTrajectoryPoint,
  BreakthroughEvent,
  User,
  Post,
  UserPsychographicProfile,
} from "../types/api-types"

// Backend API Base URL - connects to FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

// API Key for authentication (should be set via environment variable)
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

class ApiClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string = "") {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    }

    // Add API key header if available
    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`)
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Direct backend endpoint fetcher (for endpoints that match backend exactly)
  private async fetchBackend<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    }

    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      console.error(`Backend API Error: ${response.status} ${response.statusText} for ${endpoint}`)
      throw new Error(`Backend API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Overview Dashboard APIs
  async getEmotionTimeSeries(params: {
    timeRange: "7d" | "30d" | "90d"
    topic?: string
  }): Promise<ApiResponse<EmotionTimeSeriesPoint[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/emotion-time-series?${query}`)
  }

  async getSentimentGauge(params: {
    topic?: string
    timeRange: "24h" | "7d" | "30d"
  }): Promise<ApiResponse<SentimentGauge>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/sentiment-gauge?${query}`)
  }

  async getTopTopics(params: {
    limit?: number
    timeRange: "24h" | "7d" | "30d"
  }): Promise<ApiResponse<TopTopicItem[]>> {
    const query = new URLSearchParams({ limit: "6", ...params } as any)
    return this.fetch(`/top-topics?${query}`)
  }

  async getEmotionLeaderboard(params: {
    topic?: string
    timeRange: "24h" | "7d" | "30d"
  }): Promise<ApiResponse<EmotionLeaderboardItem[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/emotion-leaderboard?${query}`)
  }

  // Topics & Narratives APIs
  async getTopics(params?: {
    category?: string
    trending?: boolean
  }): Promise<ApiResponse<Topic[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/topics?${query}`)
  }

  async getTopic(topicId: string): Promise<ApiResponse<Topic>> {
    return this.fetch(`/topics/${topicId}`)
  }

  async getTopicSentimentTimeline(
    topicId: string,
    params: {
      emotion: string
      timeRange: "1week" | "1month" | "3months"
    },
  ): Promise<ApiResponse<TopicSentimentPoint[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/topics/${topicId}/sentiment-timeline?${query}`)
  }

  async getTopicArchetypes(topicId: string): Promise<ApiResponse<ArchetypeSentimentAnalysis>> {
    return this.fetch(`/topics/${topicId}/archetypes`)
  }

  async getTopicCreators(topicId: string): Promise<ApiResponse<CreatorProfile[]>> {
    return this.fetch(`/topics/${topicId}/creators`)
  }

  // Creator EQ Analysis - Backend endpoints
  async getTopicCreatorsBackend(topicId: number, daysBack: number = 30): Promise<any> {
    return this.fetchBackend(`/topics/${topicId}/creators?days_back=${daysBack}&limit=10`)
  }

  async getCreatorTimeseries(topicId: number, userId: string, daysBack: number = 30, bucket: string = "day"): Promise<any> {
    return this.fetchBackend(`/topics/${topicId}/creators/${encodeURIComponent(userId)}/timeseries?days_back=${daysBack}&bucket=${bucket}`)
  }

  // Emotional Chart APIs
  async getEmotionChart(params: {
    category:
      | "complex"
      | "meta-emotional"
      | "growth-patterns"
      | "additional-sentiments"
      | "safety-markers"
      | "multi-dimensional"
    topic?: string
    emotion?: string
    timeRange: "1week" | "1month" | "3months"
  }): Promise<ApiResponse<TopicSentimentPoint[] | any>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/emotion-charts/${params.category}?${query}`)
  }

  // Psychographic Archetypes APIs
  async getArchetypes(topic: string): Promise<ApiResponse<ArchetypeDistribution[]>> {
    return this.fetch(`/archetypes?topic=${topic}`)
  }

  async getArchetypeDetail(topic: string, archetypeId: string): Promise<ApiResponse<ArchetypeTopicAnalysis>> {
    return this.fetch(`/archetypes/${topic}/${archetypeId}`)
  }

  async getArchetypeShifts(params: {
    topic: string
    timeRange: "30d" | "60d" | "90d"
  }): Promise<ApiResponse<ArchetypeShiftPoint[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/archetypes/shifts?${query}`)
  }

  async getArchetypeMap(topic: string): Promise<ApiResponse<ArchetypeDistribution[]>> {
    return this.fetch(`/archetypes/${topic}/map`)
  }

  // Emotional Trajectories APIs
  async getEmotionalTrajectory(params: {
    topic?: string
    timeRange: "30d" | "60d" | "90d"
  }): Promise<ApiResponse<EmotionalTrajectoryPoint[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/trajectories/emotional?${query}`)
  }

  async getMultiDimensionalTrajectory(params: {
    topic?: string
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/trajectories/multi-dimensional?${query}`)
  }

  async getEmotionalVolatility(params: {
    topic?: string
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/trajectories/volatility?${query}`)
  }

  // Discovery & Wonder APIs
  async getBreakthroughs(params: {
    topic?: string
    timeRange: "30d" | "60d"
  }): Promise<ApiResponse<BreakthroughEvent[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/discovery/breakthroughs?${query}`)
  }

  async getWonderIndex(params: {
    topic?: string
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/discovery/wonder-index?${query}`)
  }

  async getComplexEmotions(params: {
    topic?: string
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/discovery/complex-emotions?${query}`)
  }

  // User Explorer APIs
  async getUsers(params?: {
    archetype?: string
    topic?: string
    sortBy?: "influence" | "activity" | "recent"
    limit?: number
  }): Promise<ApiResponse<User[]>> {
    const query = new URLSearchParams(params as any)
    return this.fetch(`/users?${query}`)
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.fetch(`/users/${userId}`)
  }

  async getUserPosts(userId: string, limit = 10): Promise<ApiResponse<Post[]>> {
    return this.fetch(`/users/${userId}/posts?limit=${limit}`)
  }

  async getUserPsychographicProfile(userId: string): Promise<ApiResponse<UserPsychographicProfile>> {
    return this.fetch(`/users/${userId}/psychographic-profile`)
  }

  // ==========================================================================
  // DIRECT BACKEND API METHODS
  // These methods map directly to the FastAPI backend endpoints
  // ==========================================================================

  // Analytics - Dashboard Summary
  async getDashboardSummary(daysBack: number = 30): Promise<any> {
    return this.fetchBackend(`/analytics/dashboard-summary?days_back=${daysBack}`)
  }

  // Analytics - Emotion Time Series
  async getEmotionTimeSeriesBackend(daysBack: number = 30): Promise<any> {
    return this.fetchBackend(`/analytics/emotion-timeseries?days_back=${daysBack}`)
  }

  // Analytics - Insights (comprehensive analytics from LIVE data)
  async getAnalyticsInsights(daysBack: number = 7): Promise<any> {
    return this.fetchBackend(`/analytics/insights?days_back=${daysBack}`)
  }

  // Analytics - Sentiment Trends
  async getSentimentTrends(params: {
    topicId?: number
    startDate?: string
    endDate?: string
    intervalHours?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params.topicId) query.append("topic_id", params.topicId.toString())
    if (params.startDate) query.append("start_date", params.startDate)
    if (params.endDate) query.append("end_date", params.endDate)
    if (params.intervalHours) query.append("interval_hours", params.intervalHours.toString())
    return this.fetchBackend(`/analytics/sentiment-trends?${query}`)
  }

  // Analytics - Top Users
  async getTopUsers(params: {
    topicId?: number
    limit?: number
    metric?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params.topicId) query.append("topic_id", params.topicId.toString())
    if (params.limit) query.append("limit", params.limit.toString())
    if (params.metric) query.append("metric", params.metric)
    return this.fetchBackend(`/analytics/top-users?${query}`)
  }

  // Analytics - System Statistics
  async getSystemStatistics(): Promise<any> {
    return this.fetchBackend(`/analytics/system-statistics`)
  }

  // Archetypes - Get Profiles (LIVE data from database)
  async getArchetypeProfiles(topicId?: number): Promise<any> {
    const query = topicId ? `?topic_id=${topicId}` : ""
    return this.fetchBackend(`/archetypes/profiles${query}`)
  }

  // Archetypes - Distribution for Topic
  async getArchetypeDistributionForTopic(topicId: number): Promise<any> {
    return this.fetchBackend(`/topics/${topicId}/distribution`)
  }

  // Archetypes - List for Topic
  async getArchetypesForTopic(topicId: number): Promise<any> {
    return this.fetchBackend(`/topics/${topicId}/archetypes`)
  }

  // Archetypes - Shifts/Migrations
  async getArchetypeShiftsForTopic(topicId: number, params?: {
    userId?: string
    fromArchetype?: string
    toArchetype?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.userId) query.append("user_id", params.userId)
    if (params?.fromArchetype) query.append("from_archetype", params.fromArchetype)
    if (params?.toArchetype) query.append("to_archetype", params.toArchetype)
    const queryStr = query.toString() ? `?${query}` : ""
    return this.fetchBackend(`/topics/${topicId}/shifts${queryStr}`)
  }

  // Advanced Analytics - Temporal Patterns
  async getTemporalPatterns(params?: {
    topicId?: number
    daysBack?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.daysBack) query.append("days_back", params.daysBack.toString())
    return this.fetchBackend(`/analytics/advanced/temporal-patterns?${query}`)
  }

  // Advanced Analytics - Sentiment Momentum
  async getSentimentMomentum(params?: {
    topicId?: number
    windowHours?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.windowHours) query.append("window_hours", params.windowHours.toString())
    return this.fetchBackend(`/analytics/advanced/sentiment-momentum?${query}`)
  }

  // Advanced Analytics - Volatility Analysis
  async getVolatilityAnalysis(params?: {
    topicId?: number
    daysBack?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.daysBack) query.append("days_back", params.daysBack.toString())
    return this.fetchBackend(`/analytics/advanced/volatility-analysis?${query}`)
  }

  // Advanced Analytics - Influence Network
  async getInfluenceNetwork(topicId: number, params?: {
    minInfluence?: number
    limit?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    query.append("topic_id", topicId.toString())
    if (params?.minInfluence) query.append("min_influence", params.minInfluence.toString())
    if (params?.limit) query.append("limit", params.limit.toString())
    return this.fetchBackend(`/analytics/advanced/influence-network?${query}`)
  }

  // Advanced Analytics - Predictive Trends
  async getPredictiveTrends(params?: {
    topicId?: number
    forecastHours?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.forecastHours) query.append("forecast_hours", params.forecastHours.toString())
    return this.fetchBackend(`/analytics/advanced/predictive-trends?${query}`)
  }

  // Advanced Analytics - Anomaly Detection
  async getAnomalyDetection(params?: {
    topicId?: number
    hoursBack?: number
    sensitivity?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.hoursBack) query.append("hours_back", params.hoursBack.toString())
    if (params?.sensitivity) query.append("sensitivity", params.sensitivity.toString())
    return this.fetchBackend(`/analytics/advanced/anomaly-detection?${query}`)
  }

  // Topics - List All
  async getTopicsList(): Promise<any> {
    return this.fetchBackend(`/topics`)
  }

  // Users - Backend API
  async getUsersBackend(params?: {
    topicId?: number
    archetypeName?: string
    minPostCount?: number
    minInfluence?: number
    verifiedOnly?: boolean
    page?: number
    pageSize?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.archetypeName) query.append("archetype_name", params.archetypeName)
    if (params?.minPostCount) query.append("min_post_count", params.minPostCount.toString())
    if (params?.minInfluence) query.append("min_influence", params.minInfluence.toString())
    if (params?.verifiedOnly) query.append("verified_only", "true")
    if (params?.page) query.append("page", params.page.toString())
    if (params?.pageSize) query.append("page_size", params.pageSize.toString())
    return this.fetchBackend(`/users?${query}`)
  }

  // User - Get Single User
  async getUserBackend(userId: string): Promise<any> {
    return this.fetchBackend(`/users/${userId}`)
  }

  // User - Get Metrics
  async getUserMetrics(userId: string, topicId?: number): Promise<any> {
    const query = topicId ? `?topic_id=${topicId}` : ""
    return this.fetchBackend(`/users/${userId}/metrics${query}`)
  }

  // User - Get Psych Profile
  async getUserPsychProfile(userId: string, topicId?: number): Promise<any> {
    const query = topicId ? `?topic_id=${topicId}` : ""
    return this.fetchBackend(`/users/${userId}/psych-profile${query}`)
  }

  // ==========================================================================
  // P0: SAFETY & HOSTILITY ENDPOINTS
  // ==========================================================================

  async getSafetyDashboard(params?: {
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/safety-dashboard?${query}`)
  }

  async getHostilityAlerts(params?: {
    minHostilityLevel?: string
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.minHostilityLevel) query.append("min_hostility_level", params.minHostilityLevel)
    if (params?.page) query.append("page", params.page.toString())
    if (params?.pageSize) query.append("page_size", params.pageSize.toString())
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/hostility-alerts?${query}`)
  }

  async getSafetyTimeseries(topicId: number, params?: {
    intervalHours?: number
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.intervalHours) query.append("interval_hours", params.intervalHours.toString())
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/topics/${topicId}/safety-timeseries?${query}`)
  }

  // ==========================================================================
  // P1: EMPATHY, BREAKTHROUGH & EMOTION SPECTRUM ENDPOINTS
  // ==========================================================================

  async getEmpathyOverview(params?: {
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/empathy-overview?${query}`)
  }

  async getEmpathyTimeseries(topicId: number, params?: {
    intervalHours?: number
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.intervalHours) query.append("interval_hours", params.intervalHours.toString())
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/topics/${topicId}/empathy-timeseries?${query}`)
  }

  async getBreakthroughsBackend(params?: {
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.page) query.append("page", params.page.toString())
    if (params?.pageSize) query.append("page_size", params.pageSize.toString())
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/breakthroughs?${query}`)
  }

  async getEmotionSpectrum(params?: {
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/emotion-spectrum?${query}`)
  }

  async getEmotionSpectrumTimeseries(params?: {
    topicId?: number
    intervalHours?: number
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.intervalHours) query.append("interval_hours", params.intervalHours.toString())
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/emotion-spectrum-timeseries?${query}`)
  }

  async getPatterns(params?: {
    patternType?: string
    page?: number
    pageSize?: number
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.patternType) query.append("pattern_type", params.patternType)
    if (params?.page) query.append("page", params.page.toString())
    if (params?.pageSize) query.append("page_size", params.pageSize.toString())
    return this.fetchBackend(`/analytics/patterns?${query}`)
  }

  async getUserPatterns(userId: string): Promise<any> {
    return this.fetchBackend(`/analytics/users/${encodeURIComponent(userId)}/patterns`)
  }

  // ==========================================================================
  // P2: GROWTH & BELIEF ENDPOINTS
  // ==========================================================================

  async getUserGrowth(userId: string): Promise<any> {
    return this.fetchBackend(`/analytics/users/${encodeURIComponent(userId)}/growth`)
  }

  async getBeliefLandscape(params?: {
    startDate?: string
    endDate?: string
  }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.startDate) query.append("start_date", params.startDate)
    if (params?.endDate) query.append("end_date", params.endDate)
    return this.fetchBackend(`/analytics/belief-landscape?${query}`)
  }

  // ==========================================================================
  // SENTIMENTSCOPE: BRAND INTELLIGENCE
  // ==========================================================================

  async getBrands(): Promise<any> {
    return this.fetchBackend("/brands")
  }

  async createBrand(data: { name: string; keywords: string[]; hashtags?: string[] }): Promise<any> {
    return this.fetchBackend("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getBrandDetail(brandId: number, daysBack: number = 7): Promise<any> {
    return this.fetchBackend(`/brands/${brandId}?days_back=${daysBack}`)
  }

  async updateBrand(brandId: number, data: { keywords?: string[]; hashtags?: string[]; is_active?: boolean }): Promise<any> {
    return this.fetchBackend(`/brands/${brandId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async compareBrands(brandId: number, competitorId: number, daysBack: number = 7): Promise<any> {
    return this.fetchBackend(`/brands/${brandId}/compare/${competitorId}?days_back=${daysBack}`)
  }

  async getBrandRegionalSentiment(brandId: number, daysBack: number = 30): Promise<any> {
    return this.fetchBackend(`/brands/${brandId}/regional-sentiment?days_back=${daysBack}`)
  }

  async getWordFrequency(params?: { topicId?: number; emotion?: string; daysBack?: number; limit?: number }): Promise<any> {
    const query = new URLSearchParams()
    if (params?.topicId) query.append("topic_id", params.topicId.toString())
    if (params?.emotion) query.append("emotion", params.emotion)
    if (params?.daysBack) query.append("days_back", params.daysBack.toString())
    if (params?.limit) query.append("limit", params.limit.toString())
    return this.fetchBackend(`/analytics/advanced/word-frequency?${query}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL, API_KEY)
