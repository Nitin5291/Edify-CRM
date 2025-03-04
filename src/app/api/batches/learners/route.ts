import { db } from "@/db";
import { learners } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { like } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("id"); // Get batchId from query parameters

    if (!batchId) {
      return NextResponse.json(
        { message: "Batch ID is required" },
        { status: 400 }
      );
    }

    // Search for learners where batchId contains the given batch ID
    const filteredLearners = await db
      .select()
      .from(learners)
      .where(like(learners.batchId, `%${batchId}%`)); // Use LIKE for substring search

    // **Fix: Parse batchId before sending response**
    const formattedLearners = filteredLearners.map((learner : any) => ({
      ...learner,
      batchId: JSON.parse(learner.batchId), // Convert back to a proper string
    }));

    return NextResponse.json(formattedLearners, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving learners:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
