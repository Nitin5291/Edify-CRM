import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainers } from "@/drizzle/schema";
import { eq, and, desc, gte, lte, inArray } from "drizzle-orm";
import { uploadFile, deleteFile } from "../utils/upload";
import { parseISO } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const formData: any = await req.formData();
    const trainerData: any = {};

    for (const entry of formData.entries()) {
      const [key, value] = entry;

      // Handle file uploads
      if (value?.constructor?.name === "File") {
        trainerData[key] = await uploadFile(value, `${key}s`);
      } else {
        trainerData[key] = value;
      }
    }

    // Convert joiningDate to Date object
    if (trainerData.joiningDate) {
      trainerData.joiningDate = new Date(trainerData.joiningDate);
    }

    // Insert trainer data into DB
    const [trainer] = await db.insert(trainers).values(trainerData).returning();

    return NextResponse.json(trainer, { status: 200 });
  } catch (error) {
    console.error("Error creating trainer:", error);
    return NextResponse.json(
      { message: "Error creating trainer" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id: any = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Trainer ID is required" },
        { status: 400 }
      );
    }

    // Fetch existing trainer data
    const existingTrainer = await db
      .select()
      .from(trainers)
      .where(eq(trainers.id, id))
      .limit(1);

    if (!existingTrainer.length) {
      return NextResponse.json(
        { message: "Trainer not found" },
        { status: 404 }
      );
    }

    const formData: any = await req.formData();
    const trainerData: any = {};

    for (const entry of formData.entries()) {
      const [key, value] = entry;
      // Check if updating the "idProof" field (which stores an image URL)
      if (key === "idProof" && value?.constructor?.name === "File") {
        const existingIdProofUrl = existingTrainer[0].idProof;

        // ✅ Delete old image from Supabase before uploading the new one
        if (existingIdProofUrl) {
          await deleteFile(existingIdProofUrl);
        }

        // Upload new image and store the URL
        trainerData.idProof = await uploadFile(value, "idProofs");
      } else {
        trainerData[key] = value;
      }
    }

    // Convert date fields to Date objects
    if (trainerData.dateOfBirth)
      trainerData.dateOfBirth = new Date(trainerData.dateOfBirth);
    if (trainerData.joiningDate)
      trainerData.joiningDate = new Date(trainerData.joiningDate);

    // Update trainer details in the database
    await db.update(trainers).set(trainerData).where(eq(trainers.id, id));

    // Fetch the updated trainer data
    const updatedTrainer = await db
      .select()
      .from(trainers)
      .where(eq(trainers.id, id))
      .limit(1);

    return NextResponse.json({
      message: "Trainer updated successfully",
      updatedTrainer: updatedTrainer[0],
    });
  } catch (error) {
    console.error("Error updating trainer:", error);
    return NextResponse.json(
      { message: "Error updating trainer", error: error },
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
        { message: "Trainer IDs are required" },
        { status: 400 }
      );
    }

    // Convert comma-separated string into an array of numbers
    const ids = idString.split(",").map((id) => Number(id.trim()));

    if (ids.some(isNaN)) {
      return NextResponse.json(
        { message: "Invalid Trainer IDs format" },
        { status: 400 }
      );
    }

    // Fetch existing trainers to get their idProof URLs before deletion
    const existingTrainers = await db
      .select()
      .from(trainers)
      .where(inArray(trainers.id, ids));

    if (existingTrainers.length === 0) {
      return NextResponse.json(
        { message: "No trainers found for the given IDs" },
        { status: 404 }
      );
    }
    // Extract image URLs
    const imageUrls = existingTrainers
      .map((trainer) => trainer.idProof)
      .filter((url) => url); // Remove null or empty values

    // Delete trainers from the database
    await db.delete(trainers).where(inArray(trainers.id, ids));

    // Delete associated images from Supabase Storage
    const deletePromises = imageUrls.map((url: any) => deleteFile(url));
    await Promise.all(deletePromises);

    return NextResponse.json({
      message: "Trainers and their images deleted successfully",
      deletedIds: ids,
    });
  } catch (error: any) {
    console.error("Error deleting trainers:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId: any = searchParams.get("userId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    let conditions = [];

    // Filter by ID
    if (id) {
      conditions.push(eq(trainers.id, Number(id)));
    } else {
      // Apply additional filters only if no specific ID is provided
      if (userId) conditions.push(eq(trainers.userId, userId));

      if (fromDate && toDate) {
        const parsedFromDate = parseISO(fromDate);
        const parsedToDate = parseISO(toDate);

        conditions.push(
          and(
            gte(trainers.createdAt, parsedFromDate),
            lte(trainers.createdAt, parsedToDate)
          )
        );
      }
    }

    // Fetch trainers based on filters
    const query = db
      .select()
      .from(trainers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(trainers.createdAt));

    const result = await query;

    return NextResponse.json({ data: id ? result?.[0] : result });
  } catch (error: any) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
