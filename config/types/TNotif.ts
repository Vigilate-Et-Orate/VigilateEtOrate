import { TTime } from 'utils/time/timeManager'
import CONST from 'config/constants'
import { TIntention } from './TIntention'
import { TPrayer } from './TPrayer'
import { firestore } from 'firebase'

export type TNotif = {
  id?: string
  user: firestore.DocumentReference | string
  notificationContent: firestore.DocumentReference | string
  type: 'intention' | 'prayer'
  item: string | TIntention | TPrayer | firestore.DocumentReference
  time: TTime | string
}

export type TNotifResponse = {
  error?: string
} & TNotif

export type TNotifsResponse = {
  error?: string
} & TNotif[]

// Redux
export interface INotifState {
  notifs: TNotif[]
}

export interface INotifUpdate {
  type: typeof CONST.NOTIF.NOTIF_UPDATE
  notifs: TNotif[]
}

export interface INotifAdd {
  type: typeof CONST.NOTIF.NOTIF_ADD
  notif: TNotif
}

export interface INotifRemove {
  type: typeof CONST.NOTIF.NOTIFS_REMOVE
  notif: TNotif
}

export type TNotifActionTypes = INotifUpdate | INotifAdd | INotifRemove
