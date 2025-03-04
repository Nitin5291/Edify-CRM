import { db } from "@/db";
import { mainTasks } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

// GET: Fetch a single task if "id" is provided; otherwise, fetch all tasks
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let conditions = [];

    if (id) {
      conditions.push(eq(mainTasks.id, Number(id)));
    }

    const query = db
      .select()
      .from(mainTasks)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(mainTasks.createdAt));

    const result = await query;
    return NextResponse.json({ data: id ? result?.[0] : result });
  } catch (error: any) {
    console.error("Error fetching main tasks:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new main task
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      taskOwner,
      assignTo,
      dueDate,
      subject,
      source,
      note,
      learnerId,
      batch,
      priority,
      status,
      reminder,
      taskType,
      description,
    } = data;

    const newTask = await db
      .insert(mainTasks)
      .values({
        taskOwner,
        assignTo,
        dueDate: dueDate ? new Date(dueDate) : null,
        subject,
        source,
        note,
        learnerId,
        batch,
        priority,
        status,
        reminder,
        taskType,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        message: "Main task created successfully",
        task: newTask?.[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating main task:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing main task using id from query parameters
export async function PUT(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (!id) {
        return NextResponse.json(
          { message: "Main task ID is required" },
          { status: 400 }
        );
      }
  
      let updateData = await req.json();
      updateData.updatedAt = new Date(); // Always update timestamp
  
      // Convert `dueDate` to Date object if it's a valid string
      if (updateData.dueDate) {
        const parsedDate = new Date(updateData.dueDate);
        if (!isNaN(parsedDate.getTime())) {
          updateData.dueDate = parsedDate;
        } else {
          return NextResponse.json(
            { message: "Invalid dueDate format. Expected ISO string format." },
            { status: 400 }
          );
        }
      }
  
      const result = await db
        .update(mainTasks)
        .set(updateData)
        .where(eq(mainTasks.id, Number(id)))
        .returning();
  
      if (!result.length) {
        return NextResponse.json(
          { message: "Main task not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        message: "Main task updated successfully",
        data: result[0],
      });
    } catch (error: any) {
      console.error("Error updating main task:", error);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }
  }  


// DELETE: Remove a main task using id from query parameters
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Main task ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(mainTasks)
      .where(eq(mainTasks.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Main task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Main task deleted successfully",
      deletedId: Number(id),
    });
  } catch (error: any) {
    console.error("Error deleting main task:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
