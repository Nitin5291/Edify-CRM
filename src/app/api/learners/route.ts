import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { learners, learnersBatches } from "@/drizzle/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { uploadFile } from "./../utils/upload"
import { parseISO } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const formData : any = await req.formData();
    const batchIds = JSON.parse((formData.get("batchIds") as string) || "[]");

    const learnerData: any = {};

    for (const entry of formData.entries()) {
      const [key, value] = entry;
      if (value instanceof File) {
        learnerData[key] = await uploadFile(value, `${key}s`);
      } else {
        learnerData[key] = value;
      }
    }

    // Convert date fields to Date objects
    if (learnerData.dateOfBirth)
      learnerData.dateOfBirth = new Date(learnerData.dateOfBirth);
    if (learnerData.registeredDate)
      learnerData.registeredDate = new Date(learnerData.registeredDate);
    if (learnerData.dueDate)
      learnerData.dueDate = new Date(learnerData.dueDate);

    // Save batchIds in learners table
    learnerData.batchId = JSON.stringify(batchIds);

    // Insert learner data
    const [learner] = await db.insert(learners).values(learnerData).returning();

    // Insert batch associations
    if (learner && batchIds.length > 0) {
      const batchAssociations = batchIds.map((batchId: string) => ({
        learnerId: learner.id,
        batchId,
      }));
      await db.insert(learnersBatches).values(batchAssociations);
    }

    return NextResponse.json(learner, { status: 201 });
  } catch (error) {
    console.error("Error creating learner:", error);
    return NextResponse.json(
      { message: "Error creating learner" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id: any = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { message: "Learner ID is required" },
        { status: 400 }
      );

    // Check if learner exists
    const existingLearner = await db
      .select()
      .from(learners)
      .where(eq(learners.id, id))
      .limit(1);

    if (!existingLearner.length) {
      return NextResponse.json(
        { message: "Learner not found" },
        { status: 404 }
      );
    }

    const formData: any = await req.formData();
    const learnerData: any = {};

    for (const entry of formData.entries()) {
      const [key, value] = entry;
      if (value instanceof File) {
        const uploadedFile = await uploadFile(value, `${key}s`);
        if (uploadedFile) learnerData[key] = uploadedFile;
      } else {
        learnerData[key] = value;
      }
    }

    // Convert date fields to Date objects
    if (learnerData.dateOfBirth)
      learnerData.dateOfBirth = new Date(learnerData.dateOfBirth);
    if (learnerData.registeredDate)
      learnerData.registeredDate = new Date(learnerData.registeredDate);
    if (learnerData.dueDate)
      learnerData.dueDate = new Date(learnerData.dueDate);

    // Update learner details
    await db.update(learners).set(learnerData).where(eq(learners.id, id));

    // Handle batch associations
    if (formData.has("batchIds")) {
      const batchIds = JSON.parse((formData.get("batchIds") as string) || "[]");
      await db.delete(learnersBatches).where(eq(learnersBatches.learnerId, id));
      if (batchIds.length > 0) {
        const newBatchAssociations = batchIds.map((batch: any) => ({
          learnerId: id,
          batchId: batch,
        }));
        await db.insert(learnersBatches).values(newBatchAssociations);
      }
    }

    // Fetch the updated learner data
    const updatedLearner = await db
      .select()
      .from(learners)
      .where(eq(learners.id, id))
      .limit(1);

    return NextResponse.json({
      message: "Learner updated successfully",
      updatedLearner: updatedLearner[0],
    });
  } catch (error) {
    console.error("Error updating learner:", error);
    return NextResponse.json(
      { message: "Error updating learner" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Learner ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(learners)
      .where(eq(learners.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Learner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Learner deleted successfully",
      deletedId: Number(id),
    });
  } catch (error: any) {
    console.error("Error deleting Learner:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Learner ID filter
    const userId = searchParams.get("userId"); // User ID filter
    const fromDate = searchParams.get("fromDate"); // Start date filter
    const toDate = searchParams.get("toDate"); // End date filter

    let conditions = [];

    // Filter by ID
    if (id) {
      conditions.push(eq(learners.id, Number(id)));
    } else {
      // Apply additional filters only if no specific ID is provided
      if (userId) conditions.push(eq(learners.userId, userId));

      if (fromDate && toDate) {
        const parsedFromDate = parseISO(fromDate);
        const parsedToDate = parseISO(toDate);

        conditions.push(
          and(
            gte(learners.createdAt, parsedFromDate),
            lte(learners.createdAt, parsedToDate)
          )
        );
      }
    }

    // Fetch learners based on filters
    const query = db
      .select()
      .from(learners)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(learners.createdAt));

    const result = await query;

    return NextResponse.json({ learners: id ? result?.[0] : result });
  } catch (error: any) {
    console.error("Error fetching learners:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}