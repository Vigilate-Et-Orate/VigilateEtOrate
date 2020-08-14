import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import { Title } from 'elements/text/Text'
import prayers from 'data/prayers.json'

type Route = {
  key: string
  name: string
  params: {
    name: string
  }
}

const PrayerScreen = ({ route }: { route: Route }) => {
  const prayer = prayers.find((p) => p.name === route.params.name)
  const [size, setSize] = useState(16)
  const onGestureChange = (event: any) => {
    const newSize = size * event.nativeEvent.scale
    if (newSize < 72 && newSize > 8) setSize(size * event.nativeEvent.scale)
  }
  return (
    <PinchGestureHandler onGestureEvent={onGestureChange}>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Title>{prayer?.displayName}</Title>
        <Text style={{ fontSize: size }}>{prayer?.content}</Text>
        <Text style={{ marginTop: 10, fontSize: size }}>Amen.</Text>
      </ScrollView>
    </PinchGestureHandler>
  )
}

export default PrayerScreen
