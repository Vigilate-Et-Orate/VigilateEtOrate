import constants from 'config/constants'
import { TDevice, IDevicesActionsType } from 'config/types/TDevices'

export function addDevice(device: TDevice): IDevicesActionsType {
  return {
    type: constants.DEVICES.DEVICES_ADD,
    device
  }
}

export function removeDevice(device: TDevice): IDevicesActionsType {
  return {
    type: constants.DEVICES.DEVICES_REMOVE,
    device
  }
}

export function updatedevices(devices: TDevice[]): IDevicesActionsType {
  return {
    type: constants.DEVICES.DEVICES_UPDATE,
    devices
  }
}
