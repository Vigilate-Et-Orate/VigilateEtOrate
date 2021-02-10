import CONST from 'config/constants'
import { TInformationsActionTypes } from 'config/types/AelfApi'
import { TNominisSaint } from 'config/types/Nominis'

export function updateInformations(
  infos: TNominisSaint
): TInformationsActionTypes {
  return {
    type: CONST.DAILY_INFOS.UPDATE_INFOS,
    informations: infos
  }
}
