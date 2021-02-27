import CONST from 'config/constants'
import { TNominisSaint } from './TNominis'

export type TLectureAelf = {
  type: 'lecture_1' | 'psaume' | 'lecture_2' | 'evangile'
  refrain_psalmique: string
  titre: string
  contenu: string
  ref: string
  intro_lue: string
  verset_evangile: string
}

export type TInformationAelf = {
  date: string
  zone: string
  couleur: string
  jour_liturgique_nom: string
  fete: string
  degre: string
  ligne1: string
}

export interface IResponseAelf {
  informations: TInformationAelf
  messes: [
    {
      nom: string
      lectures: TLectureAelf[]
    }
  ]
}

// Redux
export interface IEvangileState {
  evangile: TLectureAelf | undefined
}

export interface IDailyInfosState {
  informations: TNominisSaint | undefined
}

export interface ILectureUpdate {
  type: typeof CONST.EVANGILE.EVAN_UPDATE
  evangile: TLectureAelf
}

export type TEvangileActionTypes = ILectureUpdate

export interface IDailyInfosUpdate {
  type: typeof CONST.DAILY_INFOS.UPDATE_INFOS
  informations: TNominisSaint
}

export type TInformationsActionTypes = IDailyInfosUpdate
