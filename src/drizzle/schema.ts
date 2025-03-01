import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  jsonb,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users Table
// export const users = pgTable("users", {
//   id: serial("id"),
//   name: text("name").unique().notNull(),
//   mobile: text("mobile").unique(),
//   email: text("email").unique().notNull(),
//   password: text("password").notNull(), // Store hashed passwords
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

// Campaigns Table
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  status: varchar("status", { length: 255 }).notNull().default("upcoming"),
  type: varchar("type", { length: 255 }),
  campaignDate: timestamp("campaign_date", { precision: 6 }),
  endDate: timestamp("end_date", { precision: 6 }),
  campaignOwner: varchar("campaign_owner", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  courseId: varchar("course_id", { length: 255 }),
  active: varchar("active", { length: 255 }),
  amountSpent: integer("amount_spent"),
  description: text("description"),
  userId: varchar("user_id", { length: 255 }),
  createdAt: timestamp("created_at", { precision: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", { precision: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Define the Lead table
export const leads = pgTable("leads", {
  id: integer("id"),
  name: varchar("name", { length: 255 }).notNull(),
  expRegistrationDate: timestamp("exp_registration_date"),
  email: varchar("email", { length: 255 }),
  nextFollowUp: timestamp("next_follow_up"),
  countryCode: varchar("country_code", { length: 10 }),
  demoAttendedDate: timestamp("demo_attended_date"),
  phone: varchar("phone", { length: 20 }).notNull(),
  counselledBy: varchar("counselled_by", { length: 255 }),
  fullNumber: varchar("full_number", { length: 20 }),
  priceList: varchar("price_list", { length: 255 }),
  alternativePhone: varchar("alternative_phone", { length: 20 }),
  feeQuoted: integer("fee_quoted"),
  leadSource: varchar("lead_source", { length: 255 }),
  opportunitySource: varchar("opportunity_source", { length: 255 }),
  leadScore: varchar("lead_score", { length: 50 }),
  courseList: varchar("course_list", { length: 255 }),
  classMode: varchar("class_mode", { length: 50 }),
  techStack: varchar("tech_stack", { length: 255 }),
  batchTiming: jsonb("batch_timing").default(sql`'[]'::jsonb`), // ✅ Fixed array issue
  leadOwner: varchar("lead_owner", { length: 255 }),
  coldLeadReason: varchar("cold_lead_reason", { length: 255 }),
  leadStatus: varchar("lead_status", { length: 50 }).default("Not Contacted"),
  visitedDate: timestamp("visited_date"),
  warmStage: varchar("warm_stage", { length: 50 }),
  expectedWalkInDate: timestamp("expected_walkin_date"),
  description: text("description").default(""),
  opportunityStage: varchar("opportunity_stage", { length: 255 }),
  programs: varchar("programs", { length: 255 }),
  leadSourceURL: varchar("lead_source_url", { length: 500 }),
  userId: text("user_id"), // Reference to User table
  leadStage: varchar("lead_stage", { length: 50 }).default("lead"),
  opportunityStatus: varchar("opportunity_status", { length: 50 }).default(
    "Visiting"
  ),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ActivityTask Table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  dueDate: timestamp("due_date").notNull(),
  priority: text("priority").notNull(),

  userId: text("user_id"),
  leadId: integer("lead_id"), // Optional
  batchId: integer("batch_id"), // Optional
  trainerId: integer("trainer_id"), // Optional
  campaignId: integer("campaign_id"), // Optional
  learnerId: integer("learner_id"), // Optional
  mainTaskId: integer("main_task_id"), // Optional

  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const batches = pgTable("batches", {
  id: serial("id").primaryKey(),
  batchName: varchar("batch_name", { length: 255 }),
  location: varchar("location", { length: 255 }),
  slot: varchar("slot", { length: 255 }),
  trainerId: integer("trainer_id"),
  batchStatus: varchar("batch_status", { length: 255 }).default("Upcoming"),
  topicStatus: varchar("topic_status", { length: 255 }),
  noOfStudents: integer("no_of_students"),
  stack: varchar("stack", { length: 255 }),
  startDate: timestamp("start_date"),
  tentativeEndDate: timestamp("tentative_end_date"),
  classMode: varchar("class_mode", { length: 255 }),
  stage: varchar("stage", { length: 255 }),
  comment: text("comment"),
  timing: varchar("timing", { length: 255 }),
  batchStage: varchar("batch_stage", { length: 255 }),
  mentor: varchar("mentor", { length: 255 }),
  zoomAccount: varchar("zoom_account", { length: 255 }),
  stackOwner: varchar("stack_owner", { length: 255 }),
  owner: varchar("owner", { length: 255 }),
  batchOwner: varchar("batch_owner", { length: 255 }),
  description: text("description"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const learners = pgTable("learners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  idProof: varchar("id_proof", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: timestamp("date_of_birth"),
  email: varchar("email", { length: 255 }),
  registeredDate: timestamp("registered_date"),
  location: varchar("location", { length: 255 }),
  batchId: jsonb("batch_id").default(sql`'[]'::jsonb`), // Array of batch IDs
  source: varchar("source", { length: 255 }),
  description: text("description"),
  totalFees: varchar("total_fees", { length: 255 }),
  modeOfInstallmentPayment: varchar("mode_of_installment_payment", { length: 255}),
  feesPaid: varchar("fees_paid", { length: 255 }),
  instalment1Screenshot: varchar("instalment1_screenshot", { length: 255 }),
  dueAmount: varchar("due_amount", { length: 255 }),
  dueDate: timestamp("due_date"),
  status: varchar("status", { length: 50 }).default("Upcoming"),
  userId: text("user_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// LearnerBatch Table
export const learnersBatches = pgTable("learner_batches", {
  id: serial("id").primaryKey(),
  learnerId: integer("learner_id").notNull().references(() => learners.id),
  batchId: integer("batch_id").notNull().references(() => batches.id),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Meetings Table (Merged from Old Schema)
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  meetingName: varchar("meeting_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  zoomMeetingId: varchar("zoom_meeting_id", { length: 255 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  hostId: varchar("host_id"),
  participants: jsonb("participants"), // Store as JSON array
  leadId: integer("lead_id").references(() => leads.id),
  batchId: integer("batch_id"),
  userId: text("user_id").notNull(),
  trainerId: integer("trainer_id"),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  learnerId: integer("learner_id"),
  mainTaskId: integer("main_task_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  to: varchar("to", { length: 255 }).array().notNull(),
  bcc: varchar("bcc", { length: 255 }).array(),
  from: varchar("from", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  body: text("body"),
  emailTemplateId: integer("email_template_id"),
  leadId: integer("lead_id"),
  batchId: integer("batch_id"),
  userId: text("user_id"),
  trainerId: integer("trainer_id"),
  campaignId: integer("campaign_id"),
  mainTaskId: integer("main_task_id"),
  learnerId: integer("learner_id"),
  createdAt: timestamp("created_at", { precision: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", { precision: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Activity Table
export const activities = pgTable("activity", {
  id: serial("id").primaryKey(),
  activityName: varchar("activity_name", { length: 255 }).notNull(),
  leadId: integer("lead_id"),
  batchId: integer("batch_id"),
  trainerId: integer("trainer_id"),
  campaignId: integer("campaign_id"),
  learnerId: integer("learner_id"),
  mainTaskId: integer("main_task_id"),
  userId: text("user_id"),
  newTaskId: integer("new_task_id"),
  meetingId: integer("meeting_id"),
  emailId: integer("email_id"),
  whatsappId: integer("whatsapp_id"),
  messageId: integer("message_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Email Templates Table
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }),
  htmlContent: text("html_content"),
  userId: text("user_id"), // Foreign key to Users table
  createdAt: timestamp("created_at", { precision: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", { precision: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const leadStageEnum = pgEnum("lead_stage", [
  "lead",
  "opportunity",
  "learner",
]);

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id").notNull(),

  leadId: integer("lead_id"),
  batchId: integer("batch_id"),
  trainerId: integer("trainer_id"),
  campaignId: integer("campaign_id"),
  learnerId: integer("learner_id"),
  mainTaskId: integer("main_task_id"),

  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

const notificationTypeEnum = pgEnum("type", ["whatsapp", "text"]);

export const messageTemplate = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: notificationTypeEnum("type").notNull(), // Use the defined enum
  content: text("content").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});


// Define ENUM for message type
export const messageTypeEnum = pgEnum("message_type", ["whatsapp", "text"]);

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  messageId: text("message_id").unique(),
  messageContent: text("message_content"),
  messageTemplateId: integer("message_template_id"),
  leadId: integer("lead_id"),
  batchId: integer("batch_id"),
  trainerId: integer("trainer_id"),
  campaignId: integer("campaign_id"),
  learnerId: integer("learner_id"),
  userId: text("user_id"),
  type: messageTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  callerId: varchar("caller_id", { length: 255 }).notNull(),
  to: varchar("to", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  agentId: varchar("agent_id", { length: 255 }).notNull(),
  userNo: varchar("user_no", { length: 255 }).notNull(),
  time: integer("time").notNull(),
  direction: varchar("direction", { length: 255 }).notNull(),
  answeredSeconds: integer("answered_seconds").notNull(),
  isRecorded: boolean("is_recorded"),
  filename: varchar("filename", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
