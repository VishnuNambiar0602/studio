import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jiipseivhisqnknlvqrk.supabase.co",
  "eyJh..." // your anon key
);

async function test() {
  const { data, error } = await supabase.from("your_table_name").select("*").limit(1);
  if (error) console.error("❌ Connection failed:", error);
  else console.log("✅ Supabase connected!", data);
}

test();
