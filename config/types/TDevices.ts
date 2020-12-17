import { ExpoPushToken } from 'expo-notifications'

export type TDevice = {
  id: ''
  name?: string
  token: string
}

export type TDeviceResponse = {
  error?: string
} & TDevice
