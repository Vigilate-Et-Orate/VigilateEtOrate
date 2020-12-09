import constants from 'config/constants'
import {
  IIntentionsAdd,
  IIntentionsDelete,
  IIntentionsState,
  IIntentionsUpdate,
  TIntentionsActionsTypes
} from 'config/types/Intention'

const initialState: IIntentionsState = {
  intentions: [],
  count: 0
}

const intentionsReducer = (
  state = initialState,
  action: TIntentionsActionsTypes
): IIntentionsState => {
  let act: TIntentionsActionsTypes
  switch (action.type) {
    case constants.INTENTIONS.INTENTIONS_ADD:
      act = action as IIntentionsAdd
      return {
        ...state,
        intentions: [...state.intentions, act.intention],
        count: state.count + 1
      }
    case constants.INTENTIONS.INTENTIONS_UPDATE:
      act = action as IIntentionsUpdate
      return {
        ...state,
        intentions: act.intentions,
        count: act.intentions.length
      }
    case constants.INTENTIONS.INTENTIONS_REMOVE: {
      act = action as IIntentionsDelete
      const id = act.intention.id
      const index = state.intentions.findIndex((elem) => elem.id === id)
      const newInt = [
        ...state.intentions.slice(0, index),
        ...state.intentions.slice(index + 1)
      ]
      return { ...state, intentions: newInt, count: state.count - 1 }
    }
    default:
      return state
  }
}

export default intentionsReducer
