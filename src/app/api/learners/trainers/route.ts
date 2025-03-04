import { db } from "@/db";
import { batches, learners, trainers } from "@/drizzle/schema";
import { inArray, eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Learner ID is required" },
        { status: 400 }
      );
    }

    const learnerId = Number(id);

    // Fetch learner data
    const learner = await db
      .select()
      .from(learners)
      .where(eq(learners.id, learnerId))
      .limit(1);

    if (!learner.length) {
      return NextResponse.json(
        { message: "Learner not found" },
        { status: 404 }
      );
    }

    // Extract batchId and convert it to an array
    const batchIdString = learner[0].batchId || ""; // Ensure it's a string
    const batchIds = batchIdString
      .split(",")
      .map((id) => id.trim()) // Remove spaces
      .filter((id) => id !== "" && !isNaN(Number(id))) // Remove empty values & non-numeric
      .map(Number);

    if (batchIds.length === 0) {
      return NextResponse.json(
        { message: "No valid batch IDs found" },
        { status: 404 }
      );
    }

    // Fetch batch details
    const batchDetails = await db
      .select({
        id: batches.id,
        trainerId: batches.trainerId,
      })
      .from(batches)
      .where(inArray(batches.id, batchIds));

    if (batchDetails.length === 0) {
      return NextResponse.json(
        { message: "No batch details found", trainers: [] },
        { status: 404 }
      );
    }

    // Extract unique trainer IDs (excluding null/undefined)
    // const trainerIds = Array.from(
    //   new Set(batchDetails.map((batch) => batch.trainerId).filter(Boolean))
    // );
    const trainerIds = Array.from(
      new Set(
        batchDetails
          .map((batch) => batch.trainerId)
          .filter((id): id is number => id !== null && id !== undefined) // Ensure only numbers are kept
      )
    );

    let trainerDetails: any;
    if (trainerIds.length > 0) {
      // Fetch trainer details
      trainerDetails = await db
        .select()
        .from(trainers)
        .where(inArray(trainers.id, trainerIds));
    }

    return NextResponse.json({
      trainers: trainerDetails,
    });
  } catch (error) {
    console.error("Error fetching trainer details:", error);
    return NextResponse.json(
      { message: "Error fetching trainer details", error: error },
      { status: 500 }
    );
  }
}
