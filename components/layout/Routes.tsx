import React, { useRef } from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
enableScreens()
import * as Analytics from 'expo-firebase-analytics'

// Screens
import Home from 'screens/HomeScreen'
import GospelScreen from 'screens/GospelScreen'
import PrayerScreen from 'screens/PrayerScreen'
import MyPrayerScreen from 'screens/MyPrayerScreen'
import IntentionScreen from 'screens/IntentionScreen'
import SettingsScreen from 'screens/SettingsScreen'
import StartUnboarding from 'screens/Unboarding/Unboarding'
import Unboarding from 'components/layout/UnboardingRoutes'

// Parameters Type
type MainStack = {
  Home: unknown
}

const MainStack = createNativeStackNavigator()

const Stack = (): JSX.Element => {
  const routeNameRef = useRef()
  const navigationRef = useRef<any>()

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current?.getCurrentRoute().name)
      }
      onStateChange={() => {
        const previousRouteName = routeNameRef.current
        const currentRouteName = navigationRef.current.getCurrentRoute().name

        if (previousRouteName !== currentRouteName) {
          Analytics.setCurrentScreen(currentRouteName)
        }

        routeNameRef.current = currentRouteName
      }}
    >
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <MainStack.Screen name="StartUnboard" component={StartUnboarding} />
        <MainStack.Screen name="Unboarding" component={Unboarding} />
        <MainStack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Accueil' }}
        />
        <MainStack.Screen
          name="Evangile"
          component={GospelScreen}
          options={{ title: 'Evangile' }}
        />
        <MainStack.Screen
          name="Prayer"
          component={PrayerScreen}
          options={{ title: 'Prière' }}
        />
        <MainStack.Screen
          name="Intention"
          component={IntentionScreen}
          options={{ title: 'Intention de Prière' }}
        />
        <MainStack.Screen
          name="MyPrayer"
          component={MyPrayerScreen}
          options={{ title: 'Ma Prière' }}
        />
        <MainStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Parametres' }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}

export default Stack
