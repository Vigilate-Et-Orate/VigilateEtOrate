export type TDevice = {
  _id: ''
  name?: string
  token: string
}

export type TDeviceResponse = {
  error?: string
} & TDevice
