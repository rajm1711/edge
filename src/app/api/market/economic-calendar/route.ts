import { NextResponse } from "next/server";

export async function GET() {
  // Finnhub Economic Calendar is a premium endpoint.
  // Returning mock data to prevent "access to this resource" errors on free tier.
  const mockData = [
    { event: "Initial Jobless Claims", country: "US", time: "08:30", impact: "high" },
    { event: "Existing Home Sales", country: "US", time: "10:00", impact: "medium" },
    { event: "Fed Chair Powell Speaks", country: "US", time: "14:00", impact: "high" },
    { event: "Crude Oil Inventories", country: "US", time: "10:30", impact: "low" },
  ];

  return NextResponse.json({ success: true, data: mockData });
}
