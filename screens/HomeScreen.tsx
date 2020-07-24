import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import * as LocalNotification from 'utils/notification/LocalNotification'
import Title from 'elements/text/Title'
import Screen from 'elements/layout/Screen'
import HorizontalRule from 'elements/layout/HorizontalRule'
import Button from 'elements/buttons/BaseButton'
import PrayerScreen from 'screens/PrayersScreen'

const Home = () => {
  const navigation = useNavigation()

  return (
    <Screen>
      <Title>Register for notifications</Title>
      <HorizontalRule />
      <Button
        title="Angélus"
        onPress={LocalNotification.registerForAngelusAsync}
      />
      <Button
        title="Arrêter toutes les notifs"
        onPress={() => {
          console.log('Click')
          navigation.navigate('ManageNotifs')
        }}
      />
    </Screen>
  )
}

const Tabs = createMaterialTopTabNavigator()

const HomeScreen = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Prayers" component={PrayerScreen} />
    </Tabs.Navigator>
  )
}

export default HomeScreen
