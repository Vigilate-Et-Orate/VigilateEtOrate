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
    Notifications.addNotificationReceivedListener((notification) => {
      if (!notification.request.content.title) return
    })
    // return () => {
    //   subscription.remove()
    // }
  }, [])

  return <Stack />
}

export default App
