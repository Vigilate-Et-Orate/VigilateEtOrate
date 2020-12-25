import CONST from 'config/constants'
import { IPrayersState, TPrayersActionTypes } from 'config/types/Prayer'

const initialState: IPrayersState = {
  prayers: [],
  count: 0
}

const prayersReducer = (
  state = initialState,
  action: TPrayersActionTypes
): IPrayersState => {
  if (action.type !== CONST.PRAYERS.PRAYERS_UPDATE) return state
  return { ...state, prayers: action.prayers, count: action.prayers.length }
}

export default prayersReducer
