import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { db, supabase } from "@/db";
import {
  emails,
  activities,
  emailTemplates,
  leads,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

sgMail.setApiKey(process.env.TWILIO_API_KEY as string);

// Send email API route
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      to,
      bcc,
      from,
      emailTemplateId,
      userId,
      leadId,
      batchId,
      subject,
      htmlContent,
      trainerId,
      campaignId,
      learnerId,
      mainTaskId,
    } = body;

    if (!to || !from || !userId) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    // Fetch user data using Drizzle query
    const { data } = await supabase.auth.admin.getUserById(userId);
    if (!data) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let processedTemplate = htmlContent;
    let processedSubject = subject;

    if (emailTemplateId) {
      // Fetch email template using Drizzle query
      const [emailTemplate]: any = await db
        .select()
        .from(emailTemplates)
        .where(eq(emailTemplates.id, emailTemplateId));
      if (!emailTemplate) {
        return NextResponse.json(
          { message: "Email template not found" },
          { status: 404 }
        );
      }

      if (leadId) {
        const [lead] = await db
          .select()
          .from(leads)
          .where(eq(leads.id, leadId));
        if (!lead) {
          return NextResponse.json(
            { message: "Lead not found" },
            { status: 404 }
          );
        }

        processedTemplate = replacePlaceholders(
          emailTemplate.htmlContent,
          lead,
          data?.user
        );
        processedSubject = replacePlaceholders(
          emailTemplate.subject,
          lead,
          data?.user
        );
      } else {
        processedTemplate = emailTemplate.htmlContent;
        processedSubject = emailTemplate.subject;
      }
    }

    if (!processedTemplate || !processedSubject) {
      return NextResponse.json(
        { message: "Processed template or subject is missing" },
        { status: 400 }
      );
    }

    // Send email using SendGrid
    await sgMail.send({
      to: Array.isArray(to) ? to : [to], // Ensure to is an array
      bcc,
      from: "kdigital@yopmail.com",
      subject: processedSubject,
      html: processedTemplate,
    });

    // Insert email record into database using Drizzle
    const [newEmail] = await db
      .insert(emails)
      .values({
        to,
        bcc,
        from: "kdigital@yopmail.com",
        subject: emailTemplateId ? null : processedSubject,
        body: emailTemplateId ? null : processedTemplate,
        emailTemplateId: emailTemplateId ? emailTemplateId : null,
        userId,
        leadId: leadId || undefined,
        batchId: batchId || undefined,
        trainerId: trainerId || undefined,
        campaignId: campaignId || undefined,
        learnerId: learnerId || undefined,
        mainTaskId: mainTaskId || undefined,
      })
      .returning();

    // Insert activity record into database using Drizzle
    await db.insert(activities).values({
      activityName: "Email",
      emailId: newEmail.id,
      userId: userId || undefined,
      leadId: leadId || undefined,
      batchId: batchId || undefined,
      trainerId: trainerId || undefined,
      campaignId: campaignId || undefined,
      learnerId: learnerId || undefined,
      mainTaskId: mainTaskId || undefined,
    });

    return NextResponse.json(
      { message: "Email sent successfully", email: newEmail },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
}

// Function to replace placeholders
function replacePlaceholders(template: string, lead: any, user: any): string {
  return template
    .replace("{leadName}", lead.name || "")
    .replace("{userEmail}", user.email || "");
}

// Get all emails API route
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const batchId = url.searchParams.get("batchId");
    const leadId = url.searchParams.get("leadId");
    const trainerId = url.searchParams.get("trainerId");
    const campaignId = url.searchParams.get("campaignId");
    const learnerId = url.searchParams.get("learnerId");
    const mainTaskId = url.searchParams.get("mainTaskId");
    const id = url.searchParams.get("id");

    // Build the filter conditions dynamically
    const conditions: any[] = []; // Declare the conditions array before using it
    if (batchId) conditions.push(eq(emails.batchId, Number(batchId)));
    if (leadId) conditions.push(eq(emails.leadId, Number(leadId)));
    if (trainerId) conditions.push(eq(emails.trainerId, Number(trainerId)));
    if (campaignId) conditions.push(eq(emails.campaignId, Number(campaignId)));
    if (learnerId) conditions.push(eq(emails.learnerId, Number(learnerId)));
    if (mainTaskId) conditions.push(eq(emails.mainTaskId, Number(mainTaskId)));
    if (id) conditions.push(eq(emails.id, Number(id)));

    // Fetch emails with filters applied
    const fetchedEmails = await db
      .select({
        id: emails.id,
        to: emails.to,
        from: emails.from,
        bcc: emails.bcc,
        subject: emails.subject,
        body: emails.body,
        batchId: emails.batchId,
        lead: {
          id: leads.id,
          name: leads.name,
          techStack: leads.techStack,
          phone: leads.phone,
          email: leads.email,
        },
        emailTemplate: {
          id: emailTemplates.id,
          subject: emailTemplates.subject,
          htmlContent: emailTemplates.htmlContent,
        },
      })
      .from(emails)
      .leftJoin(leads, eq(emails.leadId, leads.id))
      .leftJoin(emailTemplates, eq(emails.emailTemplateId, emailTemplates.id))
      .where(and(...conditions));

    return NextResponse.json({ emails: fetchedEmails }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving emails:", error);
    return NextResponse.json(
      { message: "Error retrieving emails", error: error.message },
      { status: 500 }
    );
  }
}
