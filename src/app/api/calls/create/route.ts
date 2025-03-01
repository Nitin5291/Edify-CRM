import { db } from "@/db";
import { calls } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// POST: Create a new Call entry
export async function POST(req: NextRequest) {
  try {
    const {
      callerid,
      to,
      status,
      user,
      user_no,
      time,
      direction,
      answeredsec,
      record,
      filename,
    } = await req.json();

    if (!callerid) {
        return NextResponse.json(
          { message: "callerId is required" },
          { status: 400 }
        );
      }

    // Insert data using Drizzle ORM
    await db.insert(calls).values({
      callerId: callerid,
      to: to,
      status,
      agentId: user,
      userNo: user_no,
      time,
      direction,
      answeredSeconds: answeredsec,
      isRecorded: record,
      filename,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Triggering the Python API
    const pythonApiUrl =
      "https://api.dev.ai.crm.skillcapital.ai/process-phone-number"; // Replace with your Python API URL
    const response = await axios.post(pythonApiUrl, {
      phone: to.toString(),
    });

    console.log("Python API Response:", response.data); 

    return NextResponse.json(
      { message: "Call details saved successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending call details:", error);
    return NextResponse.json(
      { message: "Error sending call details.", error: error.message },
      { status: 500 }
    );
  }
}
