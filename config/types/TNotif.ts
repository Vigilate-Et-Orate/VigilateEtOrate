import { TTime } from 'utils/time/timeManager'
import CONST from 'config/constants'
import { TIntention } from './Intention'
import { TPrayer } from './Prayer'

export type TNotif = {
  _id: string
  userId: string
  notificationContent: string
  type: 'intention' | 'prayer'
  itemId: string | TIntention | TPrayer
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
