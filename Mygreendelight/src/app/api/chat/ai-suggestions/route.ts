import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json([]);
    }

    const prompt = `
You are a delivery assistant.

Customer message:
"${text}"

Generate exactly 3 short delivery-related replies.

Rules:
- Maximum 10 words each
- Friendly
- Professional
- Return only JSON array

Example:
[
 "I'm 5 minutes away",
 "Reaching shortly",
 "On my way"
]
`;

    let result;

    // ✅ Handle quota / rate limit safely
    try {
      result = await model.generateContent(prompt);
    } catch (error: any) {
      console.log("Gemini Error:", error);

      // if quota exceeded → return fallback instantly
      if (error?.status === 429) {
        return NextResponse.json([
          "I'm on my way",
          "Reaching shortly",
          "Thank you"
        ]);
      }

      throw error;
    }

    const raw = result.response.text();

    // ✅ Clean Gemini response (important)
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const suggestions = JSON.parse(cleaned);
      return NextResponse.json(suggestions);
    } catch (err) {
      console.log("JSON Parse Error:", err);

      return NextResponse.json([
        "I'm on my way",
        "Reaching shortly",
        "Thank you"
      ]);
    }
  } catch (error) {
    console.log("Server Error:", error);

    return NextResponse.json([
      "I'm on my way",
      "Reaching shortly",
      "Thank you"
    ]);
  }
}