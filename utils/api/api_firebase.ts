import firebase from 'utils/firebase'
import { TIntention } from 'config/types/TIntention'
import { TUser } from 'config/types/User'
import { FirebaseError } from 'firebase'
import { TDevice } from 'config/types/TDevices'
import { TPrayer } from 'config/types/TPrayer'
import { TFavourite } from 'config/types/TFavourite'
import { TNotif } from 'config/types/TNotif'
import * as Device from 'expo-device'

const intentionsCollection = 'intentions'
const prayersCollection = 'prayers'
const prayerContentCollection = 'prayercontents'
const devicesCollection = 'devices'
const usersCollection = 'users'
const favsCollection = 'favs'
const notificationsCollection = 'notifications'

class VOFire {
  // private dispatch: any
  public intentions: IntentionController
  public users: UsersController
  public devices: DevicesController
  public prayers: PrayersController
  public prayerContent: PrayerContentController
  public favourites: FavouriteController
  public notifications: NotificationController

  constructor() {
    // this.dispatch
    this.intentions = new IntentionController()
    this.devices = new DevicesController()
    this.users = new UsersController()
    this.prayerContent = new PrayerContentController()
    this.prayers = new PrayersController()
    this.favourites = new FavouriteController()
    this.notifications = new NotificationController()
  }
}

export default VOFire

class IntentionController {
  // private dispatch: any

  // constructor(dispatch: any) {
  //   this.dispatch = dispatch
  // }
  // GET
  async get(): Promise<TIntention[] | undefined> {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    const dbIntentions = firebase.firestore().collection('intentions')
    const snapshot = await dbIntentions.where('user', '==', userRef).get()
    const intentions: TIntention[] = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        intention: data.intention,
        // user: data.user
      } as TIntention
    })
    return intentions
  }
  // CREATE
  async create(
    content: string
  ): Promise<void> {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    const newIntRef = firebase.firestore().collection(intentionsCollection).add({
      intention: content,
      user: userRef
    })
  }
  // UPDATE
  async update(intention: TIntention): Promise<void> {
    const intRef = firebase.firestore().collection(intentionsCollection).doc(intention.id)
    await intRef.update({
      intention: intention.intention
    })
  }
  // DELETE
  async delete(id: string): Promise<void> {
    const intRef = firebase
      .firestore()
      .collection(intentionsCollection)
      .doc(id).delete()
  }
}

class UsersController {
  async create(user: TUser, password: string) {
    const fireUser = await firebase.auth().createUserWithEmailAndPassword(
      user.email,
      password
    ).catch((error: FirebaseError) => {
      const errCode = error.code
      if (errCode == 'auth/weak-password')
        console.error('Weak Password')
    })
    if (!fireUser || !fireUser.user) return
    // create user in db
    const userDoc = firebase.firestore().collection(usersCollection).doc(fireUser.user.uid)
    await userDoc.set({
      firstName: user.firstname,
      lastName: user.lastname,
      admin: user.admin,
      devices: [],
    })
  }

  async update(email: string, firstName: string, lastName: string) {
    const currentUser = firebase.auth().currentUser
    // Update Auth
    if (!currentUser || currentUser.email == email) return
    await currentUser.updateEmail(email)
    // Update Infos
    await firebase.firestore().collection(usersCollection).doc(currentUser.uid).update({
      lastName,
      firstName,
    })
  }

  async signIn(email: string, password: string) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (e) {
      console.log('error signing in: ', e.message)
      return false
    }
    return true
  }

  async get(): Promise<TUser | undefined> {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userSnap = await firebase.firestore().collection(usersCollection).doc(currentUser.uid).get()
    return {
      firstname: userSnap.get('firstName'),
      lastname: userSnap.get('lastName'),
      admin: userSnap.get('admin'),
      id: currentUser.uid,
    } as TUser
  }
}

class DevicesController {
  async add(token: string) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    // check if device already is registered
    const checkDev = await firebase.firestore().collection(devicesCollection).where('token', '==', token).get()
    if (!checkDev.empty) return
    const dev = {
      name: Device.deviceName,
      token
    }
    const newDev = await firebase.firestore().collection(devicesCollection).add(dev)
    // add device to user
    const userSnap = await userRef.get()
    const userDevs: firebase.firestore.DocumentReference[] = userSnap.get('devices')
    userDevs.push(newDev)
    await userRef.update({
      devices: userDevs
    })
    return { _id: newDev.id, ...dev } as TDevice
  }

  async update(name: string, id: string) {
    await firebase.firestore().collection(devicesCollection).doc(id).update({
      name
    })
  }

  async get() {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userSnap = await firebase.firestore().collection(usersCollection).doc(currentUser.uid).get()
    const devsRefs: firebase.firestore.DocumentReference[] = userSnap.get('devices')
    const devices: TDevice[] = []
    for (let i = 0; i < devsRefs.length; i++) {
      const devSnap = await devsRefs[i].get()
      devices.push({
        name: devSnap.get('name'),
        token: devSnap.get('token'),
        id: devSnap.id
      })
    }
  }

  async delete(id: string) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    // get ref
    const devRef = firebase.firestore().collection(devicesCollection).doc(id)
    // delete from user devices
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    let userDevs: firebase.firestore.DocumentReference[] = await (await userRef.get()).get('devices')
    userDevs = userDevs.filter((doc) => doc.id != devRef.id)
    userRef.update({
      devices: userDevs
    })
    devRef.delete()
  }
}

class PrayersController {
  async get() {
    const prayersSnap = await firebase.firestore().collection(prayersCollection).get()
    const prayers: TPrayer[] = prayersSnap.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id, 
        displayName: data.displayName,
        name: data.name,
        notificationContent: (data.notificationContent as firebase.firestore.DocumentReference).id,
        description: data.description,
        content: data.content
      } as TPrayer
    })
    return prayers
  }
}

class PrayerContentController {
  async getById(id: string) {
    const prayerContentSnap = await firebase.firestore().collection(prayerContentCollection).doc(id).get()
    const prayerContent = {
      title: prayerContentSnap.get('title'),
      body: prayerContentSnap.get('body'),
      sound: prayerContentSnap.get('sound')
    }
  }

  async getRefByPrayer(prayerId: string) {
    const prayerSnap = await firebase.firestore().collection(prayersCollection).doc(prayerId).get()
    const prayerContentRef = prayerSnap.get('prayerContent')
    return prayerContentRef
  }
}

class FavouriteController {
  async getFavs() {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    const favsSnap = await firebase.firestore().collection(favsCollection).where('user', '==', userRef).get()
    const favs: TFavourite[] = favsSnap.docs.map(doc => ({
      id: doc.id,
      prayer: (doc.get('prayer') as firebase.firestore.DocumentReference).id,
      user: (doc.get('user') as firebase.firestore.DocumentReference).id,
      faved: doc.get('faved')
    } as TFavourite))
    return favs
  }

  async toggle(prayerId: string, faved: boolean): Promise<TFavourite | undefined> {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    const prayerRef = firebase.firestore().collection(prayersCollection).doc(prayerId)
    const favSnap = await firebase.firestore().collection(favsCollection).where('user', '==', userRef).where('prayer', '==', prayerRef).limit(1).get()
    if (!favSnap.empty) {
      const fav = favSnap.docs[0]
      await fav.ref.update({ faved })
      return {
        prayer: fav.get('prayer'),
        user: fav.get('user'),
        faved,
        id: fav.id
      } as TFavourite
    } else {
      const favRef = await firebase.firestore().collection(favsCollection).add({
        prayer: prayerRef,
        user: userRef,
        faved
      })
      const favSnap = await favRef.get()
      return {
        prayer: favSnap.get('prayer'),
        user: favSnap.get('user'),
        faved: favSnap.get('faved'),
        id: favSnap.id
      } as TFavourite
    }
  }
}

class NotificationController {
  async create(itemId: string, type: 'intention' | 'prayer', time: string, notificationContentId: string) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    const itemRef = firebase.firestore().collection(type == 'prayer' ? prayersCollection : intentionsCollection).doc(itemId)
    const notificationContentRef = firebase.firestore().collection(prayerContentCollection).doc(notificationContentId)
    const notif: TNotif = {
      item: itemRef,
      notificationContent: notificationContentRef,
      type,
      time,
      user: userRef
    }
    await firebase.firestore().collection(notificationsCollection).add(notif)
    return notif
  }

  async delete(id: string) {
    const notifRef = firebase.firestore().collection(notificationsCollection).doc(id)
    await notifRef.delete()
  }

  async get() {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase.firestore().collection(usersCollection).doc(currentUser.uid)
    const notifsSnap = await firebase.firestore().collection(notificationsCollection).where('user', '==', userRef).get()
    const notifs: TNotif[] = notifsSnap.docs.map(doc => {
      const data = doc.data()
      return { id: doc.id, ...data } as TNotif
    })
    return notifs
  }
}