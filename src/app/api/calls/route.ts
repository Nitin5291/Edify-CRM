import { db } from "@/db";
import { calls } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
      const [newCall] = await db.insert(calls).values(body).returning(); 
  
      return NextResponse.json(newCall, { status: 201 });
    } catch (error: any) {
      console.error("Error creating call:", error);
      return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
  }

  // PUT: Update an existing Call entry with full request body
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id : any = searchParams.get("id");

    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Call ID is required for update" },
        { status: 400 }
      );
    }

    const [updatedCall] = await db
      .update(calls)
      .set(body) // ✅ Directly using the request body
      .where(eq(calls.id, id))
      .returning();

    if (!updatedCall) {
      return NextResponse.json(
        { message: "Call not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCall, { status: 200 });
  } catch (error: any) {
    console.error("Error updating call:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNo = searchParams.get("phoneNo");
    const status = searchParams.get("status");
    const id : any = searchParams.get("id");

    let whereClause = [];

    if (phoneNo) {
      whereClause.push(eq(calls.to, phoneNo));
    }
    if (status) {
      whereClause.push(eq(calls.status, status));
    }
    if (id) {
      whereClause.push(eq(calls.id, id));
    }

    const result = await db.select().from(calls).where(and(...whereClause));

    return NextResponse.json({ calls: result }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { message: "Error fetching calls.", error: error.message },
      { status: 500 }
    );
  }
}