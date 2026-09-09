import { NextRequest, NextResponse } from "next/server";
import { callGroq, sanitizePromptContext } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const tradeAutopsyInputSchema = z.object({
  ticker: z.string().trim().min(1).max(10).transform((val) => val.toUpperCase()),
  entryPrice: z.number().optional().or(z.string().optional()),
  exitPrice: z.number().optional().or(z.string().optional()),
  entryDate: z.string().optional(),
  exitDate: z.string().optional(),
  reason: z.string().max(500).optional(),
  emotion: z.string().max(200).optional(),
  outcome: z.string().max(200).optional(),
  thesis: z.string().max(1000).optional(),
});

const tradeAutopsyOutputSchema = z.object({
  whatWentRight: z.array(z.string()).default([]),
  whatWentWrong: z.array(z.string()).default([]),
  emotionImpact: z.string().default("Neutral emotional execution."),
  thesisQuality: z.enum(["weak", "moderate", "strong"]).default("moderate"),
  thesisFeedback: z.string().default("Thesis was executed per plan."),
  keyLesson: z.string().default("Maintain strict risk management."),
  doNextTime: z.string().default("Follow exit rules."),
  score: z.number().min(0).max(100).default(70),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "client-ip";
    const rateLimit = checkRateLimit(ip, 15, 60000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait a minute before making more requests." },
        { status: 429 }
      );
    }
    const rawBody = await request.json().catch(() => null);
    const targetPayload = rawBody?.trade || rawBody;
    const parsedInput = tradeAutopsyInputSchema.safeParse(targetPayload);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid trade autopsy parameters",
          details: parsedInput.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      ticker,
      entryPrice,
      exitPrice,
      entryDate,
      exitDate,
      reason,
      emotion,
      outcome,
      thesis,
    } = parsedInput.data;

    const safeThesis = sanitizePromptContext(thesis || "None provided");
    const safeReason = sanitizePromptContext(reason || "None provided");

    const prompt = `You are an AI trading performance coach analyzing a completed trade for educational self-reflection.
Ticker: ${ticker}
Entry Price: $${entryPrice || "N/A"} on ${entryDate || "N/A"}
Exit Price: $${exitPrice || "N/A"} on ${exitDate || "N/A"}
Emotional State: ${emotion || "N/A"}
Trade Outcome: ${outcome || "N/A"}

User Thesis:
${safeThesis}

Exit Reason:
${safeReason}

Analyze this completed trade execution objectively.
Return only valid JSON with these exact fields:
- "whatWentRight": array of up to 3 positive execution points
- "whatWentWrong": array of up to 3 mistakes or areas of improvement
- "emotionImpact": string (1 sentence analyzing emotional influence)
- "thesisQuality": string ("weak", "moderate", or "strong")
- "thesisFeedback": string (1 sentence feedback on thesis validity)
- "keyLesson": string (1 sentence key takeaway)
- "doNextTime": string (1 sentence rule to apply next time)
- "score": number (0-100 overall discipline score)`;

    const data = await callGroq(prompt, {
      schema: tradeAutopsyOutputSchema,
      maxTokens: 1200,
      temperature: 0.3,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Trade Autopsy Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate AI trade autopsy" },
      { status: 500 }
    );
  }
}
