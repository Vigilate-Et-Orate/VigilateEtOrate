import CONST from 'config/constants'
import { TKeyboardActionTypes } from 'config/types/TKeyboard'

export function updateKeyboard(keyboard: boolean): TKeyboardActionTypes {
  return {
    type: CONST.KEYBOARD_UPDATE,
    keyboard
  }
}
