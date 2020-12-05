export type TUser = {
  _id: string
  firstname: string
  lastname: string
  email: string
  admin: boolean
  devices: []
}

export type TSignInResponse = {
  error?: string
  message: string
  token: string
  user: TUser
}
