import { NextRequest, NextResponse } from "next/server";
import { db, supabase } from "@/db";
import { activities, batches, learners, tasks } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";


export async function GET(req : NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const batchId = searchParams.get("batchId");
    const userId = searchParams.get("userId");
    const trainerId = searchParams.get("trainerId");
    const campaignId = searchParams.get("campaignId");
    const learnerId = searchParams.get("learnerId");
    const mainTaskId = searchParams.get("mainTaskId");
    const id = searchParams.get("id");

    let userData = [];
    if (userId) {
      const { data, error } = await supabase.auth.admin.getUserById(userId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      userData = data?.user ? [data.user] : [];
    } else {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      userData = data?.users || [];
    }

    const userMap = new Map(userData.map(user => [user.id, user.user_metadata]));

    const conditions = [];
    if (leadId) conditions.push(eq(tasks.leadId, Number(leadId)));
    if (batchId) conditions.push(eq(tasks.batchId, Number(batchId)));
    if (userId) conditions.push(eq(tasks.userId, userId)); // Keep as string
    if (trainerId) conditions.push(eq(tasks.trainerId, Number(trainerId)));
    if (campaignId) conditions.push(eq(tasks.campaignId, Number(campaignId)));
    if (learnerId) conditions.push(eq(tasks.learnerId, Number(learnerId)));
    if (mainTaskId) conditions.push(eq(tasks.mainTaskId, Number(mainTaskId)));
    if (id) conditions.push(eq(tasks.id, Number(id)));

    let query = db
      .select({
        id: tasks.id,
        subject: tasks.subject,
        dueDate: tasks.dueDate,
        priority: tasks.priority,
        leadId: tasks.leadId,
        batchId: tasks.batchId,
        trainerId: tasks.trainerId,
        campaignId: tasks.campaignId,
        learnerId: tasks.learnerId,
        mainTaskId: tasks.mainTaskId,
        userId: tasks.userId,
        ...(batchId && { batch: { id: batches.id, batchName: batches.batchName } }),
        ...(learnerId && { learner: { id: learners.id, name: learners.name } }),
      })
      .from(tasks)
      .leftJoin(batches, eq(tasks.batchId, batches.id))
      .leftJoin(learners, eq(tasks.learnerId, learners.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const allTasks = await query;

    const tasksWithUsers = allTasks.map((task : any) => ({
      ...task,
      user: userMap.get(task.userId) || null,
    }));

    return NextResponse.json(
      {
        tasks: tasksWithUsers,
        learner: learnerId ? tasksWithUsers.find(t => t.learner) || null : null,
        batch: batchId ? tasksWithUsers.find(t => t.batch) || null : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks", details: error },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let {
      subject,
      dueDate,
      priority,
      userId,
      leadId,
      batchId,
      trainerId,
      campaignId,
      learnerId,
      mainTaskId,
    } = body;

    if (!subject || !dueDate || !priority || !userId) {
      return NextResponse.json(
        { error: "Subject, Due Date, Priority, and User ID are required" },
        { status: 400 }
      );
    }

    // Convert dueDate to a proper Date object if it's not in ISO format
    dueDate = new Date(dueDate);

    if (isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid dueDate format" },
        { status: 400 }
      );
    }

    const newTask = await db
      .insert(tasks)
      .values({
        subject,
        dueDate,
        priority,
        userId,
        leadId,
        batchId,
        trainerId,
        campaignId,
        learnerId,
        mainTaskId,
      })
      .returning();

          // Insert activity record into database using Drizzle
          await db.insert(activities).values({
            activityName: "Task",
            newTaskId: newTask[0]?.id,
            userId: userId || null,
            leadId: leadId || null,
            batchId: batchId || null,
            trainerId: trainerId || null,
            campaignId: campaignId || null,
            learnerId: learnerId || null,
            mainTaskId: mainTaskId || null,
          });
      

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Extract task ID from URL params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );

    // Parse request body
    const body = await req.json();
    const {
      subject,
      dueDate,
      priority,
      leadId,
      batchId,
      trainerId,
      campaignId,
      learnerId,
      mainTaskId,
    } = body;

    // Ensure dueDate is a valid Date object
    const updatedTask = await db
      .update(tasks)
      .set({
        subject,
        dueDate: dueDate ? new Date(dueDate) : undefined, // Convert dueDate to valid timestamp
        priority,
        leadId,
        batchId,
        trainerId,
        campaignId,
        learnerId,
        mainTaskId,
        updatedAt: new Date(), // Ensure updatedAt is always set
      })
      .where(eq(tasks.id, Number(id)))
      .returning();

    // If no rows were updated, return an error
    if (!updatedTask.length) {
      return NextResponse.json(
        { error: "Task not found or no changes applied" },
        { status: 404 }
      );
    }

    // Success: return updated task
    return NextResponse.json(updatedTask[0] , { status: 200 });
  } catch (error) {
    console.error("Update Error:", error); // Log the actual error
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Check if task exists before deletion
    const existingTask = await db.select().from(tasks).where(eq(tasks.id, Number(id)));

    if (!existingTask.length) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Proceed with deletion
    await db.delete(tasks).where(eq(tasks.id, Number(id)));

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
