import CONST from 'config/constants'
import { TInformationsActionTypes } from 'config/types/TAelfApi'
import { TNominisSaint } from 'config/types/TNominis'

export function updateInformations(
  infos: TNominisSaint
): TInformationsActionTypes {
  return {
    type: CONST.DAILY_INFOS.UPDATE_INFOS,
    informations: infos
  }
}
