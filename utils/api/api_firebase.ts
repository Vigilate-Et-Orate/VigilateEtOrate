import firebase from 'utils/firebase'
import 'firebase/firestore'
import { TIntention } from 'config/types/TIntention'
import { TUser } from 'config/types/User'
import * as StorageManager from 'utils/storage/StorageManager'

/**
 * Intentions
 */
export const getIntentions = async (): Promise<TIntention[]> => {
  const user = await StorageManager.getDataAsync<TUser>(
    StorageManager.Stored.USER
  )
  if (!user) throw new Error('User Not Logged')
  const dbIntentions = firebase.firestore().collection('intentions')
  const snapshot = await dbIntentions.where('userId', '==', user.id).get()
  const intentions: TIntention[] = []
  snapshot.forEach((i) => {
    const data = i.data()
    intentions.push({
      id: i.id,
      intention: data.intention,
      userId: data.userId
    })
  })
  await StorageManager.setDataAsync(
    StorageManager.Stored.INTENTIONS,
    JSON.stringify(intentions)
  )
  return intentions
}

export const postIntention = async (
  content: string,
  userId: string | undefined
): Promise<void> => {
  const intentions = await StorageManager.getDataAsync<TIntention[]>(
    StorageManager.Stored.INTENTIONS
  )
  if (!userId) throw new Error('Failed to push intentions')
  const newIntRef = firebase.firestore().collection('intentions').doc()
  await newIntRef.set({
    intention: content,
    userId
  })
  // Save Intentions to storage
  if (!intentions) {
    const int: TIntention[] = []
    int.push({ intention: content, id: newIntRef.id, userId })
  }
}

export const updateIntention = async (intention: TIntention): Promise<void> => {
  const intRef = firebase.firestore().collection('intentions').doc(intention.id)
  await intRef.update({
    intention: intention.intention
  })
}

export const removeIntentions = async (id: string): Promise<void> => {
  const intRef = await firebase
    .firestore()
    .collection('intentions')
    .doc(id)
    .get()
  intRef.ref.delete()
}
