import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Generate Supabase Auth session
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return Response.json(
      { message: error?.message || "Login failed" },
      { status: error?.status || 500 }
    );
  }

  return Response.json({ success: true, data: data.session });
}
