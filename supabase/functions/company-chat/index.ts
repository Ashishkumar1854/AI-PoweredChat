// supabase/functions/company-chat/index.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ CORS headers (VERY IMPORTANT)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // 🔁 Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question || !question.trim()) {
      return new Response(
        JSON.stringify({ answer: "Please ask a valid question." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // 1️⃣ Auth
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ answer: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 2️⃣ User → Company
    const { data: userRow } = await supabase
      .from("users")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!userRow?.company_id) {
      return new Response(
        JSON.stringify({
          answer: "No company assigned to your account.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3️⃣ Company Tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select("title, status")
      .eq("company_id", userRow.company_id);

    // 4️⃣ RAG-style context
    const context = (tasks || [])
      .map((t) => `• ${t.title} (${t.status})`)
      .join("\n");

    const answer = `
Company Tasks:
${context || "No tasks found."}

Your Question:
${question}
`.trim();

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
