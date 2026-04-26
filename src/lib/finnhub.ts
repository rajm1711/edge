const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export async function fetchFinnhub(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    throw new Error("FINNHUB_API_KEY is missing in environment variables");
  }

  const queryParams = new URLSearchParams({
    ...params,
    token: apiKey,
  });

  const url = `${FINNHUB_BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 30 }, // Default revalidation 30 seconds
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Finnhub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Finnhub Fetch Error (${endpoint}):`, error);
    throw error;
  }
}

// Specific Market Helpers
export const finnhubApi = {
  getQuote: (symbol: string) => fetchFinnhub("/quote", { symbol }),
  getIndices: (symbol: string) => fetchFinnhub("/quote", { symbol }), // Ticker tape
  getCompanyNews: (symbol: string, from: string, to: string) => 
    fetchFinnhub("/company-news", { symbol, from, to }),
  getMetrics: (symbol: string) => fetchFinnhub("/stock/metric", { symbol, metric: "all" }),
  getProfile: (symbol: string) => fetchFinnhub("/stock/profile2", { symbol }),
  getInsiders: (symbol: string) => fetchFinnhub("/stock/insider-transactions", { symbol }),
  getEarnings: (symbol: string) => fetchFinnhub("/stock/earnings", { symbol }),
  getEarningsCalendar: (from: string, to: string) => fetchFinnhub("/calendar/earnings", { from, to }),
  getEconomicCalendar: (from: string, to: string) => fetchFinnhub("/calendar/economic", { from, to }),
  getOptions: (symbol: string) => fetchFinnhub("/stock/option-chain", { symbol }),
  getGeneralNews: (category: string = "general") => fetchFinnhub("/news", { category }),
};
