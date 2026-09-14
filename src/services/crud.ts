import { supabase } from '../lib/supabase'
import type { RecordRow } from '../types'

export async function listRows(table: string) {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(100)
  if (error) throw error
  return (data ?? []) as RecordRow[]
}

export async function createRow(table: string, values: RecordRow) {
  if (table === 'profiles') {
    const { data, error } = await supabase.functions.invoke('admin-users', { body: { action: 'create', values } })
    if (error) throw error
    return data as RecordRow
  }
  const { data, error } = await supabase.from(table).insert(values as any).select().single()
  if (error) throw error
  return data as RecordRow
}

export async function updateRow(table: string, id: string, values: RecordRow) {
  if (table === 'profiles') {
    const { data, error } = await supabase.functions.invoke('admin-users', { body: { action: 'update', id, values } })
    if (error) throw error
    return data as RecordRow
  }
  const { data, error } = await supabase.from(table).update(values as any).eq('id', id).select().single()
  if (error) throw error
  return data as RecordRow
}

export async function deleteRow(table: string, id: string) {
  if (table === 'profiles') {
    const { error } = await supabase.functions.invoke('admin-users', { body: { action: 'delete', id } })
    if (error) throw error
    return
  }
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}
