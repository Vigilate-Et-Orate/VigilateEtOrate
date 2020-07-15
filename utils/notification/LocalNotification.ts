/**
 * Local Notification
 */
import * as Notifications from 'expo-notifications'

import * as Storage from '../storage/StorageManager'

type Content = {
  title: string,
  body: string
}

/**
 * Send Notification
 */
const sendNotification = async (content: Content) => {
  Notifications.scheduleNotificationAsync({
    content,
    trigger: null
  })
}

/**
 * Register for Angelus daily notification
 */
export const registerForAngelusAsync = async () => {
  const midday = {
    hour: 12,
    minute: 0,
    repeats: true
  }
  let content = {
    title: 'Tout est bon!',
    body: 'Vous avez souscrit aux rappels quotidients pour l\'Angelus'
  } as Content

  let data = await Storage.getDataAsync(Storage.Stored.SUBS)
  if (!data) {
    console.log('Creating data')
    data = JSON.stringify({
      angelus: true,
    })
  } else {
    let parsedData = JSON.parse(data)
    if (parsedData?.angelus && parsedData?.angelus === false) {
      console.log('Enable Angelus')
      parsedData.angelus = true
    } else if (parsedData.angelus === true) {
      sendNotification({title: 'Errr', body: 'Vous avez deja souscris a ces notifications'})
      return
    } else {
      console.log('Adding Angelus')
      parsedData.angelus = true
    }
    data = parsedData
  }
  
  await Storage.setDataAsync(Storage.Stored.SUBS, JSON.stringify(data))
  sendNotification(content)

  let subs = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Angeluuuuus",
      body: "Il est l'heure de chanter l'Angélus"
    },
    trigger: midday
  })
  console.log('Subscriptions returned:', subs);
}

/**
 * Unregister from angelus
 */


/**
 * Unsubscribe to all notifications
 */
export const unsubToAll = async () => {
  const content = {
    title: 'Successfully unsubscribed from all',
    body: 'You will not receive otifications anymore'
  }
  sendNotification(content)
  let data = JSON.parse(await Storage.getDataAsync(Storage.Stored.SUBS) || '');
  if (!data) return
  console.log('Unsub got:', data);
  Object.keys(data).map((key: string) => {
    data[key] = false
  })
  console.log('Unsub:', data)
  await Storage.setDataAsync(Storage.Stored.SUBS, JSON.stringify(data))

  await Notifications.cancelAllScheduledNotificationsAsync()
}
