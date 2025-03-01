import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Adjust based on your Drizzle setup
import { emailTemplates } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

// GET: Fetch a single email template if an "id" is provided; otherwise, fetch all in descending order of creation.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let conditions = [];

    if (id) {
      conditions.push(eq(emailTemplates.id, Number(id)));
    }

    const query = db
      .select()
      .from(emailTemplates)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(emailTemplates.createdAt));

    const result = await query;
    return NextResponse.json({ data : id ? result?.[0] : result });
  } catch (error: any) {
    console.error("Error fetching email templates:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new email template
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, subject, htmlContent, userId } = data;

    const newTemplate = await db
      .insert(emailTemplates)
      .values({
        name,
        subject,
        htmlContent,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: "Email template created successfully", data: newTemplate },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating email template:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing email template using id from query parameters
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Email template ID is required" },
        { status: 400 }
      );
    }

    let updateData = await req.json();
    updateData.updatedAt = new Date(); // Always update the timestamp

    const result = await db
      .update(emailTemplates)
      .set(updateData)
      .where(eq(emailTemplates.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Email template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Email template updated successfully",
      emailTemplate: result[0],
    });
  } catch (error: any) {
    console.error("Error updating email template:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove an email template using id from query parameters
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Email template ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Email template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Email template deleted successfully",
      deletedId: Number(id),
    });
  } catch (error: any) {
    console.error("Error deleting email template:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
