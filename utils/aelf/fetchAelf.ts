import axios from 'axios'

import * as Storage from 'utils/storage/StorageManager'

export type LectureAelf = {
  type: 'lecture_1' | 'psaume' | 'lecture_2' | 'evangile',
  refrain_psalmique: string,
  titre: string,
  contenu: string,
  ref: string,
  intro_lue: string,
  verset_evangile: string
}

export type InformationAelf = {
  date: string,
  zone: string,
  couleur: string,
  jour_liturgique_nom: string,
  fete: string,
  degre: string,
  ligne1: string
}

type AelfResponse = {
  informations: InformationAelf,
  messes: [{
    nom: string,
    lectures: LectureAelf[]
  }]
}

function getformatedDate() {
    var d = new Date(Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export const getDailyGospel = async () => {
  const date = getformatedDate()
  let response = await axios.get(`https://api.aelf.org/v1/messes/${date}/france`);
  const res = response.data as AelfResponse
  const evangile = res.messes[0].lectures.find((e: LectureAelf) => e.type === 'evangile')
  await Storage.setDataAsync(Storage.Stored.EVANGILE, JSON.stringify(evangile))
  return evangile
}

export const getDailySaint = async () => {
  const date = getformatedDate()
  const response = await axios.get(`https://api.aelf.org/v1/informations/${date}/france`)
  const res = response.data.informations as InformationAelf
  await Storage.setDataAsync(Storage.Stored.DAY_INFO, JSON.stringify(res))
  console.log('Saint Response', res)
  return res
}