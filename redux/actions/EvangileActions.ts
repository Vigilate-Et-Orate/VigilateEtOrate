import CONST from 'config/constants'
import { TLectureAelf, TEvangileActionTypes } from 'config/types/AelfApi'

export function updateEvangile(evangile: TLectureAelf): TEvangileActionTypes {
  return {
    type: CONST.EVANGILE.EVAN_UPDATE,
    evangile
  }
}
