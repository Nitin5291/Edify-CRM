import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/drizzle/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Get hourly leads count for the current day
    const hourlyLeadsCount = [];
    for (let i = 0; i < 24; i++) {
      const startHour = new Date(today);
      const endHour = new Date(today);
      startHour.setHours(i, 0, 0, 0);
      endHour.setHours(i + 1, 0, 0, 0);

      const count = await db
        .select({ count: sql`COUNT(*)` })
        .from(leads)
        .where(
          sql`${leads.createdAt} >= ${startHour.toISOString()} AND ${
            leads.createdAt
          } < ${endHour.toISOString()}`
        );

      hourlyLeadsCount.push({ hour: i, count: count[0]?.count || 0 });
    }

    // Get today's total leads count
    const todaysLeadsCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(leads)
      .where(sql`${leads.createdAt} >= ${todayISO}`);

    // Get leads count by leadStatus
    const leadsCountByLeadStatus = await db
      .select({ leadStatus: leads.leadStatus, count: sql`COUNT(*)` })
      .from(leads)
      .groupBy(leads.leadStatus);

    return NextResponse.json({
      todaysLeadsCount: todaysLeadsCount[0]?.count || 0,
      leadsCountByLeadStatus,
      hourlyLeadsCount,
    });
  } catch (error: any) {
    console.error("Error fetching leads statistics:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
