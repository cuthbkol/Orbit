import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const invitationSchema = z.object({
  organisationId: z.string().uuid(),
  email: z.string().email().max(320),
  fullName: z.string().trim().min(2).max(160),
  jobTitle: z.string().trim().max(160).default(""),
  departmentId: z.string().uuid().nullable().optional(),
  role: z.enum(["org_admin", "manager", "department_head", "staff"]),
})

export async function POST(request: Request) {
  const userClient = await createSupabaseServerClient()
  if (!userClient) return NextResponse.json({ error: "Authentication service is not configured." }, { status: 503 })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return NextResponse.json({ error: "Sign in to invite a colleague." }, { status: 401 })

  const parsed = invitationSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "Check the invitation details and try again." }, { status: 400 })
  const invitation = parsed.data
  const { data: membership } = await userClient.from("organisation_memberships").select("role,status").eq("organisation_id", invitation.organisationId).eq("user_id", user.id).eq("status", "active").maybeSingle()
  if (membership?.role !== "org_admin") return NextResponse.json({ error: "Only an organisation administrator can invite users." }, { status: 403 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return NextResponse.json({ error: "Staff invitations need the server-only Supabase service key to be configured." }, { status: 503 })
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(invitation.email, {
    data: { full_name: invitation.fullName, organisation_invite: true },
    redirectTo: `${new URL(request.url).origin}/auth/callback`,
  })
  if (inviteError || !invite.user) return NextResponse.json({ error: inviteError?.message ?? "Could not create the invitation." }, { status: 400 })

  const { error: membershipError } = await admin.from("organisation_memberships").upsert({
    organisation_id: invitation.organisationId, user_id: invite.user.id, role: invitation.role, status: "active",
  }, { onConflict: "organisation_id,user_id" })
  if (membershipError) return NextResponse.json({ error: "The invite email was sent, but workspace membership could not be saved. Contact an administrator." }, { status: 500 })

  const { error: profileError } = await admin.from("staff_profiles").upsert({
    organisation_id: invitation.organisationId, user_id: invite.user.id, display_name: invitation.fullName,
    work_email: invitation.email, job_title: invitation.jobTitle, department_id: invitation.departmentId ?? null,
  }, { onConflict: "organisation_id,user_id" })
  if (profileError) return NextResponse.json({ error: "The invitation was sent and membership added, but the staff profile could not be saved." }, { status: 500 })
  return NextResponse.json({ invited: true })
}
