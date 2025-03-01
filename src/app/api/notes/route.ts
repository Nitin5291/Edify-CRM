import { db } from "@/db";
import { notes } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// ✅ Create a Note
export async function POST(req: NextRequest) {
  try {
    const {
      content,
      userId, // Added userId
      leadId,
      batchId,
      trainerId,
      campaignId,
      learnerId,
      mainTaskId,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Insert note into the database
    const [newNote] = await db
      .insert(notes)
      .values({
        content,
        userId, // Added userId
        leadId,
        batchId,
        trainerId,
        campaignId,
        learnerId,
        mainTaskId,
      })
      .returning(); // Get inserted note

    return NextResponse.json(newNote, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Fetch Notes (with filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // Added userId filter
    const leadId = searchParams.get("leadId");
    const batchId = searchParams.get("batchId");
    const trainerId = searchParams.get("trainerId");
    const campaignId = searchParams.get("campaignId");
    const learnerId = searchParams.get("learnerId");
    const mainTaskId = searchParams.get("mainTaskId");

    // Build filter conditions dynamically
    const conditions = [];
    if (userId) conditions.push(eq(notes.userId, userId)); // Added userId condition
    if (leadId) conditions.push(eq(notes.leadId, Number(leadId)));
    if (batchId) conditions.push(eq(notes.batchId, Number(batchId)));
    if (trainerId) conditions.push(eq(notes.trainerId, Number(trainerId)));
    if (campaignId) conditions.push(eq(notes.campaignId, Number(campaignId)));
    if (learnerId) conditions.push(eq(notes.learnerId, Number(learnerId)));
    if (mainTaskId) conditions.push(eq(notes.mainTaskId, Number(mainTaskId)));

    // Fetch filtered notes
    const allNotes = await db
      .select()
      .from(notes)
      .where(and(...conditions));

    return NextResponse.json({ data: allNotes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update Note by ID
export async function PUT(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (!id) {
        return NextResponse.json(
          { error: "Note ID is required" },
          { status: 400 }
        );
      }
  
      const {
        content,
        userId, // Added userId
        leadId,
        batchId,
        trainerId,
        campaignId,
        learnerId,
        mainTaskId,
      } = await req.json();
  
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }
  
      // Update the note
      await db
        .update(notes)
        .set({
          content,
          userId, // Added userId
          leadId,
          batchId,
          trainerId,
          campaignId,
          learnerId,
          mainTaskId,
        })
        .where(eq(notes.id, Number(id)));
  
      return NextResponse.json(
        { message: "Note updated successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  

// ✅ Delete Note by ID
export async function DELETE(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (!id) {
        return NextResponse.json(
          { error: "Note ID is required" },
          { status: 400 }
        );
      }
  
      // Delete the note by ID
      await db.delete(notes).where(eq(notes.id, Number(id)));
  
      return NextResponse.json(
        { message: "Note deleted successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  