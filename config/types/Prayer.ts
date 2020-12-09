import { NotificationContent } from './NotificationTypes'
import CONST from 'config/constants'

export type TNotifTime = {
  hour: number
  minute: number
  repeats: boolean
}

export type TPrayer = {
  _id: string
  displayName: string
  name: string
  description: string
  content: string
  notifContent: NotificationContent
}

export type TMyPrayer = {
  title: string
  content: string
}

// Response
export type TPrayerResponse = {
  error?: string
  prayers: TPrayer[]
}

// Redux
export interface IPrayersState {
  prayers: TPrayer[]
  count: number
}

export interface IPrayersUpdate {
  type: typeof CONST.PRAYERS.PRAYERS_UPDATE
  prayers: TPrayer[]
}

export type TPrayersActionTypes = IPrayersUpdate
