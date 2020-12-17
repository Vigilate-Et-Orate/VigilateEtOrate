import CONST from 'config/constants'
import {
  INotifState,
  INotifAdd,
  INotifRemove,
  INotifUpdate,
  TNotifActionTypes
} from 'config/types/TNotif'

const initialState: INotifState = {
  notifs: []
}

const notifsReducer = (
  state = initialState,
  action: TNotifActionTypes
): INotifState => {
  let act: TNotifActionTypes
  switch (action.type) {
    case CONST.NOTIF.NOTIF_ADD:
      act = action as INotifAdd
      return { ...state, notifs: [...state.notifs, act.notif] }
    case CONST.NOTIF.NOTIF_UPDATE:
      act = action as INotifUpdate
      return { ...state, notifs: act.notifs }
    case CONST.NOTIF.NOTIFS_REMOVE: {
      act = action as INotifRemove
      const id = act.notif._id
      const index = state.notifs.findIndex((n) => n._id === id)
      if (index === state.notifs.length) return { ...state, notifs: [] }
      const newNotif = [
        ...state.notifs.slice(0, index),
        ...state.notifs.slice(index + 1)
      ]
      return { ...state, notifs: newNotif }
    }
    default:
      return state
  }
}

export default notifsReducer
