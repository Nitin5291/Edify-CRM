import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { learners, learnersBatches } from "@/drizzle/schema";
import { eq, and, desc, gte, lte, inArray } from "drizzle-orm";
import { uploadFile, deleteFile } from "./../utils/upload";
import { parseISO } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const formData: any = await req.json();

    const learnerData: any = formData;

    // Convert date fields to Date objects
    if (learnerData.dateOfBirth)
      learnerData.dateOfBirth = new Date(learnerData.dateOfBirth);
    if (learnerData.registeredDate)
      learnerData.registeredDate = new Date(learnerData.registeredDate);
    if (learnerData.dueDate)
      learnerData.dueDate = new Date(learnerData.dueDate);

    // Insert learner data
    const [learner] = await db.insert(learners).values(learnerData).returning();

    return NextResponse.json(learner, { status: 201 });
  } catch (error) {
    console.error("Error creating learner:", error);
    return NextResponse.json(
      { message: "Error creating learner" },
      { status: 500 }
    );
  }
}

// export async function PUT(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { message: "Learner ID is required" },
//         { status: 400 }
//       );
//     }

//     const learnerId = Number(id);

//     // Check if learner exists
//     const existingLearner: any = await db
//       .select()
//       .from(learners)
//       .where(eq(learners.id, learnerId))
//       .limit(1);

//     if (!existingLearner.length) {
//       return NextResponse.json(
//         { message: "Learner not found" },
//         { status: 404 }
//       );
//     }

//     const formData: any = await req.formData();
//     const learnerData: any = {};
//     const deleteImagePromises: Promise<void>[] = [];

//     for (const entry of formData.entries()) {
//       const [key, value] = entry;

//       if (value?.constructor?.name === "File") {
//         // New file uploaded, delete the old one first
//         if (["idProof", "instalment1Screenshot"].includes(key)) {
//           const oldImageUrl: any = existingLearner[0][key];
//           if (oldImageUrl) {
//             deleteImagePromises.push(
//               deleteFile(oldImageUrl)
//                 .then(() => {})
//                 .catch((error) =>
//                   console.error(
//                     `Error deleting old image ${oldImageUrl}:`,
//                     error
//                   )
//                 )
//             );
//           }
//         }

//         // Upload new file
//         const uploadedFile = await uploadFile(value, `${key}s`);
//         if (uploadedFile) learnerData[key] = uploadedFile; // Store new image URL
//       } else {
//         learnerData[key] = value;
//       }
//     }

//     // Convert date fields to Date objects
//     if (learnerData.dateOfBirth)
//       learnerData.dateOfBirth = new Date(learnerData.dateOfBirth);
//     if (learnerData.registeredDate)
//       learnerData.registeredDate = new Date(learnerData.registeredDate);
//     if (learnerData.dueDate)
//       learnerData.dueDate = new Date(learnerData.dueDate);

//     // Update learner details in DB
//     await db
//       .update(learners)
//       .set(learnerData)
//       .where(eq(learners.id, learnerId));

//     // Handle batch associations
//     if (formData.has("batchIds")) {
//       const batchIds = JSON.parse((formData.get("batchIds") as string) || "[]");
//       await db
//         .delete(learnersBatches)
//         .where(eq(learnersBatches.learnerId, learnerId));

//       if (batchIds.length > 0) {
//         const newBatchAssociations = batchIds.map((batchId: any) => ({
//           learnerId,
//           batchId,
//         }));
//         await db.insert(learnersBatches).values(newBatchAssociations);
//       }
//     }

//     // Delete old images asynchronously after DB update
//     await Promise.all(deleteImagePromises);

//     // Fetch updated learner data
//     const updatedLearner = await db
//       .select()
//       .from(learners)
//       .where(eq(learners.id, learnerId))
//       .limit(1);

//     return NextResponse.json({
//       message: "Learner updated successfully",
//       updatedLearner: updatedLearner[0],
//     });
//   } catch (error) {
//     console.error("Error updating learner:", error);
//     return NextResponse.json(
//       { message: "Error updating learner", error: error },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(req: NextRequest) {
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

    // Check if learner exists
    const existingLearner: any = await db
      .select()
      .from(learners)
      .where(eq(learners.id, learnerId))
      .limit(1);

    if (!existingLearner.length) {
      return NextResponse.json(
        { message: "Learner not found" },
        { status: 404 }
      );
    }

    const formData: any = await req.formData();
    const learnerData: any = {};
    const deleteImagePromises: Promise<void>[] = [];

    for (const entry of formData.entries()) {
      const [key, value] = entry;

      if (value?.constructor?.name === "File") {
        // New file uploaded, delete the old one first
        if (["idProof", "instalment1Screenshot"].includes(key)) {
          const oldImageUrl: any = existingLearner[0][key];
          if (oldImageUrl) {
            deleteImagePromises.push(
              deleteFile(oldImageUrl)
                .then(() => {})
                .catch((error) =>
                  console.error(
                    `Error deleting old image ${oldImageUrl}:`,
                    error
                  )
                )
            );
          }
        }

        // Upload new file
        const uploadedFile = await uploadFile(value, `${key}s`);
        if (uploadedFile) learnerData[key] = uploadedFile; // Store new image URL
      } else {
        // Convert date fields properly
        if (["dateOfBirth", "registeredDate", "dueDate"].includes(key)) {
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime())) {
            learnerData[key] = dateValue; // Save valid date
          }
        } else {
          learnerData[key] = value;
        }
      }
    }

    if (Object.keys(learnerData).length === 0) {
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Update learner details in DB
    await db
      .update(learners)
      .set(learnerData)
      .where(eq(learners.id, learnerId));

    // Handle batch associations
    if (formData.has("batchIds")) {
      const batchIds = JSON.parse((formData.get("batchIds") as string) || "[]");
      await db
        .delete(learnersBatches)
        .where(eq(learnersBatches.learnerId, learnerId));

      if (batchIds.length > 0) {
        const newBatchAssociations = batchIds.map((batchId: any) => ({
          learnerId,
          batchId,
        }));
        await db.insert(learnersBatches).values(newBatchAssociations);
      }
    }

    // Delete old images asynchronously after DB update
    await Promise.all(deleteImagePromises);

    // Fetch updated learner data
    const updatedLearner = await db
      .select()
      .from(learners)
      .where(eq(learners.id, learnerId))
      .limit(1);

    return NextResponse.json({
      message: "Learner updated successfully",
      updatedLearner: updatedLearner[0],
    });
  } catch (error) {
    console.error("Error updating learner:", error);
    return NextResponse.json(
      { message: "Error updating learner", error: error },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { message: "Learner IDs are required" },
        { status: 400 }
      );
    }

    // Parse IDs from query parameter and filter out invalid values
    const ids = idsParam
      .split(",")
      .map(Number)
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json(
        { message: "No valid learner IDs provided" },
        { status: 400 }
      );
    }

    // Fetch existing learners before deleting
    const existingLearners = await db
      .select()
      .from(learners)
      .where(inArray(learners.id, ids));

    if (existingLearners.length === 0) {
      return NextResponse.json(
        { message: "No learners found with the provided IDs" },
        { status: 404 }
      );
    }

    // Collect image URLs to delete
    const imagesToDelete = existingLearners
      .flatMap((learner) => [learner.instalment1Screenshot, learner.idProof])
      .filter((url) => url); // Remove null or undefined URLs

    // Delete learners from the database
    await db.delete(learners).where(inArray(learners.id, ids));

    // Delete associated images from storage
    const deletePromises = imagesToDelete.map((url : any) => deleteFile(url));
    await Promise.all(deletePromises);

    return NextResponse.json({
      message: "Learners and associated images deleted successfully",
      deletedIds: ids,
    });
  } catch (error: any) {
    console.error("Error deleting learners:", error);
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

    // **Fix: Properly format batchId before sending response**
    const formattedResult = result.map((learner) => ({
      ...learner,
      batchId: learner.batchId ? learner.batchId.replace(/^"|"$/g, "") : null, // Remove surrounding quotes
    }));

    return NextResponse.json({
      learners: id ? formattedResult?.[0] : formattedResult,
    });
  } catch (error: any) {
    console.error("Error fetching learners:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

