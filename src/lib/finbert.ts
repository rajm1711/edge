import { InferenceClient } from "@huggingface/inference";

export function mapToDisplayLabel(label: string): 'bullish' | 'bearish' | 'neutral' {
  const normalized = label?.toLowerCase() || '';
  if (normalized === "positive") return "bullish";
  if (normalized === "negative") return "bearish";
  return "neutral";
}

export async function analyzeHeadlineSentiment(headline: string) {
  const token = process.env.HF_TOKEN;
  if (!token || !headline || headline.trim() === '') {
    return {
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
        label: 'neutral',
        score: 0.5,
        allScores: []
      };
    }

    const sorted = [...output].sort((a: any, b: any) => b.score - a.score);
    const topResult = sorted[0];

    return {
      label: topResult.label,
      score: topResult.score,
      allScores: sorted
    };
  } catch (error) {
    console.error("FinBERT Sentiment Analysis Error:", error);
    return {
      label: 'neutral',
      score: 0.5,
      allScores: []
    };
  }
}

export async function analyzeBulkSentiment(headlines: string[], maxBatchSize: number = 8) {
  if (!headlines || !Array.isArray(headlines) || headlines.length === 0) {
    return [];
  }
  // Cap headlines array to prevent hitting rate limits
  const targetHeadlines = headlines.slice(0, maxBatchSize);
  const results = await Promise.all(targetHeadlines.map(analyzeHeadlineSentiment));
  return results;
}

