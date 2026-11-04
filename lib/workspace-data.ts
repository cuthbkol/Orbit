import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export type WorkspaceRow = { id: string; [key: string]: unknown }

export async function listWorkspaceRows<T extends WorkspaceRow>(table: string, organisationId: string, archivedColumn = true) {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return { rows: [] as T[], error: "Database is not configured." }
  let query = supabase.from(table).select("*").eq("organisation_id", organisationId).order("created_at", { ascending: false })
  if (archivedColumn) query = query.is("archived_at", null)
  const { data, error } = await query
  return { rows: (data ?? []) as unknown as T[], error: error?.message ?? null }
}

export async function insertWorkspaceRow<T extends WorkspaceRow>(table: string, organisationId: string, values: Record<string, unknown>) {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) throw new Error("Database is not configured.")
  const { data, error } = await supabase.from(table).insert({ ...values, organisation_id: organisationId }).select("*").single()
  if (error) throw error
  return data as unknown as T
}

export async function updateWorkspaceRow<T extends WorkspaceRow>(table: string, organisationId: string, id: string, values: Record<string, unknown>) {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) throw new Error("Database is not configured.")
  const { data, error } = await supabase.from(table).update(values).eq("organisation_id", organisationId).eq("id", id).select("*").single()
  if (error) throw error
  return data as unknown as T
}

export async function archiveWorkspaceRow(table: string, organisationId: string, id: string) {
  return updateWorkspaceRow(table, organisationId, id, { archived_at: new Date().toISOString() })
}
