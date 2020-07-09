/**
 * Local Notification
 */
import * as Notifications from 'expo-notifications'

/**
 * Register for Angelus daily notification
 */
export const registerForAngelus = () => {
  const midday = {
    hour: 12,
    minute: 0,
    repeats: true
  }

  Notifications.scheduleNotificationAsync({
    content: {
      title: "C'est tout bon !",
      body: "Vous avez souscrit aux rappels pour l'Angelus"
    },
    trigger: null
  });

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Angeluuuuus",
      body: "Il est l'heure de chanter l'Angélus"
    },
    trigger: midday
  })
}