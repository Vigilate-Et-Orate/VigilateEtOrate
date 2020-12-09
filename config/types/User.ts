import CONST from 'config/constants'

export type TUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  admin: boolean
  devices: []
  personnalPrayer: string
}

// API Responses
export interface ISignInResponse {
  error?: string
  message: string
  token: string
  user: TUser
}

export interface IMeResponse {
  error?: string
  user: TUser
}

export interface IUserState {
  token: string
  loggedIn: boolean
  user: TUser | undefined
}

// Redux
export interface IUserLogin {
  type: typeof CONST.USER.USER_LOGIN
  user: TUser
  token: string
}

export interface IUserUpdate {
  type: typeof CONST.USER.USER_UPDATE
  user: TUser
}

export interface IUserTokenUpdate {
  type: typeof CONST.USER.USER_TOKEN_UPDATE
  token: string
}

export interface IUserLogout {
  type: typeof CONST.USER.USER_LOGOUT
}

export type TUserActionTypes =
  | IUserLogin
  | IUserTokenUpdate
  | IUserUpdate
  | IUserLogout
