import React, { useState, useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, TouchableOpacity, Keyboard, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import * as Analytics from 'expo-firebase-analytics'
import * as SplashScreen from 'expo-splash-screen'
import { useDispatch, connect } from 'react-redux'

import theme from 'config/theme'
import { RootState } from 'red/reducers/RootReducer'
import { updateKeyboard } from 'red/actions/KeyboardActions'
import { loadData } from 'utils/loadData/loadData'

// Screens
import PrayersScreen from 'screens/PrayersScreen'
import FavouriteScreen from 'screens/FavouriteScreen'
import IntentionsScreen from 'screens/IntentionsScreen'
import Home from 'screens/HomeScreen'
import firebase from 'utils/firebase'

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

const bgColours = [
  theme.colors.blue,
  theme.colors.green,
  theme.colors.yellow,
  theme.colors.red
]

const MainTabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View
      style={[
        styles.navBackground,
        {
          backgroundColor: bgColours[state.index]
        }
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]

        const name = tabsNameIcon.find((i) => i.name == route.name)?.iconName
        const isFocused = state.index == index
        const color = !isFocused
          ? theme.colors.white
          : route.name == 'Home'
          ? theme.colors.yellow
          : theme.colors.blue

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
            style={styles.navButtons}
            key={route.key}
          >
            <FontAwesome5 name={name} size={25} color={color} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const HomeRoutes = ({ keyboard }: { keyboard: boolean }): JSX.Element => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [loadedOnce, setLoadedOnce] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        SplashScreen.hideAsync()
        navigation.navigate('Welcome')
      } else {
        loadData(dispatch, () => SplashScreen.hideAsync())
      }
    })
    if (!loadedOnce) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowAlert: true
        })
      })
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
      Keyboard.addListener('keyboardDidShow', () =>
        dispatch(updateKeyboard(true))
      )
      Keyboard.addListener('keyboardDidHide', () =>
        dispatch(updateKeyboard(false))
      )
      setLoadedOnce(true)

      return () => {
        subRes.remove()
      }
    }
  }, [])

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

const styles = StyleSheet.create({
  navBackground: {
    borderRadius: 40,
    bottom: 20,
    elevation: 20,
    flexDirection: 'row',
    height: 60,
    left: '10%',
    position: 'absolute',
    width: '80%',
    zIndex: 40
  },
  navButtons: { alignItems: 'center', flex: 1, justifyContent: 'center' }
})

const mapToProps = (state: RootState) => ({
  keyboard: state.keyboard
})

export default connect(mapToProps)(HomeRoutes)
