import CONST from 'config/constants'

export type TDevice = {
  id: string
  name?: string
  token: string
}

export type TDeviceResponse = {
  error?: string
} & TDevice

// Redux
export interface IDevicesState {
  devices: TDevice[]
  count: number
}

export interface IDevicesAdd {
  type: typeof CONST.DEVICES.DEVICES_ADD
  device: TDevice
}

export interface IDevicesRemove {
  type: typeof CONST.DEVICES.DEVICES_REMOVE
  device: TDevice
}

export interface IDevicesUpdate {
  type: typeof CONST.DEVICES.DEVICES_UPDATE
  devices: TDevice[]
}

export type IDevicesActionsType = IDevicesAdd | IDevicesRemove | IDevicesUpdate
