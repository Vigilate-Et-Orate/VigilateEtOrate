import CONST from 'config/constants'
import {
  TInformationAelf,
  TInformationsActionTypes
} from 'config/types/AelfApi'

export function updateInformations(
  infos: TInformationAelf
): TInformationsActionTypes {
  return {
    type: CONST.DAILY_INFOS.UPDATE_INFOS,
    informations: infos
  }
}
