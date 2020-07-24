import React from 'react'
import { useNavigation } from '@react-navigation/native'

import Screen from 'elements/layout/Screen'
import HorizontalRule from 'elements/layout/HorizontalRule'
import Title from 'elements/text/Title'
import Text from 'elements/text/Text'
import { TouchableOpacity } from 'react-native'

const PrayersScreen = () => {
  const navigation = useNavigation()

  return (
    <Screen>
      <Title>Prayers</Title>
      <HorizontalRule />
      <TouchableOpacity onPress={() => navigation.navigate('Angelus')}>
        <Text>Angelus</Text>
      </TouchableOpacity>
    </Screen>
  )
}

export default PrayersScreen
