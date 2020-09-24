import React, { useEffect, useState } from 'react'
import * as Application from 'expo-application'
import { ToastAndroid } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import * as Notifications from 'expo-notifications'
import * as Storage from 'utils/storage/StorageManager'
import * as NativeNotifs from './utils/notification/NotificationManager'
import Stack from './components/layout/Routes'
import { Migration } from 'config/types/System'
import prayers from 'data/prayers.json'
import { Favourite } from 'config/types/Favourite'
import { MyPrayer, Prayer } from 'config/types/Prayer'
import Unboarding from 'screens/Unboarding/Unboarding'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

const migrateData = async () => {
  ToastAndroid.showWithGravity(
    'Migration des données',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM
  )

  const data = await Storage.getDataAsync(Storage.Stored.FAVOURITE)
  if (!data) {
    const favs: Favourite[] = []
    prayers.forEach((prayer: Prayer) => {
      favs.push({ name: prayer.name, fav: false } as Favourite)
    })
    await Storage.setDataAsync(Storage.Stored.FAVOURITE, JSON.stringify(favs))
  }
  ToastAndroid.showWithGravity(
    'Migration terminée !',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM
  )
}

const App = (): JSX.Element => {
  const [unboarded, setUnboarded] = useState(false)

  const launchTest = () => {
    // Check if data was migrated after update
    Storage.getDataAsync(Storage.Stored.LATEST_MIGRATION).then((data) => {
      if (!data) {
        migrateData()
        Storage.setDataAsync(
          Storage.Stored.LATEST_MIGRATION,
          JSON.stringify({
            version: Application.nativeBuildVersion,
            done: true
          } as Migration)
        )
        return
      }
      const migration: Migration = JSON.parse(data)
      if (
        migration.version !== Application.nativeBuildVersion ||
        !migration.done
      ) {
        migrateData()
        migration.version = Application.nativeBuildVersion || '1'
        migration.done = true
        Storage.setDataAsync(
          Storage.Stored.LATEST_MIGRATION,
          JSON.stringify(migration)
        )
      }
    })
    // Check if user is unboarded
    Storage.getDataAsync(Storage.Stored.FIRSTNAME).then((data) => {
      if (!data) {
        setUnboarded(false)
        SplashScreen.hideAsync()
        return
      }
    })
    Storage.getDataAsync(Storage.Stored.MY_PRAYER).then((data) => {
      if (!data) {
        setUnboarded(false)
        SplashScreen.hideAsync()
        return
      }
      const parsed: MyPrayer = JSON.parse(data)
      if (!parsed.title || !parsed.content) {
        setUnboarded(false)
        SplashScreen.hideAsync()
        return
      }
    })
    setUnboarded(true)
    SplashScreen.hideAsync()
  }

  useEffect(() => {
    NativeNotifs.registerForNotificationsAsync()
    // const subscription = Notifications.addPushTokenListener()
    const subReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (!notification) return
      }
    )

    SplashScreen.preventAutoHideAsync()
    launchTest()

    return () => {
      subReceived.remove()
    }
  }, [])

  return unboarded ? <Stack /> : <Unboarding />
}

export default App
