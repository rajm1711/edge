export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
};

async function apiRequest<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.error || `HTTP error! status: ${response.status}`,
      };
    }
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export const apiClient = {
  // Market Data
  getQuote: (ticker: string) => apiRequest<any>(`/api/market/quote?ticker=${ticker}`),
  getIndices: () => apiRequest<any[]>("/api/market/indices"),
  getWatchlist: (tickers: string) => apiRequest<any[]>(`/api/market/watchlist?tickers=${tickers}`),
  getNews: (ticker: string) => apiRequest<any[]>(`/api/market/news?ticker=${ticker}`),
  getFundamentals: (ticker: string) => apiRequest<any>(`/api/market/fundamentals?ticker=${ticker}`),
  getProfile: (ticker: string) => apiRequest<any>(`/api/market/profile?ticker=${ticker}`),
  getInsiders: (ticker: string) => apiRequest<any[]>(`/api/market/insiders?ticker=${ticker}`),
  getEarnings: (ticker: string) => apiRequest<any[]>(`/api/market/earnings?ticker=${ticker}`),
  getEarningsCalendar: () => apiRequest<any[]>("/api/market/earnings-calendar"),
  getEconomicCalendar: () => apiRequest<any[]>("/api/market/economic-calendar"),
  getOptions: (ticker: string) => apiRequest<any>(`/api/market/options?ticker=${ticker}`),
  getMarketBias: () => apiRequest<any>("/api/market/bias"),

  // AI Insights
  researchStockAI: (symbol: string, data: any) => 
    apiRequest<any>("/api/ai/research", { method: "POST", body: JSON.stringify({ symbol, data }) }),
  sentimentAI: (ticker: string, news: any[]) => 
    apiRequest<any>("/api/ai/sentiment", { method: "POST", body: JSON.stringify({ ticker, news }) }),
  detectSignalsAI: (ticker: string) => 
    apiRequest<any>("/api/ai/signals", { method: "POST", body: JSON.stringify({ ticker }) }),
  preTrade: (body: any) => 
    apiRequest<any>("/api/ai/pre-trade", { method: "POST", body: JSON.stringify(body) }),
  tradeAutopsyAI: (trade: any) => 
    apiRequest<any>("/api/ai/trade-autopsy", { method: "POST", body: JSON.stringify({ trade }) }),
  journalSummaryAI: (trades: any[]) => 
    apiRequest<any>("/api/ai/journal-summary", { method: "POST", body: JSON.stringify({ trades }) }),
  marketBiasAI: (body: any) => 
    apiRequest<any>("/api/ai/market-bias", { method: "POST", body: JSON.stringify(body) }),
  earningsPreviewAI: (ticker: string, history: any[]) => 
    apiRequest<any>("/api/ai/earnings-preview", { method: "POST", body: JSON.stringify({ ticker, history }) }),
  optionsExplainerAI: (body: any) => 
    apiRequest<any>("/api/ai/options-explainer", { method: "POST", body: JSON.stringify(body) }),
  analyzeInsidersAI: (ticker: string, transactions: any[]) => 
    apiRequest<any>("/api/ai/insider-analysis", { method: "POST", body: JSON.stringify({ ticker, transactions }) }),
  dailyDebriefAI: (body: any) => 
    apiRequest<any>("/api/ai/daily-debrief", { method: "POST", body: JSON.stringify(body) }),
  eventExplainerAI: (body: any) => 
    apiRequest<any>("/api/ai/event-explainer", { method: "POST", body: JSON.stringify(body) }),
};
