/**
 * API Functions to interract with server
 */
// import Constants from 'expo-constants'
import { ToastAndroid } from 'react-native'

import * as StorageManager from 'utils/storage/StorageManager'
import * as api from 'utils/api/baseRequest'
import { TSignInResponse, TUser } from 'config/types/User'
import { TPrayerResponse, TPrayer } from 'config/types/Prayer'
import firebase from 'utils/firebase'
import { TIntention } from 'config/types/Intention'

/**
 * SignIn With Credentials
 */
export const signInCredentials = async (
  email: string,
  password: string
): Promise<boolean> => {
  const res = await api.post<TSignInResponse>('/login', {
    email,
    password
  })

  if (res.error) return false
  ToastAndroid.show('Bienvenue' + res.user.firstname, ToastAndroid.SHORT)
  StorageManager.setDataAsync(StorageManager.Stored.TOKEN, res.token)
  StorageManager.setDataAsync(
    StorageManager.Stored.USER,
    JSON.stringify(res.user)
  )
  return true
}

export const registerCredentials = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
): Promise<boolean> => {
  const res = await api.post<TSignInResponse>('/register', {
    email,
    firstname,
    lastname,
    password
  })

  if (res.error) return false
  ToastAndroid.show('Bienvenue' + res.user.firstname, ToastAndroid.SHORT)
  StorageManager.setDataAsync(StorageManager.Stored.TOKEN, res.token)
  StorageManager.setDataAsync(
    StorageManager.Stored.USER,
    JSON.stringify(res.user)
  )
  return true
}

/**
 * Prayers
 */
export const getPrayers = async (): Promise<TPrayer[] | undefined> => {
  const res = await api.get<TPrayerResponse>('/prayers')

  if (res.error) return
  StorageManager.setDataAsync(
    StorageManager.Stored.PRAYERS,
    JSON.stringify(res.prayers)
  )
  return res.prayers as TPrayer[]
}

/**
 * Intentions
 */
export const getIntentions = async (): Promise<TIntention[]> => {
  const user = await StorageManager.getDataAsync<TUser>(
    StorageManager.Stored.USER
  )
  if (!user) throw new Error('User Not Logged')
  const dbIntentions = firebase.firestore().collection('intentions')
  const snapshot = await dbIntentions.where('userId', '==', user._id).get()
  const intentions: TIntention[] = []
  snapshot.forEach((i) => {
    const data = i.data()
    console.log('Intention: ', data)
    intentions.push(data as TIntention)
  })
  await StorageManager.setDataAsync(
    StorageManager.Stored.INTENTIONS,
    JSON.stringify(intentions)
  )
  return intentions
}

export const postIntention = async (
  title: string,
  content: string,
  prayer?: string
): Promise<void> => {
  const user = await StorageManager.getDataAsync<TUser>(
    StorageManager.Stored.USER
  )
  const intentions = await StorageManager.getDataAsync<TIntention[]>(
    StorageManager.Stored.INTENTIONS
  )
  if (!user || !intentions) throw new Error('Failed to push intentions')
  const newIntRef = firebase.firestore().collection('intentions').doc()
  const intention: TIntention = {
    title,
    intention: content,
    userId: user._id
  }
  if (prayer) intention.prayer = prayer
  const _newInt = await newIntRef.set(intention)
  console.log('SET INTENTION returns=', _newInt)
  intentions.push(intention)
}
