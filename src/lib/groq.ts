export async function callGroq<T = any>(prompt: string, maxTokens: number = 1500): Promise<T> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing in server environment variables");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API error HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("Groq API returned an empty or invalid content payload");
  }

  try {
    return JSON.parse(rawContent) as T;
  } catch (parseError) {
    console.error("Failed to parse Groq response JSON:", rawContent);
    throw new Error("Failed to parse structured JSON response from Groq LLM");
  }
}

