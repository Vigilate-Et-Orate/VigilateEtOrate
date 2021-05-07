import firebase from 'utils/firebase'
import { TIntention } from 'config/types/TIntention'
import { TUser } from 'config/types/User'
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
    const userRef = firebase
      .firestore()
      .collection(usersCollection)
      .doc(currentUser.uid)
    const dbIntentions = firebase.firestore().collection('intentions')
    const snapshot = await dbIntentions.where('user', '==', userRef).get()
    const intentions: TIntention[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        intention: data.intention
        // user: data.user
      } as TIntention
    })
    return intentions
  }
  // CREATE
  async create(content: string): Promise<void> {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase
      .firestore()
      .collection(usersCollection)
      .doc(currentUser.uid)
    await firebase.firestore().collection(intentionsCollection).add({
      intention: content,
      user: userRef
    })
  }
  // UPDATE
  async update(intention: TIntention): Promise<void> {
    const intRef = firebase
      .firestore()
      .collection(intentionsCollection)
      .doc(intention.id)
    await intRef.update({
      intention: intention.intention
    })
  }
  // DELETE
  async delete(id: string): Promise<void> {
    await firebase.firestore().collection(intentionsCollection).doc(id).delete()
  }
}

class UsersController {
  async create(user: TUser, password: string) {
    const fireUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, password)
      .catch((error) => {
        const errCode = error.code
        if (errCode == 'auth/weak-password') console.error('Weak Password')
      })
    if (!fireUser || !fireUser.user) return
    // create user in db
    const userDoc = firebase
      .firestore()
      .collection(usersCollection)
      .doc(fireUser.user.uid)
    await userDoc.set({
      firstName: user.firstname,
      lastName: user.lastname,
      admin: user.admin,
      devices: []
    })
  }

  async update(email: string, firstName: string, lastName: string) {
    const currentUser = firebase.auth().currentUser
    // Update Auth
    if (!currentUser || currentUser.email == email) return
    await currentUser.updateEmail(email)
    // Update Infos
    await firebase
      .firestore()
      .collection(usersCollection)
      .doc(currentUser.uid)
      .update({
        lastName,
        firstName
      })
  }

  async signIn(email: string, password: string) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (e) {
      console.error('error signing in: ', e.message)
      return false
    }
    return true
  }

  async get(): Promise<TUser | undefined> {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userSnap = await firebase
      .firestore()
      .collection(usersCollection)
      .doc(currentUser.uid)
      .get()
    return {
      firstname: userSnap.get('firstName'),
      lastname: userSnap.get('lastName'),
      admin: userSnap.get('admin'),
      email: currentUser.email,
      id: currentUser.uid
    } as TUser
  }
}

class DevicesController {
  async add(token: string) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const userRef = firebase
      .firestore()
      .collection(usersCollection)
      .doc(currentUser.uid)
    // check if device already is registered
    const checkDev = await firebase
      .firestore()
      .collectionGroup(devicesCollection)
      .where('token', '==', token)
      .get()
    if (!checkDev.empty) return
    const dev = {
      name: Device.deviceName,
      token
    }
    const newDev = await userRef.collection(devicesCollection).add(dev)
    return { id: newDev.id, name: dev.name, token: dev.token } as TDevice
  }

  async check(token: string): Promise<boolean> {
    const dev = await firebase
      .firestore()
      .collectionGroup(devicesCollection)
      .where('token', '==', token)
      .limit(1)
      .get()
    return !dev.empty
  }

  async update(name: string, id: string) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    await firebase
      .firestore()
      .collection(usersCollection)
      .doc(currentUser.uid)
      .collection(devicesCollection)
      .doc(id)
      .update({
        name
      })
  }

  async get() {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const devsSnap = await firebase
      .firestore()
      .collection(usersCollection)
      .doc(currentUser.uid)
      .collection(devicesCollection)
      .get()
    const devs: TDevice[] = devsSnap.docs.map((dev) => {
      const data = dev.data()
      return {
        name: data.name,
        token: data.token,
        id: dev.id
      } as TDevice
    })
    return devs
  }

  async delete(id: string) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    // get ref
    const devRef = firebase.firestore().collection(devicesCollection).doc(id)
    await devRef.delete()
  }
}

class PrayerContentController {
  async getById(id: string) {
    const prayerContentSnap = await firebase
      .firestore()
      .collection(prayerContentCollection)
      .doc(id)
      .get()
    const prayerContent = {
      title: prayerContentSnap.get('title'),
      body: prayerContentSnap.get('body'),
      sound: prayerContentSnap.get('sound')
    }
    return prayerContent
  }
}

class PrayersController {
  async get() {
    const prayersSnap = await firebase
      .firestore()
      .collection(prayersCollection)
      .get()
    const prayers: TPrayer[] = prayersSnap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        displayName: data.displayName,
        name: data.name,
        notificationContent: data.notificationContentId,
        description: data.description,
        content: data.content
      } as TPrayer
    })
    return prayers
  }
}

class FavouriteController {
  async getFavs() {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const favsSnap = await firebase
      .firestore()
      .collection(favsCollection)
      .where('user', '==', currentUser.uid)
      .get()
    const favs: TFavourite[] = favsSnap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          prayer: doc.get('prayer'),
          user: doc.get('user'),
          faved: doc.get('faved')
        } as TFavourite)
    )
    return favs
  }

  async toggle(
    prayerId: string,
    faved: boolean
  ): Promise<TFavourite | undefined> {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const favSnap = await firebase
      .firestore()
      .collection(favsCollection)
      .where('user', '==', currentUser.uid)
      .where('prayer', '==', prayerId)
      .limit(1)
      .get()
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
        prayer: prayerId,
        user: currentUser.uid,
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
  async create(
    itemId: string,
    type: 'intention' | 'prayer',
    time: string,
    notificationContentId: string
  ) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const notif = {
      item: itemId,
      notificationContent: notificationContentId,
      type,
      time,
      user: currentUser.uid
    }
    const newNotif = await firebase
      .firestore()
      .collection(notificationsCollection)
      .add(notif)
    return { id: newNotif.id, ...notif } as TNotif
  }

  async delete(id: string) {
    const notifRef = firebase
      .firestore()
      .collection(notificationsCollection)
      .doc(id)
    await notifRef.delete()
  }

  async get() {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return
    const notifsSnap = await firebase
      .firestore()
      .collection(notificationsCollection)
      .where('user', '==', currentUser.uid)
      .get()
    const notifs: TNotif[] = notifsSnap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        item: data.item,
        type: data.type,
        time: data.time,
        notificationContent: data.notificationContent
      } as TNotif
    })
    return notifs
  }
}
