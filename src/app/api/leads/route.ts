import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Adjust based on your Drizzle setup
import { leads } from "@/drizzle/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";
import { parse } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // New ID parameter
    const userId = searchParams.get("userId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const techStack = searchParams.get("techStack");
    const leadSource = searchParams.get("leadSource");
    const leadStage = searchParams.get("leadStage");
    const todayWalk = searchParams.get("todayWalk");

    let conditions = [];

    // If ID is provided, fetch only that specific lead
    if (id) {
      conditions.push(eq(leads.id, Number(id)));
    } else {
      // Apply filters only if ID is not provided
      if (userId) conditions.push(eq(leads.userId, userId));

      if (fromDate && toDate) {
        const parsedFromDate = parse(
          fromDate,
          "yyyy-MM-dd",
          new Date()
        ).toISOString();
        const parsedToDate = parse(
          toDate,
          "yyyy-MM-dd",
          new Date()
        ).toISOString();

        conditions.push(
          sql`${leads.createdAt} BETWEEN ${parsedFromDate} AND ${parsedToDate}`
        );
      }

      if (techStack) conditions.push(eq(leads.techStack, techStack));
      if (leadSource) conditions.push(eq(leads.leadSource, leadSource));
      if (leadStage) conditions.push(eq(leads.leadStage, leadStage));

      if (todayWalk === "todays_expected_walkins") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayISO = today.toISOString();
        const tomorrowISO = tomorrow.toISOString();

        conditions.push(
          sql`${leads.expectedWalkInDate} BETWEEN ${todayISO} AND ${tomorrowISO}`
        );
      }
    }

    const query = db
      .select()
      .from(leads)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(leads.createdAt));

    const result = await query;
    return NextResponse.json({ leads: id ? result?.[0] : result });
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Create a new Lead
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      name,
      email,
      phone,
      leadSource,
      userId,
      techStack,
      leadStage,
      countryCode,
    } = data;

    const newLead = await db
      .insert(leads)
      .values({
        name,
        email,
        phone,
        leadSource,
        userId,
        techStack,
        leadStage,
        countryCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: "Lead created successfully", data: newLead },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Update an existing lead
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Lead ID is required" },
        { status: 400 }
      );
    }

    let updateData = await req.json();
    updateData.updatedAt = new Date(); // Always update the timestamp

    // Define date fields that need conversion
    const dateFields = [
      "expRegistrationDate",
      "nextFollowUp",
      "demoAttendedDate",
      "visitedDate",
      "expectedWalkInDate",
    ];

    // Convert provided date fields to Date objects
    for (const field of dateFields) {
      if (updateData[field]) {
        updateData[field] = new Date(updateData[field]);
      }
    }

    // Update only the fields provided by the user
    const result = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Lead updated successfully",
      lead: result[0],
    });
  } catch (error: any) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Handle both single and multiple deletions in one API
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id: any = searchParams.get("id"); // Single ID
    const idsParam: any = searchParams.get("ids"); // Multiple IDs

    if (!id && !idsParam) {
      return NextResponse.json(
        { message: "Lead ID or IDs are required" },
        { status: 400 }
      );
    }

    let result: any;

    if (id) {
      // Delete a single lead
      result = await db
        .delete(leads)
        .where(eq(leads.id, Number(id)))
        .returning();
    } else if (idsParam) {
      // Delete multiple leads
      const ids = idsParam
        .split(",")
        .map(Number)
        .filter((id: any) => !isNaN(id));
      if (!ids.length) {
        return NextResponse.json(
          { message: "Invalid Lead IDs" },
          { status: 400 }
        );
      }

      result = await db.delete(leads).where(inArray(leads.id, ids)).returning();
    }

    if (!result.length) {
      return NextResponse.json(
        { message: "No matching leads found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: id ? "Lead deleted successfully" : "Leads deleted successfully",
      deletedIds: id ? [Number(id)] : idsParam.split(",").map(Number),
    });
  } catch (error: any) {
    console.error("Error deleting lead(s):", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
