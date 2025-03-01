import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities, meetings } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import sgMail from "@sendgrid/mail";
import axios from "axios";
import { generateZoomAccessToken } from "./utilities";
import { AnyARecord } from "dns";

sgMail.setApiKey(process.env.TWILIO_API_KEY as string);

// POST /api/meetings
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      hostId,
      participants,
      meetingName,
      location,
      startTime,
      endTime,
      userId,
      leadId,
      batchId,
      trainerId,
      campaignId,
      learnerId,
      mainTaskId,
    } = body;

    // ✅ Ensure startTime and endTime are valid Date objects
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
      return NextResponse.json(
        { message: "Invalid start or end time" },
        { status: 400 }
      );
    }

    const zoomAccessToken = await generateZoomAccessToken();

    const zoomMeeting = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: meetingName,
        type: 2,
        start_time: parsedStartTime.toISOString(), // ✅ Ensured valid Date
        duration: Math.floor(
          (parsedEndTime.getTime() - parsedStartTime.getTime()) / (1000 * 60)
        ), // ✅ Ensured proper calculation
        timezone: "UTC",
      },
      {
        headers: { Authorization: `Bearer ${zoomAccessToken}` },
      }
    );

    const zoomMeetingUrl = `https://zoom.us/j/${zoomMeeting.data.id}`;
    const html = `<p>You have been invited to a meeting.</p>
                    <p><strong>Meeting Name:</strong> ${meetingName}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Start Time:</strong> ${parsedStartTime.toISOString()}</p>
                    <p><strong>End Time:</strong> ${parsedEndTime.toISOString()}</p>
                    <p><strong>Zoom Meeting Link:</strong> <a href="${zoomMeetingUrl}">${zoomMeetingUrl}</a></p>`;

    await sgMail.send({
      // to: [...new Set([hostId, ...participants])],
      to: Array.from(new Set([hostId, ...participants])),
      from: "kdigital@yopmail.com",
      subject: `Meeting Invitation: ${meetingName}`,
      html: html,
    });

    const newMeeting = await db
      .insert(meetings)
      .values({
        hostId,
        participants,
        meetingName,
        location,
        zoomMeetingId: zoomMeeting.data.id,
        startTime: parsedStartTime, // ✅ Ensured valid Date
        endTime: parsedEndTime, // ✅ Ensured valid Date
        userId,
        leadId,
        batchId,
        trainerId,
        campaignId,
        learnerId,
        mainTaskId,
      })
      .returning();

          await db.insert(activities).values({
            activityName: "Meeting",
            meetingId: newMeeting[0].id,
            userId: userId || undefined, 
            leadId: leadId || undefined, 
            batchId: batchId || undefined, 
            trainerId: trainerId || undefined, 
            campaignId: campaignId || undefined, 
            learnerId: learnerId || undefined, 
            mainTaskId: mainTaskId || undefined, 
          });

    return NextResponse.json(
      { message: "Scheduled meeting successfully", meeting: newMeeting[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error scheduling meeting:", error);
    return NextResponse.json(
      { message: "Error scheduling meeting", error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/meetings
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Allowed filter keys
    const allowedFilters = [
      "batchId",
      "leadId",
      "trainerId",
      "campaignId",
      "learnerId",
      "mainTaskId",
    ] as const;

    const filters = [];

    for (const key of allowedFilters) {
      const value = searchParams.get(key);
      if (value) {
        filters.push(eq(meetings[key], parseInt(value, 10)));
      }
    }

    // If no filters, return all meetings
    const meetingsData = await db
      .select()
      .from(meetings)
      .where(filters.length > 0 ? and(...filters) : undefined);

    return NextResponse.json({ meetings: meetingsData }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { message: "Error fetching meetings", error: error.message },
      { status: 500 }
    );
  }
}
