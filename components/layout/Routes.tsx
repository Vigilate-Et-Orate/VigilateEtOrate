import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
enableScreens()
import { Image } from 'react-native'

// Screens
import Home from 'screens/HomeScreen'
import ManageNotificationsSubs from 'screens/ManageNotificationsSubs'
import Angelus from 'screens/Prayers/Angelus'
import GospelScreen from 'screens/GospelScreen'
import PrayerScreen from 'screens/PrayerScreen'

// Parameters Type
type MainStack = {
  Home: unknown
}

function Logo() {
  return (
    <Image
      style={{ width: 40, height: 40, marginRight: 5 }}
      source={require('../../assets/icon-tiny.png')}
    />
  )
}

const MainStack = createNativeStackNavigator()

const Stack = () => (
  <NavigationContainer>
    <MainStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#35415A'
        },
        headerTintColor: '#EBEBEB',
        headerRight: (props: any) => <Logo {...props} />
      }}
    >
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen
        name="ManageNotifs"
        component={ManageNotificationsSubs}
        options={{ title: 'Manage Notifications' }}
      />
      <MainStack.Screen name="Angelus" component={Angelus} />
      <MainStack.Screen name="Evangile" component={GospelScreen} />
      <MainStack.Screen name="Prayer" component={PrayerScreen} />
    </MainStack.Navigator>
  </NavigationContainer>
)

export default Stack
