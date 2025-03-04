import { db } from "@/db";
import { leads, trainers, batches, batch_lead } from "@/drizzle/schema"; // Ensure batch_lead is correctly imported
import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm"; // Import `sql` helper from drizzle-orm

export async function GET(req: NextRequest) {
  try {
    const results = await db
      .select({
        trainerId: trainers.id,
        trainerName: trainers.trainerName,
        phone: trainers.phone,
        email: trainers.email,
        batchCount: sql<number>`COUNT(DISTINCT ${batches.id})`.as("batchCount"),
        learnerCount: sql<number>`COUNT(DISTINCT ${leads.id})`.as(
          "learnerCount"
        ),
      })
      .from(trainers)
      .leftJoin(batches, eq(batches.trainerId, trainers.id))
      .leftJoin(batch_lead, eq(batch_lead.batchId, batches.id)) // Correct join with batch_lead
      .leftJoin(leads, eq(leads.id, batch_lead.leadId)) // Single join with leads
      .groupBy(trainers.id)
      .orderBy(trainers.trainerName)
      .execute();

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching trainer stats:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
