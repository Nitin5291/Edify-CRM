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

    const batchIdString = learner[0].batchId || "";
    const batchIds = batchIdString
      .split(",")
      .map((id) => id.trim()) // Remove spaces
      .filter((id) => id !== "" && !isNaN(Number(id))) // Remove empty values & non-numeric
      .map(Number);

    if (batchIds.length === 0) {
      return NextResponse.json(
        { message: "No valid batch IDs found", batchDetails: [] },
        { status: 404 }
      );
    }

    // Fetch batch details
    const batchDetails = await db
      .select()
      .from(batches)
      .where(inArray(batches.id, batchIds));

    if (batchDetails.length === 0) {
      return NextResponse.json(
        { message: "No batch details found", batchDetails: [] },
        { status: 404 }
      );
    }

    // Get unique trainer IDs from batch details
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

    // Fetch trainer names
    const trainerDetails = await db
      .select({
        id: trainers.id,
        trainerName: trainers.trainerName,
      })
      .from(trainers)
      .where(inArray(trainers.id, trainerIds));

    // Create a lookup for trainerId -> trainerName
    const trainerMap = new Map(
      trainerDetails.map((trainer) => [trainer.id, trainer.trainerName])
    );

    return NextResponse.json(
      {
        batchDetails: batchDetails.map((batch: any) => ({
          ...batch,
          id: String(batch.id), // Ensure ID remains string
          trainerName: trainerMap.get(batch.trainerId) || "Unknown", // Add trainerName
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching batch details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
