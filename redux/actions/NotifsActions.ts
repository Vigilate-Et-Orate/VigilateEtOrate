import { TNotif, TNotifActionTypes } from 'config/types/TNotif'
import CONST from 'config/constants'

export function updateNotifs(notifs: TNotif[]): TNotifActionTypes {
  return {
    type: CONST.NOTIF.NOTIF_UPDATE,
    notifs
  }
}

export function addNotif(notif: TNotif): TNotifActionTypes {
  return {
    type: CONST.NOTIF.NOTIF_ADD,
    notif
  }
}

export function removeNotif(notif: TNotif): TNotifActionTypes {
  return {
    type: CONST.NOTIF.NOTIFS_REMOVE,
    notif
  }
}
