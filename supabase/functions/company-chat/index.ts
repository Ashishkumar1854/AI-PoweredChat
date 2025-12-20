// /// <reference lib="deno.ns" />

// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


// // CORS CONFIG

// const corsHeaders: HeadersInit = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
// };

// serve(async (req: Request): Promise<Response> => {
//   // ✅ Preflight
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const body = await req.json();
//     const question: string = body?.question?.trim();

//     if (!question) {
//       return new Response(
//         JSON.stringify({ answer: "Please ask a valid question." }),
//         { headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }


//     // Supabase Client

//     const supabase = createClient(
//       Deno.env.get("SUPABASE_URL")!,
//       Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//     );


//     // AUTH

//     const authHeader = req.headers.get("Authorization");
//     const token = authHeader?.replace("Bearer ", "");

//     const {
//       data: { user },
//     } = await supabase.auth.getUser(token);

//     if (!user) {
//       return new Response(
//         JSON.stringify({ answer: "Unauthorized access." }),
//         { status: 401, headers: corsHeaders }
//       );
//     }


//     // USER → COMPANY

//     const { data: userRow } = await supabase
//       .from("users")
//       .select("company_id, companies(name)")
//       .eq("id", user.id)
//       .single();

//     if (!userRow?.company_id) {
//       return new Response(
//         JSON.stringify({ answer: "User is not mapped to any company." }),
//         { headers: corsHeaders }
//       );
//     }

//     const loggedCompanyName: string =
//       userRow.companies.name.toLowerCase();


//     // STEP-1: COMPANY MENTION DETECTION

//     const q = question.toLowerCase();

//     const knownCompanies = [
//       "wipro",
//       "infosys",
//       "tcs",
//       "accenture",
//       "botivate",
//     ];

//     const mentionedCompany = knownCompanies.find((c) =>
//       q.includes(c)
//     );

//     // 🚨 SECURITY CHECK
//     if (mentionedCompany && mentionedCompany !== loggedCompanyName) {
//       return new Response(
//         JSON.stringify({
//           answer: `I can only access task data for your company (${userRow.companies.name}). 
// For security reasons, I cannot show data for ${mentionedCompany}.`,
//         }),
//         { headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }


//     // STEP-2: INTENT (STATUS)

//     let statusFilter: string | null = null;

//     if (q.includes("pending")) statusFilter = "pending";
//     else if (q.includes("progress")) statusFilter = "in_progress";
//     else if (q.includes("done") || q.includes("completed"))
//       statusFilter = "done";


//     // STEP-3: SMART QUERY

//     let taskQuery = supabase
//       .from("tasks")
//       .select("title, status")
//       .eq("company_id", userRow.company_id);

//     if (statusFilter) {
//       taskQuery = taskQuery.eq("status", statusFilter);
//     }

//     const { data: tasks } = await taskQuery;


//     // STEP-4: RESPONSE (AI-STYLE)

//     const taskText =
//       tasks && tasks.length > 0
//         ? tasks.map((t) => `• ${t.title} (${t.status})`).join("\n")
//         : "No matching tasks found.";

//     const answer = `
// Here are your ${
//       statusFilter ? statusFilter.replace("_", " ") : "current"
//     } tasks:

// ${taskText}
// `.trim();

//     return new Response(JSON.stringify({ answer }), {
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: err.message }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// });
