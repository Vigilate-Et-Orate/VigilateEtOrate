import CONST from 'config/constants'
import {
  IUserState,
  TUserActionTypes,
  IUserLogin,
  IUserUpdate,
  IUserTokenUpdate,
  IUserLogout
} from 'config/types/User'

const initialState: IUserState = {
  token: '',
  loggedIn: false,
  user: undefined
}

const userReducer = (
  state = initialState,
  action: TUserActionTypes
): IUserState => {
  let act
  switch (action.type) {
    case CONST.USER.USER_LOGIN:
      act = action as IUserLogin
      return { ...state, loggedIn: true, token: act.token, user: act.user }
    case CONST.USER.USER_LOGOUT:
      act = action as IUserLogout
      return { ...state, loggedIn: false }
    case CONST.USER.USER_TOKEN_UPDATE:
      act = action as IUserTokenUpdate
      return { ...state, token: act.token, loggedIn: true }
    case CONST.USER.USER_UPDATE:
      act = action as IUserUpdate
      return { ...state, user: act.user }
    default:
      return state
  }
}

export default userReducer
