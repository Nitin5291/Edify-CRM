import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini_api_key = process.env.GEMINI_API_KEY || "AIzaSyBOPiy1_F3ZPe1qFQon27vm_md_fe2oFIM";
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiModel = googleAI.getGenerativeModel({
  model: "models/gemini-1.5-pro-latest",
});

export async function POST(req: NextRequest) {
  try {
    const { searchQuery } = await req.json();

    if (!searchQuery) {
      return NextResponse.json(
        { message: "searchQuery is required." },
        { status: 400 }
      );
    }

    const result = await geminiModel.generateContent(searchQuery);
    const response = result.response;

    return NextResponse.json({ result: response.text() }, { status: 200 });
  } catch (error: any) {
    console.error("Error asking AI:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
