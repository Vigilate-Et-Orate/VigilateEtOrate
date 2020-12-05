import { NotificationContent } from './NotificationTypes'

export type TNotifTime = {
  hour: number
  minute: number
  repeats: boolean
}

export type TPrayer = {
  displayName: string
  name: string
  description: string
  // active: boolean
  // subscription: string[]
  content: string
  notifContent: NotificationContent
  // times: NotifTime[]
}

export type TPrayerResponse = {
  error?: string
  prayers: TPrayer[]
}

export type TMyPrayer = {
  title: string
  content: string
}
