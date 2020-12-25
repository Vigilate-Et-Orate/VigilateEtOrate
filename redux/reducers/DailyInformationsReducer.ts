import CONST from 'config/constants'
import {
  IDailyInfosState,
  TInformationsActionTypes
} from 'config/types/AelfApi'

const initialState: IDailyInfosState = {
  informations: undefined
}

const dailyInfosReducer = (
  state = initialState,
  action: TInformationsActionTypes
): IDailyInfosState => {
  if (action.type !== CONST.DAILY_INFOS.UPDATE_INFOS) return state
  return { ...state, informations: action.informations }
}

export default dailyInfosReducer
