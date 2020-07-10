import React from 'react'

import * as LocalNotification from '../utils/notification/LocalNotification'
import Title from '../elements/text/Title'
import Screen from '../elements/layout/Screen'
import HorizontalRule from '../elements/layout/HorizontalRule'
import Button from '../elements/buttons/BaseButton'

const Home = () => (
    <Screen>
      <Title>Register for notifications</Title>
      <Button title="Angélus" onPress={LocalNotification.registerForAngelus}/>
      <Button title="Arrêter toutes les notifs" onPress={LocalNotification.unsubToAll} />
      <HorizontalRule />
    </Screen>
)

export default Home