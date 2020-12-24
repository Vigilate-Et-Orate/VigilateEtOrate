import CONST from 'config/constants'

export type IKeyboardState = boolean

export interface IKeyboardUpdate {
  type: typeof CONST.KEYBOARD_UPDATE
  keyboard: boolean
}

export type TKeyboardActionTypes = IKeyboardUpdate
