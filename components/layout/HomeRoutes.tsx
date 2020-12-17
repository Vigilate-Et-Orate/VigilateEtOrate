import React, { useState, useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, TouchableOpacity, Keyboard, Image, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import * as Analytics from 'expo-firebase-analytics'
import * as SplashScreen from 'expo-splash-screen'
import { useDispatch, connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getNetworkStateAsync } from 'expo-network'

import * as Storage from 'utils/storage/StorageManager'
import theme from 'config/theme'
import { TUser } from 'config/types/User'
import { updateUser } from 'red/actions/UserActions'
import { updateIntentions } from 'red/actions/IntentionsActions'
import {
  getFavourites,
  getNotifs,
  getPrayers,
  getUserData,
  registerDevice
} from 'utils/api/api_server'
import { getIntentions } from 'utils/api/api_firebase'
import { RootState } from 'red/reducers/RootReducer'
import { updatePrayers } from 'red/actions/PrayersActions'
import { getDailyGospel, getDailySaint } from 'utils/api/api_aelf'
import { updateEvangile } from 'red/actions/EvangileActions'
import { updateInformations } from 'red/actions/DailyInformationsActions'
import { TIntention } from 'config/types/Intention'
import { TPrayer } from 'config/types/Prayer'
import { TInformationAelf, TLectureAelf } from 'config/types/AelfApi'
import { updateFavourites } from 'red/actions/FavouritesActions'
import { getExponentToken } from 'utils/notification/NotificationManager'
import { TNotif } from 'config/types/TNotif'
import { updateNotifs } from 'red/actions/NotifsActions'

// Screens
import PrayersScreen from 'screens/PrayersScreen'
import FavouriteScreen from 'screens/FavouriteScreen'
import IntentionsScreen from 'screens/IntentionsScreen'
import Home from 'screens/HomeScreen'

const loadLocal = async (
  dispatch: Dispatch<any>,
  setProgress: (n: number) => void,
  setIsReady: (b: boolean) => void
) => {
  console.log('LOCAL')
  try {
    const user = await Storage.getDataAsync<TUser>(Storage.Stored.USER)
    setProgress(10)
    const intentions = await Storage.getDataAsync<TIntention[]>(
      Storage.Stored.INTENTIONS
    )
    setProgress(20)
    const prayers = await Storage.getDataAsync<TPrayer[]>(
      Storage.Stored.PRAYERS
    )
    setProgress(30)
    const informations = await Storage.getDataAsync<TInformationAelf>(
      Storage.Stored.DAY_INFO
    )
    setProgress(40)
    const evangile = await Storage.getDataAsync<TLectureAelf>(
      Storage.Stored.EVANGILE
    )
    setProgress(50)
    const notifs = await Storage.getDataAsync<TNotif[]>(Storage.Stored.NOTIFS)
    setProgress(90)
    if (
      !user ||
      !intentions ||
      !prayers ||
      !informations ||
      !evangile ||
      !notifs
    )
      return
    dispatch(updateUser(user))
    dispatch(updateIntentions(intentions))
    dispatch(updatePrayers(prayers))
    dispatch(updateEvangile(evangile))
    dispatch(updateInformations(informations))
    dispatch(updateNotifs(notifs))
    setIsReady(true)
  } catch (e) {
    console.error(e.message)
  }
}

const loadOnline = async (
  dispatch: Dispatch<any>,
  token: string,
  setProgress: (n: number) => void,
  setIsReady: (b: boolean) => void
) => {
  console.log('ONLINE')
  try {
    const user = await getUserData(token)
    setProgress(10)
    const intentions = await getIntentions()
    setProgress(20)
    const prayers = await getPrayers()
    setProgress(30)
    const informations = await getDailySaint()
    setProgress(40)
    const evangile = await getDailyGospel()
    setProgress(50)
    const favs = await getFavourites(token)
    setProgress(60)
    const notifs = await getNotifs(token)
    setProgress(70)
    if (
      !user ||
      !intentions ||
      !prayers ||
      !informations ||
      !evangile ||
      !favs ||
      !notifs
    )
      return
    dispatch(updateIntentions(intentions))
    dispatch(updatePrayers(prayers))
    dispatch(updateEvangile(evangile))
    dispatch(updateInformations(informations))
    dispatch(updateFavourites(favs))
    dispatch(updateNotifs(notifs))
    if (!user.devices || user.devices.length <= 0) {
      const expoToken = await getExponentToken()
      const dev = await registerDevice(token, expoToken.data)
      if (dev) user.devices.push(dev)
    }
    dispatch(updateUser(user))
    setProgress(100)
    setIsReady(true)
  } catch (e) {
    console.error('FETCHING ONLINE ERROR', e.message)
    loadLocal(dispatch, setProgress, setIsReady)
  }
}

async function loadData(
  dispatch: Dispatch<any>,
  setProgress: (n: number) => void,
  setIsReady: (b: boolean) => void
) {
  const status = await getNetworkStateAsync()
  const token = await Storage.getDataAsync<string>(Storage.Stored.TOKEN)
  if (status.isInternetReachable && token)
    await loadOnline(dispatch, token, setProgress, setIsReady)
  else await loadLocal(dispatch, setProgress, setIsReady)
}

// Tabs
const Tabs = createMaterialTopTabNavigator()

type TabBarProps = {
  state: any
  descriptors: any
  navigation: any
}

const tabsNameIcon = [
  { name: 'Home', iconName: 'home' },
  { name: 'Intentions', iconName: 'feather-alt' },
  { name: 'Prayers', iconName: 'book' },
  { name: 'Favourite', iconName: 'heart' }
]

const MainTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View
      style={{
        elevation: 20,
        position: 'absolute',
        bottom: 40,
        left: '10%',
        borderRadius: 40,
        width: '80%',
        flexDirection: 'row',
        height: 60,
        zIndex: 40,
        backgroundColor:
          state.index == 1 ? theme.colors.green : theme.colors.blue
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]

        const name = tabsNameIcon.find((i) => i.name == route.name)?.iconName
        const isFocused = state.index == index
        const color = !isFocused
          ? theme.colors.white
          : route.name == 'Intentions'
          ? theme.colors.lightGreen
          : route.name == 'Favourite'
          ? theme.colors.red
          : theme.colors.yellow

        const onPressNav = () => {
          const event = navigation.emit({
            type: 'typePress',
            target: route.key,
            canPreventDefault: true
          })

          if (!isFocused && !event.defaultPrevented)
            navigation.navigate(route.name)
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          })
        }

        return (
          <TouchableOpacity
            testID={options.tabBarTestID}
            onPress={onPressNav}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            key={route.key}
          >
            <FontAwesome5 name={name} size={25} color={color} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const HomeRoutes = ({
  user
}: {
  user: TUser | undefined
  loggedIn: boolean
}): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [isReady, setIsReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [keyboard, setKeyboard] = useState(false)

  useEffect(() => {
    const subRes = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        const data = event.notification.request.content.data
        if (data && (data.prayerName as string)) {
          Analytics.logEvent('notificationClicked', {
            prayer: data.prayerName
          })
          navigation.navigate('Prayer', {
            name: data.prayerName as string
          })
        }
      }
    )
    if (!user) loadData(dispatch, setProgress, setIsReady)
    Storage.getDataAsync(Storage.Stored.TOKEN).then((data) => {
      if (!data) navigation.navigate('SignIn')
    })
    Keyboard.addListener('keyboardDidShow', () => setKeyboard(true))
    Keyboard.addListener('keyboardDidHide', () => setKeyboard(false))

    return () => {
      subRes.remove()
      Keyboard.removeAllListeners('keyboardDidShow')
      Keyboard.removeAllListeners('keyboardDidHide')
    }
  }, [])

  if (!isReady) {
    SplashScreen.hideAsync()
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <View
          style={{
            width: '100%',
            zIndex: 40,
            position: 'absolute',
            bottom: '20%',
            paddingHorizontal: '15%'
          }}
        >
          <View
            style={{
              height: 10,
              width: '100%',
              borderRadius: 20,
              borderColor: '#fff',
              borderWidth: 1
            }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: 'white'
              }}
            ></View>
          </View>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            {progress}%
          </Text>
        </View>
        <Image
          style={{ width: '100%', height: '100%', zIndex: 30 }}
          source={require('../../assets/splash.png')}
        />
      </View>
    )
  }

  return (
    <Tabs.Navigator
      tabBar={(props) => (keyboard ? <View></View> : <MainTabBar {...props} />)}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{ title: 'Accueil' }}
      />
      <Tabs.Screen
        name="Intentions"
        component={IntentionsScreen}
        options={{ title: 'Intentions' }}
      />
      <Tabs.Screen
        name="Prayers"
        component={PrayersScreen}
        options={{ title: 'Prières' }}
      />
      <Tabs.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{ title: 'Favoris' }}
      />
    </Tabs.Navigator>
  )
}

const mapToProps = (state: RootState) => ({
  user: state.user.user
})

export default connect(mapToProps)(HomeRoutes)
