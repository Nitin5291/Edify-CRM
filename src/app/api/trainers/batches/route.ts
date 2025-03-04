import { db } from "@/db";
import { batches , trainers } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trainerId : any = searchParams.get("id"); // Get trainerId from query parameters

    if (!trainerId) {
      return NextResponse.json(
        { message: "Trainer ID is required" },
        { status: 400 }
      );
    }

    // Fetch batches where trainerId matches the provided ID
    const matchedBatches = await db
      .select()
      .from(batches)
      .where(eq(batches.trainerId, trainerId));

    return NextResponse.json(matchedBatches, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving batches:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
