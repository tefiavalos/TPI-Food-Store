export type Rol = 'user' | 'admin'

export interface UserPublic {
  id: number
  username: string
  full_name: string
  email: string
  role: Rol
  disabled: boolean
  created_at: string
}
