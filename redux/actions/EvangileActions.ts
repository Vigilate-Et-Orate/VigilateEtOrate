import CONST from 'config/constants'
import { TLectureAelf, TEvangileActionTypes } from 'config/types/TAelfApi'

export function updateEvangile(evangile: TLectureAelf): TEvangileActionTypes {
  return {
    type: CONST.EVANGILE.EVAN_UPDATE,
    evangile
  }
}
