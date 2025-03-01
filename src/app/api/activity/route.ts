import { db , supabase} from "@/db";
import {
  activities,
  meetings,
  emails,
  messages,
  emailTemplates,
  tasks,
} from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";// Ensure Supabase client is initialized

// Define allowed filter keys and their corresponding columns
const filterColumnMap: Record<string, any> = {
  leadId: activities.leadId,
  batchId: activities.batchId,
  trainerId: activities.trainerId,
  campaignId: activities.campaignId,
  learnerId: activities.learnerId,
  mainTaskId: activities.mainTaskId,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const filterKeys = [
      "leadId",
      "batchId",
      "trainerId",
      "campaignId",
      "learnerId",
      "mainTaskId",
    ];
    const filterKey: any = Object.keys(body).find((key) =>
      filterKeys.includes(key)
    );
    const filterValue: any = filterKey ? body[filterKey] : null;

    if (!filterKey || !filterValue) {
      return NextResponse.json(
        { message: "Please provide a valid filter key and value.", data: [] },
        { status: 400 }
      );
    }

    // Fetch activities based on filter key
    const matchedActivities = await db
      .select()
      .from(activities)
      .where(eq(filterColumnMap[filterKey], filterValue))
      .orderBy(desc(activities.createdAt));

    if (!matchedActivities.length) {
      return NextResponse.json(
        {
          message: `No activities found for ${filterKey} = ${filterValue}`,
          data: [],
        },
        { status: 200 }
      );
    }

    // Fetch related Task, Meeting, Email, and Message data
    const activitiesWithDetails = await Promise.all(
      matchedActivities.map(async (activity) => {
        let data = null;

        if (activity.newTaskId) {
          const task = await db
            .select()
            .from(tasks)
            .where(eq(tasks.id, activity.newTaskId))
            .limit(1);

          if (task.length && task[0].userId) {
            const { data: user, error } = await supabase.auth.admin.getUserById(
              task[0].userId
            );
            if (error) {
              console.error("Error fetching user from Supabase:", error);
            }
            const userMetadata = user?.user?.user_metadata || null; // Extract only user_metadata
            data = { ...task[0], user: userMetadata };
          } else {
            data = task.length ? task[0] : null;
          }
        } else if (activity.meetingId) {
          const meeting = await db
            .select()
            .from(meetings)
            .where(eq(meetings.id, activity.meetingId))
            .limit(1);

          if (meeting.length && meeting[0].hostId) {
            const { data: host, error } = await supabase.auth.admin.getUserById(
              meeting[0].hostId
            );
            if (error) {
              console.error("Error fetching host from Supabase:", error);
            }
            const hostMetadata = host?.user?.user_metadata || null; // Extract only user_metadata
            data = { ...meeting[0], host: hostMetadata };
          } else {
            data = meeting.length ? meeting[0] : null;
          }
        } else if (activity.emailId) {
          const email = await db
            .select()
            .from(emails)
            .where(eq(emails.id, activity.emailId))
            .limit(1);

          if (email.length && email[0].emailTemplateId) {
            const emailTemplate = await db
              .select()
              .from(emailTemplates)
              .where(eq(emailTemplates.id, email[0].emailTemplateId))
              .limit(1);
            data = {
              ...email[0],
              emailTemplate: emailTemplate.length ? emailTemplate[0] : null,
            };
          } else {
            data = email.length ? email[0] : null;
          }
        } else if (activity.messageId) {
          const message = await db
            .select()
            .from(messages)
            .where(eq(messages.id, activity.messageId))
            .limit(1);
          data = message.length ? message[0] : null;
        }else if (activity.whatsappId) {
          const message = await db
            .select()
            .from(messages)
            .where(eq(messages.id, activity.whatsappId))
            .limit(1);
          data = message.length ? message[0] : null;
        }

        return { ...activity, data };
      })
    );

    return NextResponse.json(
      {
        message: "Activity data retrieved successfully",
        data: activitiesWithDetails,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
