import constants from 'config/constants'
import {
  IDevicesActionsType,
  IDevicesAdd,
  IDevicesRemove,
  IDevicesState,
  IDevicesUpdate
} from 'config/types/TDevices'

const initialState: IDevicesState = {
  devices: [],
  count: 0
}

const devicesReducer = (
  state = initialState,
  action: IDevicesActionsType
): IDevicesState => {
  let act: IDevicesActionsType
  switch (action.type) {
    case constants.DEVICES.DEVICES_ADD:
      act = action as IDevicesAdd
      return {
        ...state,
        devices: [...state.devices, act.device],
        count: state.count + 1
      }
    case constants.DEVICES.DEVICES_UPDATE:
      act = action as IDevicesUpdate
      return {
        ...state,
        devices: act.devices,
        count: act.devices.length
      }
    case constants.DEVICES.DEVICES_REMOVE: {
      act = action as IDevicesRemove
      const id = act.device.id
      const index = state.devices.findIndex((e) => e.id === id)
      const newDev = [
        ...state.devices.slice(0, index),
        ...state.devices.slice(index + 1)
      ]
      return { ...state, devices: newDev, count: state.count - 1 }
    }
    default:
      return state
  }
}

export default devicesReducer
