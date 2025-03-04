import { db } from "@/db";
import { batches, trainers, leads, batch_lead } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { and, between, eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);

    const batchStatus = searchParams.get("batchStatus");
    const trainerId = searchParams.get("trainerId")
      ? parseInt(searchParams.get("trainerId") as string, 10)
      : null;
    const userId = searchParams.get("userId")
      ? parseInt(searchParams.get("userId") as string, 10)
      : null;
    const fromDate = searchParams.get("fromDate")
      ? new Date(searchParams.get("fromDate") as string)
      : null;
    const toDate = searchParams.get("toDate")
      ? new Date(searchParams.get("toDate") as string)
      : null;

    // Construct query filters dynamically
    const filters = [];

    if (batchStatus) filters.push(eq(batches.batchStatus, batchStatus));
    if (trainerId) filters.push(eq(batches.trainerId, trainerId));
    if (userId) filters.push(eq(leads.id, userId)); // Assuming `userId` refers to `leads.id`
    if (fromDate && toDate)
      filters.push(between(batches.createdAt, fromDate, toDate));

    // Fetch batches with associated leads and trainers
    const results = await db
      .select({
        batchId: batches.id,
        batchStatus: batches.batchStatus,
        createdAt: batches.createdAt,
        trainerName: trainers.trainerName,
        leads: sql<string>`json_agg(json_build_object(
          'name', ${leads.name},
          'techStack', ${leads.techStack},
          'phone', ${leads.phone},
          'email', ${leads.email}
        ))`.as("leads"),
      })
      .from(batches)
      .leftJoin(trainers, eq(batches.trainerId, trainers.id))
      .leftJoin(batch_lead, eq(batch_lead.batchId, batches.id))
      .leftJoin(leads, eq(batch_lead.leadId, leads.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .groupBy(batches.id, trainers.trainerName)
      .execute();

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
