import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
enableScreens()
import { Image } from 'react-native'

// Screens
import Home from 'screens/HomeScreen'
import ManageNotificationsSubs from 'screens/ManageNotificationsSubs'
import GospelScreen from 'screens/GospelScreen'
import PrayerScreen from 'screens/PrayerScreen'
import MyPrayerScreen from 'screens/MyPrayerScreen'

// Parameters Type
type MainStack = {
  Home: unknown
}

type LogoProps = {
  width: number
  height: number
}

const Logo = ({ width, height }: LogoProps): JSX.Element => (
  <Image
    style={{ width, height, marginRight: 5 }}
    source={require('../../assets/icon-tiny.png')}
  />
)

const MainStack = createNativeStackNavigator()

const Stack = (): JSX.Element => (
  <NavigationContainer>
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#35415A'
        },
        headerTintColor: '#EBEBEB',
        headerRight: () => <Logo width={40} height={40} />
      }}
    >
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Acceuil' }}
      />
      <MainStack.Screen
        name="ManageNotifs"
        component={ManageNotificationsSubs}
        options={{ title: 'Gérer les Notifications' }}
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
        name="MyPrayer"
        component={MyPrayerScreen}
        options={{ title: 'Ma Prière' }}
      />
    </MainStack.Navigator>
  </NavigationContainer>
)

export default Stack
