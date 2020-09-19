import React from 'react'
import { ScrollView, View, Text } from 'react-native'

import { Title, Header } from 'elements/text/Text'
import { Intention } from 'config/types/Intention'

type Route = {
  key: string
  name: string
  params: {
    intention: Intention
  }
}

const IntentionScreen = ({ route }: { route: Route }): JSX.Element => {
  const intention = route.params.intention
  return (
    <ScrollView style={{ marginHorizontal: 20 }}>
      <Title>{intention.title}</Title>
      <Text>{intention.intention}</Text>
      {intention.prayer && (
        <View>
          <Header>Prière Associée</Header>
          <Text>{intention.prayer}</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default IntentionScreen
