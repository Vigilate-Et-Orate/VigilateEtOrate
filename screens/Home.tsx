import React from 'react'
import { useNavigation } from '@react-navigation/native'

import * as LocalNotification from '../utils/notification/LocalNotification'
import Title from '../elements/text/Title'
import Screen from '../elements/layout/Screen'
import HorizontalRule from '../elements/layout/HorizontalRule'
import Button from '../elements/buttons/BaseButton'

const Home = () => {
  const navigation = useNavigation()
  return (
    <Screen>
      <Title>Register for notifications</Title>
      <Button
        title="Angélus"
        onPress={LocalNotification.registerForAngelusAsync}
      />
      <Button
        title="Arrêter toutes les notifs"
        onPress={() => navigation.navigate('ManageNotifs')}
      />
      <HorizontalRule />
    </Screen>
  )
}

export default Home
