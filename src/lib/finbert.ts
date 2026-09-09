import { InferenceClient } from "@huggingface/inference";

export type SentimentLabel = 'bullish' | 'bearish' | 'neutral' | 'unavailable';

export interface HeadlineSentimentResult {
  status: 'ok' | 'unavailable';
  label: SentimentLabel;
  score: number;
  allScores: Array<{ label: string; score: number }>;
  error?: string;
}

export function mapToDisplayLabel(label: string): SentimentLabel {
  const normalized = label?.toLowerCase() || '';
  if (normalized === "positive") return "bullish";
  if (normalized === "negative") return "bearish";
  if (normalized === "neutral") return "neutral";
  return "unavailable";
}

export async function analyzeHeadlineSentiment(headline: string): Promise<HeadlineSentimentResult> {
  const token = process.env.HF_TOKEN;

  if (!token) {
    return {
      status: 'unavailable',
      label: 'unavailable',
      score: 0,
      allScores: [],
      error: 'HF_TOKEN missing'
    };
  }

  if (!headline || headline.trim() === '') {
    return {
      status: 'ok',
      label: 'neutral',
      score: 0.5,
      allScores: [{ label: 'neutral', score: 0.5 }]
    };
  }

  const client = new InferenceClient(token);

  try {
    const output = await client.textClassification({
      model: "ProsusAI/finbert",
      inputs: headline,
      provider: "hf-inference",
    });

    if (!output || !Array.isArray(output) || output.length === 0) {
      return {
        status: 'unavailable',
        label: 'unavailable',
        score: 0,
        allScores: [],
        error: 'Empty model output'
      };
    }

    const sorted = [...output].sort((a: any, b: any) => b.score - a.score);
    const topResult = sorted[0];

    return {
      status: 'ok',
      label: mapToDisplayLabel(topResult.label),
      score: topResult.score,
      allScores: sorted
    };
  } catch (error: any) {
    console.error("FinBERT Sentiment Analysis Error:", error?.message || error);
    return {
      status: 'unavailable',
      label: 'unavailable',
      score: 0,
      allScores: [],
      error: error?.message || 'Inference failed'
    };
  }
}

export async function analyzeBulkSentiment(
  headlines: string[],
  maxBatchSize: number = 8
): Promise<HeadlineSentimentResult[]> {
  if (!headlines || !Array.isArray(headlines) || headlines.length === 0) {
    return [];
  }
  // Cap headlines array to prevent hitting rate limits
  const targetHeadlines = headlines.slice(0, maxBatchSize);
  const results = await Promise.all(targetHeadlines.map(analyzeHeadlineSentiment));
  return results;
}
