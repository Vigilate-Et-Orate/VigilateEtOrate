import { NotificationContent } from './NotificationTypes'

export type NotifTime = {
  hour: number
  minute: number
  repeats: boolean
}

export type Prayer = {
  displayName: string
  name: string
  description: string
  active: boolean
  subscription: string[]
  content: string
  notifContent: NotificationContent
  times: NotifTime[]
}

export type MyPrayer = {
  title: string
  content: string
}
