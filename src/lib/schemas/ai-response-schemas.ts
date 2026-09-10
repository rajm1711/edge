import { z } from "zod";

export const VerdictEnum = z.enum([
  "Strongly Bullish",
  "Bullish",
  "Neutral",
  "Bearish",
  "Strongly Bearish",
]);

export const ResearchResponseSchema = z.object({
  oneLiner: z.string().max(300),
  bullCase: z.string().max(1000),
  bearCase: z.string().max(1000),
  keyStrengths: z.array(z.string()).max(5),
  keyRisks: z.array(z.string()).max(5),
  catalysts: z.array(z.string()).max(5),
  analystVerdict: VerdictEnum,
  confidenceScore: z.number().min(0).max(100),
  summary: z.string().max(2000),
});

export const MarketBiasResponseSchema = z.object({
  overallBias: VerdictEnum,
  confidenceScore: z.number().min(0).max(100),
  reasoning: z.array(z.string()).max(6),
  sectorBias: z.array(
    z.object({
      sector: z.string(),
      bias: z.enum(["bullish", "bearish", "neutral"]),
      reason: z.string(),
    })
  ).max(10),
  keyRisksToday: z.array(z.string()).max(5),
  keyOpportunitiesToday: z.array(z.string()).max(5),
  vixInterpretation: z.string(),
  analystNote: z.string(),
  tomorrowOutlook: z.string(),
});

export const TradeAutopsyResponseSchema = z.object({
  whatWentRight: z.array(z.string()).max(3),
  whatWentWrong: z.array(z.string()).max(3),
  emotionImpact: z.string(),
  thesisQuality: z.enum(["weak", "moderate", "strong"]),
  thesisFeedback: z.string(),
  keyLesson: z.string(),
  doNextTime: z.string(),
  score: z.number().min(0).max(100),
});

export const PreTradeResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  grade: z.enum(["A", "B", "C", "D", "F"]),
  greenFlags: z.array(z.string()).max(4),
  redFlags: z.array(z.string()).max(4),
  missingResearch: z.array(z.string()).max(3),
  suggestion: z.string(),
  verdict: z.enum(["proceed", "reconsider", "avoid"]),
});

export const SentimentResponseSchema = z.object({
  articles: z.array(
    z.object({
      headline: z.string(),
      sentiment: z.enum(["bullish", "bearish", "neutral", "unavailable"]),
      score: z.number().min(0).max(100),
      reasoning: z.string().optional(),
    })
  ),
  overallSentiment: z.enum(["bullish", "bearish", "neutral", "unavailable"]),
  overallScore: z.number().min(0).max(100),
  marketImpact: z.string(),
});

export const SignalsResponseSchema = z.object({
  observations: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["bullish", "bearish", "neutral"]),
      description: z.string(),
      strength: z.enum(["weak", "moderate", "strong"]),
      timeframe: z.enum(["intraday", "swing", "positional"]),
      insight: z.string(),
    })
  ).max(6),
});

export const JournalSummaryResponseSchema = z.object({
  overallGrade: z.enum(["A", "B", "C", "D", "F"]),
  gradingReason: z.string(),
  performanceSummary: z.string(),
  topStrength: z.string(),
  mainWeakness: z.string(),
  emotionalPatterns: z.array(
    z.object({
      emotion: z.string(),
      wins: z.number(),
      losses: z.number(),
      insight: z.string(),
    })
  ),
  weeklyGoals: z.array(z.string()).max(5),
  psychologyScore: z.number().min(0).max(100),
  disciplineScore: z.number().min(0).max(100),
  riskManagementScore: z.number().min(0).max(100),
});
