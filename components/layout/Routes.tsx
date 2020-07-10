import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
enableScreens()
import { Image } from 'react-native'

// Screens
import Home from '../../screens/Home'

// Parameters Type
type MainStack = {
  Home: {}
}

function Logo() {
  return (
    <Image
      style={{ width: 40, height: 40, marginRight: 5 }}
      source={require('../../assets/icon-tiny.png')} />
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
      }}>
        <MainStack.Screen
          name="Home"
          component={Home}
          />
    </MainStack.Navigator>
  </NavigationContainer>
)

export default Stack