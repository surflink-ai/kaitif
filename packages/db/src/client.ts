import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Browser client for client-side operations
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server client for server-side operations (requires cookies)
export function createServerSupabaseClient(
  cookieStore: {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options: Record<string, unknown>) => void;
    remove: (name: string, options: Record<string, unknown>) => void;
  }
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Handle cookies in Server Components
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.remove(name, options);
          } catch {
            // Handle cookies in Server Components
          }
        },
      },
    }
  );
}

// Service role client for admin operations (server-side only)
export function createServiceRoleClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Type exports
export type SupabaseClient = ReturnType<typeof createBrowserSupabaseClient>;
export type ServerSupabaseClient = ReturnType<typeof createServerSupabaseClient>;
export type ServiceRoleSupabaseClient = ReturnType<typeof createServiceRoleClient>;
