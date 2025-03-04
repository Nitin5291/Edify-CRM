import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { batches, learnersBatches , trainers } from '@/drizzle/schema';
import { desc, eq, inArray } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single batch by ID with all fields + trainerName
      const batch = await db
        .select({
          id: batches.id,
          batchName: batches.batchName,
          location: batches.location,
          slot: batches.slot,
          trainerId: batches.trainerId,
          batchStatus: batches.batchStatus,
          topicStatus: batches.topicStatus,
          noOfStudents: batches.noOfStudents,
          stack: batches.stack,
          startDate: batches.startDate,
          tentativeEndDate: batches.tentativeEndDate,
          classMode: batches.classMode,
          stage: batches.stage,
          comment: batches.comment,
          timing: batches.timing,
          batchStage: batches.batchStage,
          mentor: batches.mentor,
          zoomAccount: batches.zoomAccount,
          stackOwner: batches.stackOwner,
          owner: batches.owner,
          batchOwner: batches.batchOwner,
          description: batches.description,
          userId: batches.userId,
          createdAt: batches.createdAt,
          updatedAt: batches.updatedAt,
          trainerName: trainers.trainerName, // Add trainer's name
        })
        .from(batches)
        .leftJoin(trainers, eq(batches.trainerId, trainers.id))
        .where(eq(batches.id, Number(id)))
        .limit(1);

      if (!batch.length) {
        return NextResponse.json(
          { success: false, message: "Batch not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: batch[0] });
    }

    // Fetch all batches with all fields + trainerName
    const allBatches = await db
      .select({
        id: batches.id,
        batchName: batches.batchName,
        location: batches.location,
        slot: batches.slot,
        trainerId: batches.trainerId,
        batchStatus: batches.batchStatus,
        topicStatus: batches.topicStatus,
        noOfStudents: batches.noOfStudents,
        stack: batches.stack,
        startDate: batches.startDate,
        tentativeEndDate: batches.tentativeEndDate,
        classMode: batches.classMode,
        stage: batches.stage,
        comment: batches.comment,
        timing: batches.timing,
        batchStage: batches.batchStage,
        mentor: batches.mentor,
        zoomAccount: batches.zoomAccount,
        stackOwner: batches.stackOwner,
        owner: batches.owner,
        batchOwner: batches.batchOwner,
        description: batches.description,
        userId: batches.userId,
        createdAt: batches.createdAt,
        updatedAt: batches.updatedAt,
        trainerName: trainers.trainerName, // Add trainer's name
      })
      .from(batches)
      .leftJoin(trainers, eq(batches.trainerId, trainers.id))
      .orderBy(desc(batches.createdAt));

    return NextResponse.json({ success: true, data: allBatches });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching batches" },
      { status: 500 }
    );
  }
}



// POST a new batch
export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      // Extract all batch fields from request
      const {
        batchName,
        location,
        slot,
        trainerId,
        batchStatus = "Upcoming",
        topicStatus,
        noOfStudents,
        stack,
        startDate,
        tentativeEndDate,
        classMode,
        stage,
        comment,
        timing,
        batchStage,
        mentor,
        zoomAccount,
        stackOwner,
        owner,
        batchOwner,
        description,
        userId,
      } = body;
  
      // Ensure required fields are provided
      if (!batchName || !userId) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields' },
          { status: 400 }
        );
      }
  
      // Ensure startDate and tentativeEndDate are valid Date objects
      const parsedStartDate = new Date(startDate);
      const parsedTentativeEndDate = new Date(tentativeEndDate);
  
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedTentativeEndDate.getTime())) {
        return NextResponse.json(
          { success: false, message: 'Invalid date format' },
          { status: 400 }
        );
      }
  
      // Insert new batch into the database
      const newBatch = await db.insert(batches).values({
        batchName,
        location,
        slot,
        trainerId,
        batchStatus,
        topicStatus,
        noOfStudents,
        stack,
        startDate: parsedStartDate, // Ensure correct Date format
        tentativeEndDate: parsedTentativeEndDate, // Ensure correct Date format
        classMode,
        stage,
        comment,
        timing,
        batchStage,
        mentor,
        zoomAccount,
        stackOwner,
        owner,
        batchOwner,
        description,
        userId,
      }).returning();
  
      // Check if batch creation was successful
      const batchId = newBatch[0]?.id;
      if (!batchId) {
        return NextResponse.json(
          { success: false, message: 'Failed to create batch' },
          { status: 500 }
        );
      }
  
      return NextResponse.json({
        success: true,
        message: 'Batch created successfully',
        data: newBatch,
      });
    } catch (error) {
      console.error('Error creating batch:', error);
      return NextResponse.json(
        { success: false, message: 'Error creating batch', error },
        { status: 500 }
      );
    }
  }


// PUT - Update a batch
export async function PUT(req: Request) {
    try {

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

       const body = await req.json();
      const {...updates } = body;
  
      // Ensure batch ID is provided
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Batch ID is required" },
          { status: 400 }
        );
      }
  
      // Validate provided dates (if included)
      if (updates.startDate) {
        const parsedStartDate = new Date(updates.startDate);
        if (isNaN(parsedStartDate.getTime())) {
          return NextResponse.json(
            { success: false, message: "Invalid startDate format" },
            { status: 400 }
          );
        }
        updates.startDate = parsedStartDate;
      }
  
      if (updates.tentativeEndDate) {
        const parsedTentativeEndDate = new Date(updates.tentativeEndDate);
        if (isNaN(parsedTentativeEndDate.getTime())) {
          return NextResponse.json(
            { success: false, message: "Invalid tentativeEndDate format" },
            { status: 400 }
          );
        }
        updates.tentativeEndDate = parsedTentativeEndDate;
      }
  
      // Ensure there's at least one field to update
      if (Object.keys(updates).length === 0) {
        return NextResponse.json(
          { success: false, message: "No fields to update" },
          { status: 400 }
        );
      }
  
      // Perform the update
      const updatedBatch = await db.update(batches)
        .set(updates)
        .where(eq(batches.id, Number(id)))
        .returning();
  
      if (!updatedBatch.length) {
        return NextResponse.json(
          { success: false, message: "Batch not found or no changes made" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        success: true,
        message: "Batch updated successfully",
        data: updatedBatch[0],
      });
    } catch (error) {
      console.error("Error updating batch:", error);
      return NextResponse.json(
        { success: false, message: "Error updating batch", error },
        { status: 500 }
      );
    }
  }
  

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idString = searchParams.get("ids"); // Expecting "1,2,3"

    if (!idString) {
      return NextResponse.json(
        { message: "Batch IDs are required" },
        { status: 400 }
      );
    }

    // Convert comma-separated string into an array of numbers
    const ids = idString.split(",").map((id) => Number(id.trim()));

    if (ids.some(isNaN)) {
      return NextResponse.json(
        { message: "Invalid Batch IDs format" },
        { status: 400 }
      );
    }

    // Check if batches exist before deleting
    const existingBatches = await db
      .select()
      .from(batches)
      .where(inArray(batches.id, ids));

    if (existingBatches.length === 0) {
      return NextResponse.json(
        { message: "No batches found for the given IDs" },
        { status: 404 }
      );
    }

    // First, delete related records in learnersBatches table
    await db
      .delete(learnersBatches)
      .where(inArray(learnersBatches.batchId, ids));

    // Now, delete batches from the database
    await db.delete(batches).where(inArray(batches.id, ids));

    return NextResponse.json({
      message: "Batches and related learner-batch entries deleted successfully",
      deletedBatchIds: ids,
    });
  } catch (error: any) {
    console.error("Error deleting batches:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}