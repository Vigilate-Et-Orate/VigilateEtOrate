import CONST from 'config/constants'
import { IEvangileState, TEvangileActionTypes } from 'config/types/TAelfApi'

const initialState: IEvangileState = {
  evangile: undefined
}

const evangileReducer = (
  state = initialState,
  action: TEvangileActionTypes
): IEvangileState => {
  if (action.type !== CONST.EVANGILE.EVAN_UPDATE) return state
  return { ...state, evangile: action.evangile }
}

export default evangileReducer
