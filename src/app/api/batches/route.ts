import { NextResponse } from 'next/server';
import { db } from '@/db';
import { batches } from '@/drizzle/schema';
import { desc, eq } from 'drizzle-orm';

// GET all batches// GET - Fetch a single batch if ID is provided, otherwise return all batches sorted by createdAt (descending)
export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (id) {
        // Fetch single batch by ID
        const batch = await db.select().from(batches).where(eq(batches.id, Number(id))).limit(1);
  
        if (!batch.length) {
          return NextResponse.json(
            { success: false, message: "Batch not found" },
            { status: 404 }
          );
        }
  
        return NextResponse.json({ success: true, data: batch[0] });
      }
  
      // Fetch all batches sorted by createdAt (descending)
      const allBatches = await db
        .select()
        .from(batches)
        .orderBy(desc(batches.createdAt)); // Sorting by newest createdAt first
  
      return NextResponse.json({ success: true, data: allBatches });
    } catch (error) {
      console.error("Error fetching batches:", error);
      return NextResponse.json(
        { success: false, message: "Error fetching batches" },
        { status: 500 }
      );
    }
  }
  

// // POST a new batch
// export async function POST(req: Request) {
//     try {
//       const body = await req.json();
  
//       // Extract all batch fields from request
//       const {
//         batchName,
//         location,
//         slot,
//         trainerId,
//         batchStatus = "Upcoming",
//         topicStatus,
//         noOfStudents,
//         stack,
//         startDate,
//         tentativeEndDate,
//         classMode,
//         stage,
//         comment,
//         timing,
//         batchStage,
//         mentor,
//         zoomAccount,
//         stackOwner,
//         owner,
//         batchOwner,
//         description,
//         userId,
//         learnerIds, // Array of learner IDs
//       } = body;
  
//       // Ensure required fields are provided
//       if (!batchName || !startDate || !tentativeEndDate || !batchStatus || !userId) {
//         return NextResponse.json(
//           { success: false, message: 'Missing required fields' },
//           { status: 400 }
//         );
//       }
  
//       // Insert new batch into the database with all schema fields
//       const newBatch = await db.insert(batches).values({
//         batchName,
//         location,
//         slot,
//         trainerId,
//         batchStatus,
//         topicStatus,
//         noOfStudents,
//         stack,
//         startDate,
//         tentativeEndDate,
//         classMode,
//         stage,
//         comment,
//         timing,
//         batchStage,
//         mentor,
//         zoomAccount,
//         stackOwner,
//         owner,
//         batchOwner,
//         description,
//         userId,
//       }).returning();
  
//       const batchId = newBatch[0]?.id;
//       if (!batchId) {
//         return NextResponse.json({ success: false, message: 'Failed to create batch' }, { status: 500 });
//       }
  
//       Associate learners with the batch (if provided)
//       if (learnerIds && Array.isArray(learnerIds) && learnerIds.length > 0) {
//         // Validate learner IDs before association
//         const validLearners = await db
//           .select()
//           .from(learners)
//           .where(inArray(learners.id, learnerIds));
  
//         if (validLearners.length > 0) {
//           const batchAssociations = validLearners.map((learner) => ({ 
//             learnerId: learner.id,
//             batchId,
//           }));
  
//           await db.insert(learnerBatch).values(batchAssociations);
//         }
//       }
  
//       return NextResponse.json({
//         success: true,
//         message: 'Batch created successfully',
//         data: newBatch,
//       });
//     } catch (error) {
//       console.error('Error creating batch:', error);
//       return NextResponse.json(
//         { success: false, message: 'Error creating batch', error },
//         { status: 500 }
//       );
//     }
//   }

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
      if (!batchName || !startDate || !tentativeEndDate || !batchStatus || !userId) {
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
// PUT - Update an existing batch
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
  

// DELETE - Remove a batch
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: 'Batch ID is required' }, { status: 400 });
    }

    const deletedBatch = await db.delete(batches).where(eq(batches.id, Number(id))).returning();

    if (!deletedBatch.length) {
      return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    return NextResponse.json({ success: false, message: 'Error deleting batch' }, { status: 500 });
  }
}
