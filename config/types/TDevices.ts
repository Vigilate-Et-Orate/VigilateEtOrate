export type TDevice = {
  id?: string
  name?: string
  token: string
}

export type TDeviceResponse = {
  error?: string
} & TDevice
