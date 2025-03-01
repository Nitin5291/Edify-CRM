import { supabase } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // if (!userId) {
  //   return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  // }

  try {
    if (userId) {
      const { data, error } = await supabase.auth.admin.getUserById(userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data?.user, { status: 200 });
    } else {
      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
