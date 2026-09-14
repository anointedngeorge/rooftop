export type Role = 'super_admin' | 'staff' | 'marketer' | 'partner' | 'customer'
export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'currency' | 'date' | 'textarea' | 'select' | 'boolean'
export type FieldOption = { label: string; value: string }
export type Field = { key: string; label: string; type: FieldType; required?: boolean; options?: FieldOption[]; placeholder?: string }
export type EntityConfig = { table: string; title: string; singular: string; description: string; fields: Field[]; columns: string[] }
export type Profile = { id: string; full_name: string; email: string; role: Role; status: string; phone?: string; avatar_url?: string }
export type RecordRow = Record<string, string | number | boolean | null>
