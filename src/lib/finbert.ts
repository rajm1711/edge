import { InferenceClient } from "@huggingface/inference";

export function mapToDisplayLabel(label: string): 'bullish' | 'bearish' | 'neutral' {
  const normalized = label.toLowerCase();
  if (normalized === "positive") return "bullish";
  if (normalized === "negative") return "bearish";
  return "neutral";
}

export async function analyzeHeadlineSentiment(headline: string) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    throw new Error("HF_TOKEN is missing in environment variables");
  }

  const client = new InferenceClient(token);
  
  try {
    const output = await client.textClassification({
      model: "ProsusAI/finbert",
      inputs: headline,
      provider: "hf-inference",
    });

    // Output should be array of objects with label and score
    // E.g. [{ label: 'positive', score: 0.9 }, ...]
    const sorted = [...output].sort((a: any, b: any) => b.score - a.score);
    const topResult = sorted[0];

    return {
      label: topResult.label,
      score: topResult.score,
      allScores: sorted
    };
  } catch (error) {
    console.error("FinBERT Fetch Error:", error);
    return null;
  }
}

export async function analyzeBulkSentiment(headlines: string[]) {
  // run Promise.all in parallel
  const results = await Promise.all(headlines.map(analyzeHeadlineSentiment));
  return results;
}
