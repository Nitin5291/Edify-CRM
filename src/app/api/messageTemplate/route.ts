import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Adjust based on your Drizzle setup
import { messageTemplate } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

// GET: Fetch a single notification template if an "id" is provided; otherwise, fetch all in descending order of creation.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let conditions = [];

    if (id) {
      conditions.push(eq(messageTemplate.id, Number(id)));
    }

    const query = db
      .select()
      .from(messageTemplate)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(messageTemplate.createdAt));

    const result = await query;
    return NextResponse.json({ data: id ? result?.[0] : result });
  } catch (error: any) {
    console.error("Error fetching notification templates:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new notification template
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, type, content, userId } = data;

    if (!name || !type || !content || !userId) {
      return NextResponse.json(
        { content: "All fields are required" },
        { status: 400 }
      );
    }

    const newTemplate = await db
      .insert(messageTemplate)
      .values({
        name,
        type,
        content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        message: "Notification template created successfully",
        template: newTemplate?.[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating notification template:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing notification template using id from query parameters
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Notification template ID is required" },
        { status: 400 }
      );
    }

    let updateData = await req.json();
    updateData.updatedAt = new Date(); // Always update the timestamp

    const result = await db
      .update(messageTemplate)
      .set(updateData)
      .where(eq(messageTemplate.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Notification template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notification template updated successfully",
      data: result[0],
    });
  } catch (error: any) {
    console.error("Error updating notification template:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove a notification template using id from query parameters
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Notification template ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(messageTemplate)
      .where(eq(messageTemplate.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Notification template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notification template deleted successfully",
      deletedId: Number(id),
    });
  } catch (error: any) {
    console.error("Error deleting notification template:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
