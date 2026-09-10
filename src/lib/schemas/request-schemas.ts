import { z } from "zod";

export const TickerSchema = z.string()
  .min(1)
  .max(10)
  .regex(/^[A-Z0-9.^]+$/i, "Invalid ticker format")
  .transform((val) => val.trim().toUpperCase());

export const ResearchRequestSchema = z.object({
  ticker: TickerSchema,
  price: z.number().positive().optional(),
  fundamentals: z.record(z.string(), z.unknown()).optional(),
  profile: z.record(z.string(), z.unknown()).optional(),
});

export const SentimentRequestSchema = z.object({
  ticker: TickerSchema,
  headlines: z.array(z.string().min(1).max(500)).min(1).max(20),
});

export const SignalsRequestSchema = z.object({
  ticker: TickerSchema,
  price: z.number().positive(),
  fundamentals: z.record(z.string(), z.unknown()).optional(),
});


export const PreTradeRequestSchema = z.object({
  ticker: TickerSchema,
  price: z.number().positive(),
  direction: z.enum(["long", "short"]),
  entry: z.number().positive(),
  stopLoss: z.number().positive(),
  target: z.number().positive(),
  portfolioSize: z.number().positive().optional(),
  riskPercent: z.number().min(0.1).max(100).optional(),
  thesis: z.string().min(5).max(2000),
  horizon: z.enum(["intraday", "swing", "positional"]),
  newsHeadlines: z.array(z.string()).max(10).optional(),
});

export const TradeAutopsyRequestSchema = z.object({
  ticker: TickerSchema,
  direction: z.enum(["long", "short"]),
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive(),
  entryDate: z.string(),
  exitDate: z.string(),
  quantity: z.number().positive(),
  thesis: z.string().max(2000).optional(),
  reason: z.string().max(2000).optional(),
  emotionEntry: z.string().max(100).optional(),
  emotionExit: z.string().max(100).optional(),
  outcome: z.enum(["won", "lost", "breakeven"]),
});

export const JournalSummaryRequestSchema = z.object({
  trades: z.array(
    z.object({
      ticker: TickerSchema,
      direction: z.enum(["long", "short"]),
      entryPrice: z.number().positive(),
      exitPrice: z.number().positive(),
      quantity: z.number().positive(),
      outcome: z.enum(["won", "lost", "breakeven"]),
      emotionEntry: z.string().max(100).optional(),
      thesis: z.string().max(2000).optional(),
    })
  ).min(1).max(500),
});

export const MarketBiasRequestSchema = z.object({
  spChange: z.number(),
  nasdaqChange: z.number(),
  vix: z.number().positive(),
  headlines: z.array(z.string().max(500)).max(20),
});
