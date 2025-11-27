import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  ""
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

if (!supabaseUrl || !supabaseServiceRoleKey) {
  const missing = [
    !supabaseUrl ? "SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL" : undefined,
    !supabaseServiceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY" : undefined,
  ].filter(Boolean)

  throw new Error(
    `Missing Supabase environment variables: ${missing.join(
      ", "
    )}. Please add them to your deployment.`
  )
}

export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
)

