import CONST from 'config/constants'
import { TKeyboardActionTypes } from 'config/types/Keyboard'

export function updateKeyboard(keyboard: boolean): TKeyboardActionTypes {
  return {
    type: CONST.KEYBOARD_UPDATE,
    keyboard
  }
}
