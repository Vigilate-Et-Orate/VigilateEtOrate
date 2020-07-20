/**
 * Local Notification
 */
import * as Notifications from 'expo-notifications'

import * as Storage from '../storage/StorageManager'

type NotificationContent = {
  title: string,
  body: string
}

export type Sub = {
  name: string,
  active: boolean
}

/**
 * Send Notification
 */
const sendNotification = async (content: NotificationContent) => {
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
  } as NotificationContent

  let data = await Storage.getDataAsync(Storage.Stored.SUBS)
  if (!data) {
    console.log('Creating data')
    data = JSON.stringify([{
      name: 'angelus',
      active: true
    } as Sub])
  } else {
    let parsedData = JSON.parse(data) as Sub[]
    if (parsedData && parsedData.length > 0) {
      const data =  parsedData.find((elem: Sub) => elem.name === 'angelus')
      if (data?.active !== true)
        parsedData[parsedData.findIndex((elem: Sub) => elem.name === 'angelus')].active = true
      else {
        sendNotification({title: 'Errr', body: 'Vous avez deja souscris a ces notifications'})
        return
      }
    } else {
      console.log('Adding Angelus')
      parsedData.push({name:'angelus', active: true} as Sub)
    }
    data = JSON.stringify(parsedData)
  }
  
  await Storage.setDataAsync(Storage.Stored.SUBS, data)
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
  } as NotificationContent
  sendNotification(content)
  let data = JSON.parse(await Storage.getDataAsync(Storage.Stored.SUBS) || '') as Sub[];
  if (!data) return
  data.map((elem: Sub) => {
    elem.active = false
  })
  await Storage.setDataAsync(Storage.Stored.SUBS, JSON.stringify(data))

  await Notifications.cancelAllScheduledNotificationsAsync()
}
