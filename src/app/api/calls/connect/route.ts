import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// POST: Initiate a call connection
export async function POST(req: NextRequest) {
  try {
    const { agentId, token, to } = await req.json();

    const { data } = await axios.post(
      "https://piopiy.telecmi.com/v1/adminConnect",
      {
        agent_id: agentId,
        token: "2f7c9d96-bb83-4ff6-b5cd-cc49a3dcf08a", // Hardcoded token (can be updated to use env variables)
        to,
        custom: "Custom Parameter",
      }
    );

    if (data.code === 401) {
      return NextResponse.json(
        { message: "Failed to initiate call." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Call initiated successfully.", data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error initiating call:", error);
    return NextResponse.json(
      { message: "Error initiating call.", error: error.message },
      { status: 500 }
    );
  }
}
