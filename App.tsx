import React, { useEffect } from 'react'
import * as Notifications from 'expo-notifications'

import * as NativeNotifs from './utils/notification/NotificationManager'
import Stack from './components/layout/Routes'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

const App = (): JSX.Element => {
  useEffect(() => {
    NativeNotifs.registerForNotificationsAsync()
    // const subscription = Notifications.addPushTokenListener()
    const subReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (!notification) return
      }
    )

    return () => {
      subReceived.remove()
    }
  }, [])

  return <Stack />
}

export default App
