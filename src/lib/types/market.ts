export interface StockQuote {
  ticker: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  timestamp: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  up: boolean;
}

export interface NewsArticle {
  headline: string;
  source: string;
  datetime: number;
  url: string;
  summary: string;
  image?: string;
  ticker?: string;
}

export interface CompanyProfile {
  companyName: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  logo: string;
  weburl: string;
  country: string;
  currency: string;
  shareOutstanding: number;
  marketCap: number;
}

export interface Fundamentals {
  peRatio: number | null;
  eps: number | null;
  marketCap: number | null;
  beta: number | null;
  dividendYield: number | null;
  revenueGrowth: number | null;
  profitMargin: number | null;
  week52High: number | null;
  week52Low: number | null;
}

export interface InsiderTransaction {
  name: string;
  transactionType: "buy" | "sell";
  share: number;
  transactionPrice: number;
  value: number;
  date: string;
  filingDate: string;
}

export interface EarningsData {
  period: string;
  actual: number | null;
  estimate: number | null;
  surprise: number | null;
  surprisePercent: number | null;
  date: string;
}

export interface JournalTrade {
  id: string;
  ticker: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryDate: string;
  exitDate: string;
  strategy: string;
  emotionEntry: string;
  emotionExit: string;
  thesis: string;
  outcome: "won" | "lost" | "breakeven";
  pnl: number;
  pnlPercent: number;
  riskReward: number;
  createdAt: string;
}

export interface JournalStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  averageRiskReward: number;
  bestTrade: JournalTrade | null;
  worstTrade: JournalTrade | null;
}
