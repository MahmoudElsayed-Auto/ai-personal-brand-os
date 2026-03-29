import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client for backend operations (bypasses RLS)
export const supabaseAdmin = createServerClient(supabaseUrl, serviceRoleKey, {
  cookies: {
    getAll() {
      return cookies().getAll()
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => cookies().set(name, value, options))
      } catch {
        // Ignore
      }
    },
  },
})

// Helper to securely get authenticated user inside API routes
export const getAuthenticatedUserId = async () => {
  const supabase = createServerClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookies().getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookies().set(name, value, options))
        } catch {
          // Ignore
        }
      },
    },
  })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id || null
}
