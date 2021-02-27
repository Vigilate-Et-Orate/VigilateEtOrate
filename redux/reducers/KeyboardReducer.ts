import CONST from 'config/constants'
import { IKeyboardState, TKeyboardActionTypes } from 'config/types/TKeyboard'

const initialState: IKeyboardState = false

const keyboardReducer = (
  state = initialState,
  action: TKeyboardActionTypes
): IKeyboardState => {
  if (action.type !== CONST.KEYBOARD_UPDATE) return state
  return action.keyboard
}

export default keyboardReducer
