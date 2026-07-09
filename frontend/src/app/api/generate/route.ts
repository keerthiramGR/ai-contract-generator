import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      purpose,
      department,
      companyName,
      country,
      state,
      city,
      duration,
      salary,
      projectType,
      additionalNotes,
      answers,
    } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional legal counsel and corporate lawyer. 
Draft a professional, binding contract based on the following specifications:
- Contract Type/Purpose: ${purpose}
- Company: ${companyName}
- Department: ${department}
- Location: ${city || ""}, ${state || ""}, ${country || ""}
- Duration: ${duration || "Indefinite"}
- Compensation/Salary: ${salary || "Not Specified"}
- Project/Employment Type: ${projectType || "Full-Time"}
- Additional Provisions: ${additionalNotes || "None"}
- Additional specific terms clarified by user: 
${answers && answers.length > 0 ? answers.map((a: string, i: number) => `- ${a}`).join("\n") : "None"}

Generate the output strictly as a JSON object with the following fields:
1. "generated_content": (string) The full formal contract text with standard headers, terms, definitions, scope, termination clauses, signatures layout, and governing law. Output in clean Markdown format inside the string.
2. "ai_summary": (string) A concise, bullet-pointed summary of key conditions and responsibilities.
3. "risk_score": (number) An assessment of contract risk for the party (0 to 100, where 0 is zero risk and 100 is highly risky/unbalanced).

Provide ONLY the raw JSON block without markdown formatting or surrounding code blocks.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting around JSON (e.g. ```json ... ```)
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7);
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.substring(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();

    try {
      const parsed = JSON.parse(cleanedText);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("JSON parsing error on Gemini response:", responseText);
      // Fallback
      return NextResponse.json({
        generated_content: responseText,
        ai_summary: `AI generated contract. Failed to parse structured summary. Details: purpose=${purpose}, company=${companyName}`,
        risk_score: 25,
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate contract" },
      { status: 500 }
    );
  }
}
