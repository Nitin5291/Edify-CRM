import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities, messageTemplate, messages } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { twilioClient } from "./twilio";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      phoneNumber,
      messageContent,
      leadId,
      userId,
      type,
      messageTemplateId,
      batchId,
      trainerId,
      campaignId,
    } = body;

    let finalMessageContent = messageContent;

    // Fetch message template if provided
    // if (messageTemplateId) {
    //   const template = await db.query.messageTemplate.findFirst({
    //     where: eq(messageTemplate.id, messageTemplateId),
    //   });
    //   if (!template) {
    //     return NextResponse.json({ message: "Message template not found" }, { status: 404 });
    //   }
    //   finalMessageContent = template.content;
    // }

    if (messageTemplateId) {
      const template = await db
        .select()
        .from(messageTemplate)
        .where(eq(messageTemplate.id, messageTemplateId))
        .limit(1);

      if (!template.length) {
        return NextResponse.json(
          { message: "Message template not found" },
          { status: 404 }
        );
      }

      finalMessageContent = template[0].content;
    }

    // Send message via Twilio
    let messageSid;
    if (type === "whatsapp") {
      const message = await twilioClient.messages.create({
        body: finalMessageContent,
        from: "whatsapp:+919515175554",
        to: `whatsapp:${phoneNumber}`,
      });
      messageSid = message.sid;
    } else {
      const message = await twilioClient.messages.create({
        body: finalMessageContent,
        from: "+14704866444",
        to: phoneNumber,
      });
      messageSid = message.sid;
    }

    // Save to database
    const newMessage = await db
      .insert(messages)
      .values({
        phoneNumber,
        messageId: messageSid,
        messageContent: finalMessageContent,
        leadId,
        batchId,
        trainerId,
        userId,
        type,
        messageTemplateId,
        campaignId,
      })
      .returning();

    await db.insert(activities).values({
      activityName: type === "whatsapp" ? "Whatsapp" : "Message",
      messageId: type === "text" ? newMessage[0].id : null,
      whatsappId: type === "whatsapp" ? newMessage[0].id : null,
      userId: userId || null,
      leadId: leadId || null,
      batchId: batchId || null,
      trainerId: trainerId || null,
      campaignId: campaignId || null,
    });

    return NextResponse.json(
      { message: "Message sent successfully", newMessage },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Error sending message", errorMessage: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const leadId = url.searchParams.get("leadId");
    const batchId = url.searchParams.get("batchId");
    const trainerId = url.searchParams.get("trainerId");
    const campaignId = url.searchParams.get("campaignId");
    const learnerId = url.searchParams.get("learnerId");
    const id = url.searchParams.get("id");

    const filterConditions = [];
    const typeValue = type as "whatsapp" | "text"; // Type assertion
    if (type && ["whatsapp", "text"].includes(typeValue)) {
      filterConditions.push(eq(messages.type, typeValue));
    }
    if (leadId) filterConditions.push(eq(messages.leadId, Number(leadId)));
    if (batchId) filterConditions.push(eq(messages.batchId, Number(batchId)));
    if (trainerId)
      filterConditions.push(eq(messages.trainerId, Number(trainerId)));
    if (campaignId)
      filterConditions.push(eq(messages.campaignId, Number(campaignId)));
    if (learnerId)
      filterConditions.push(eq(messages.learnerId, Number(learnerId)));
    if (id) filterConditions.push(eq(messages.id, Number(id)));

    // Using Drizzle ORM to fetch messages
    const allMessages = await db
      .select()
      .from(messages)
      .where(filterConditions.length ? and(...filterConditions) : undefined);

    return NextResponse.json({ messages: allMessages }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Error fetching messages", error: error.message },
      { status: 500 }
    );
  }
}
