import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Adjust based on your Drizzle setup
import { campaigns } from "@/drizzle/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

// Create a new campaign (POST)
export async function POST(req: NextRequest) {
  try {
    const {
      name,
      status,
      type,
      campaignDate,
      endDate,
      campaignOwner,
      phone,
      courseId,
      active,
      amountSpent,
      description,
      userId,
    } = await req.json();

    const newCampaign = await db
      .insert(campaigns)
      .values({
        name,
        status,
        type,
        campaignDate: campaignDate ? new Date(campaignDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        campaignOwner,
        phone,
        courseId,
        active,
        amountSpent,
        userId,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: "Campaign created successfully", campaign: newCampaign },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Fetch campaigns (GET)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const campaignOwner = searchParams.get("campaignOwner");
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    const conditions = [];
    if (status) conditions.push(eq(campaigns.status, status));
    if (campaignOwner)
      conditions.push(eq(campaigns.campaignOwner, campaignOwner));
    if (courseId) conditions.push(eq(campaigns.courseId, courseId));
    if (userId) conditions.push(eq(campaigns.userId, userId));
    if (id) conditions.push(eq(campaigns.id, Number(id)));

    const result = await db
      .select()
      .from(campaigns)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(campaigns.createdAt));

    return NextResponse.json({ campaigns: result });
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Partially update a campaign (PATCH)
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const updateData = await req.json();

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    if (updateData.campaign_date)
      updateData.campaign_date = new Date(updateData.campaign_date);
    if (updateData.end_date)
      updateData.end_date = new Date(updateData.end_date);

    updateData.updated_at = new Date();

    const result = await db
      .update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Campaign updated successfully", campaign: result[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Fully update a campaign (PUT)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const updateData = await req.json();

    if (!updateData.name || !updateData.status || !updateData.type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    updateData.campaignDate = updateData.campaignDate
      ? new Date(updateData.campaignDate)
      : null;
    updateData.endDate = updateData.endDate
      ? new Date(updateData.endDate)
      : null;
    updateData.updatedAt = new Date();

    const result = await db
      .update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Campaign updated successfully", campaign: result[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Delete multiple campaigns (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("ids");

    if (!idParam) {
      return NextResponse.json(
        { message: "Campaign IDs are required" },
        { status: 400 }
      );
    }

    const ids = idParam
      .split(",")
      .map(Number)
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid Campaign IDs" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(campaigns)
      .where(inArray(campaigns.id, ids))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { message: "No matching campaigns found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Campaigns deleted successfully", deletedIds: ids },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting campaigns:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
